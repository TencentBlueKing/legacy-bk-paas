<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div :data-component-id="`grid-${renderData.componentId}`" :ref="`${renderData.componentId}-wrapper`">
        <!-- <free-layout v-if="renderData.type === 'free-layout'"></free-layout> -->
        <render-row v-bind="bindProps"
            :style="Object.assign({}, renderData.renderStyles, (renderData.renderStyles && renderData.renderStyles.customStyle) || {})"
            :ref="renderData.componentId"
            @click.native.stop="rowClickHandler(renderData, $event)"
            @contextmenu.stop="rowClickHandler(renderData, $event)"
            @mouseover.native.stop="rowMouseoverHandler(renderData)"
            @mouseout.native.stop="rowMouseoutHandler(renderData)">
            <component-menu class="grid-context-menu"
                :target="contextMenuTarget"
                :show="contextMenuVisible"
                :offset="getComputedMunuOffset"
                @update:show="show => contextMenuVisible = show">
                <a href="javascript:;" @click="handleContextmenuDelete">删除栅格布局</a>
                <a href="javascript:;" @click="handleContextmenuClearGrid">清空栅格布局</a>
            </component-menu>
            <render-col v-bind="column" :key="columnIndex" v-for="(column, columnIndex) in renderDataSlot.val"
                :class="columnIndex === renderDataSlot.val.length - 1 ? 'last' : ''">
                <vue-draggable
                    :component-data="column"
                    class="drag-area target-in-column"
                    :sort="true"
                    :list="column.children"
                    :group="{ name: groupType, pull: true, put: ['render-grid', 'free-layout', 'component', ...extraDragCls] }"
                    ghost-class="in-column-ghost"
                    chosen-class="in-column-chosen"
                    drag-class="in-column-drag"
                    :data-component-id="renderData.componentId"
                    :data-column-index="columnIndex"
                    :move="onMove"
                    @change="log(arguments, column)"
                    @choose="onChoose(arguments, column)"
                    @start="onStart"
                    @end="onEnd">
                    <render-component
                        v-for="itemInColumn in column.children"
                        :key="itemInColumn.renderKey"
                        :component-data="itemInColumn" />
                </vue-draggable>
            </render-col>
            <div class="add-column" @click="handleAddColumn">
                <!-- <i class="bk-icon bk-drag-icon bk-drag-add-line"></i> -->
                <img src="../../images/svg/add-line.svg" />
            </div>
            <div class="add-clone" @click="handleAddClone">
                <!-- <i class="bk-icon bk-drag-icon bk-drag-add-line"></i> -->
                <img src="../../images/svg/add-line.svg" />
            </div>
        </render-row>

        <bk-dialog v-model="clearGridConf.visiable"
            class="del-component-dialog"
            theme="primary"
            :mask-close="false"
            :header-position="clearGridConf.headerPosition"
            title="清空"
            @confirm="confirmClearGrid"
            @cancel="cancelClearGrid"
            @after-leave="afterLeaveClearGrid">
            <div>
                <p>确认清空{{renderData.name}}组件【{{renderData.componentId}}】？</p>
            </div>
        </bk-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters, mapMutations } from 'vuex'

    import { bus } from '@/common/bus'
    import {
        uuid, getNodeWithClass, removeClassWithNodeClass, findComponentParentRow/* , getStyle, getParentByCls, siblings */
    } from '@/common/util'
    import renderRow from './row'
    import renderCol from './col'
    import renderComponent from './component'
    import freeLayout from './free-layout'
    import ComponentMenu from '@/components/widget/context-menu.vue'
    import offsetMixin from './offsetMixin'

    export default {
        name: 'render-grid',
        components: {
            renderRow,
            renderCol,
            renderComponent,
            // eslint-disable-next-line vue/no-unused-components
            freeLayout,
            ComponentMenu
        },
        mixins: [offsetMixin],
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            },
            extraDragCls: {
                type: Array,
                default: () => ['interactiveInnerComp']
            }
        },
        data () {
            return {
                groupType: 'component',
                renderData: {},
                renderDataSlot: null,
                bindProps: {},
                startDragPosition: {},
                contextMenuVisible: false,
                contextMenuTarget: null,
                clearGridConf: {
                    visiable: false,
                    headerPosition: 'left'
                }
            }
        },
        computed: {
            ...mapGetters('drag', [
                'targetData',
                'curSelectedComponentData'
            ])
        },
        created () {
            this.renderData = this.componentData
            // 直接 json 回溯的话，json 配置中不会有 componentId
            if (!this.componentData.componentId) {
                // this.renderData.componentId = this.componentData.name + '-' + uuid()
                this.renderData.componentId = this.componentData.name + '-' + uuid()
            }

            if (this.renderData.renderProps.slots) {
                this.renderDataSlotName = this.renderData.renderProps.slots.name
            }
            this.updateBindProps()
            this.updateBindSlots()
            this.setColWidth()

            bus.$on('on-update-props', this.updatePropsHandler)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-update-props', this.updatePropsHandler)
            })
        },
        mounted () {
            this.contextMenuTarget = this.renderData.type === 'render-grid'
                ? this.$refs[`${this.renderData.componentId}-wrapper`]
                : null
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData',
                'pushTargetHistory',
                'setFreeLayoutItemPlaceholderPointerEvents'
            ]),

            /**
             * 右键删除 grid
             */
            handleContextmenuDelete () {
                setTimeout(() => {
                    const delBtn = document.querySelector('#del-component-right-sidebar')
                    delBtn && delBtn.click()
                }, 0)
                this.contextMenuVisible = false
            },

            /**
             * 右键清空 grid
             */
            handleContextmenuClearGrid () {
                this.clearGridConf.visiable = true
            },

            /**
             * 显示清空 grid 的弹框
             */
            confirmClearGrid () {
                const renderData = Object.assign({}, this.renderData)
                renderData.renderSlots.default.val.forEach(v => {
                    v.children = []
                })
                this.renderData = Object.assign({}, renderData)
                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
                this.contextMenuVisible = false
            },

            /**
             * 取消清空 grid 的弹框
             */
            cancelClearGrid () {
                this.clearGridConf.visiable = false
            },

            /**
             * 取消清空 grid 的弹框 afterLeave 回调
             */
            afterLeaveClearGrid () {
            },

            /**
             * 设置每列的宽度
             */
            setColWidth () {
                let sumSpan = 0
                this.renderDataSlot.val.forEach(d => {
                    sumSpan += d.span
                })
                this.renderDataSlot.val.forEach(d => {
                    d.width = `${Number((d.span / sumSpan * 100).toFixed(4))}%`
                })
            },

            updateBindProps () {
                const { renderProps } = this.renderData
                const bindProps = {}
                Object.keys(renderProps).forEach(renderPropsKey => {
                    bindProps[renderPropsKey] = renderProps[renderPropsKey].val
                })
                this.bindProps = bindProps
                // debugger
                // if (this.renderData.renderProps.slots) {
                //     this.renderDataSlot = this.renderData.renderProps.slots
                // }
            },

            updateBindSlots () {
                if (this.renderData.renderSlots) {
                    this.renderDataSlot = this.renderData.renderSlots.default
                }
            },

            /**
             * on-update-props:grid 事件回调
             *
             * @param {Object} data 更新的数据
             */
            updatePropsHandler (data) {
                if (data.componentId === this.renderData.componentId) {
                    const pushData = {
                        type: 'update',
                        component: _.cloneDeep(this.renderData),
                        modifier: data.modifier
                    }
                    this.pushTargetHistory(pushData)
                    const { renderStyles = {}, renderProps = {}, tabPanelActive = 'props', renderDirectives = [], renderSlots = {} } = data.modifier
                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.renderDirectives = renderDirectives
                    this.renderData.renderSlots = renderSlots
                    this.renderData.tabPanelActive = tabPanelActive
                    this.updateBindProps()
                    this.updateBindSlots()
                    this.setColWidth()
                }
            },

            log (e, column) {
                const evt = e[0] || {}
                const addEle = evt.added
                const removedEle = evt.removed
                const moveEle = evt.moved
                const element = (addEle || removedEle || moveEle).element
                const pos = this.$td().getNodePosition(element.componentId)

                const pushData = {
                    parentId: pos.parent && pos.parent.componentId,
                    component: element,
                    columnIndex: pos.columnIndex,
                    childrenIndex: pos.childrenIndex
                }
                if (addEle) {
                    pushData.type = 'add'
                }
                if (removedEle) {
                    pushData.type = 'remove'
                    pushData.parentId = this.startDragPosition.parent && this.startDragPosition.parent.componentId
                    pushData.columnIndex = this.startDragPosition.columnIndex
                    pushData.childrenIndex = this.startDragPosition.childrenIndex
                }
                if (moveEle) {
                    pushData.type = 'move'
                    pushData.sourceParentNodeId = pushData.parentId
                    pushData.sourceColumnIndex = pos.columnIndex
                    pushData.sourceChildrenIndex = moveEle.oldIndex
                    pushData.targetParentNodeId = pushData.parentId
                    pushData.targetColumnIndex = pos.columnIndex
                    pushData.targetChildrenIndex = moveEle.newIndex
                }
                this.pushTargetHistory(pushData)
            },

            onChoose (e, column) {
                const evt = e[0]
                const curChooseComponent = column.children[evt.oldIndex]
                this.startDragPosition = this.$td().getNodePosition(curChooseComponent.componentId)
                // this.groupType = curChooseComponent.type === 'render-grid' ? 'render-grid' : 'component'

                let groupType = ''
                if (curChooseComponent.type === 'render-grid') {
                    groupType = 'render-grid'
                } else if (curChooseComponent.type === 'free-layout') {
                    groupType = 'free-layout'
                } else {
                    groupType = 'component'
                }
                this.groupType = groupType
            },

            onMove (evt, originalEvent) {
                // console.error(evt)
                // console.error(originalEvent)
            },

            /**
             * 行点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            rowClickHandler (renderData, e) {
                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'selected')
                removeClassWithNodeClass('.component-wrapper', 'selected')
                removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')

                const curRowNode = getNodeWithClass(e.target, 'bk-layout-grid-row')
                curRowNode.classList.add('selected')

                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))

                bus.$emit('selected-tree', this.renderData.componentId)
            },

            /**
             * 组件 mouseenter 事件回调
             *
             * @param {Object} renderData 当前行数据
             */
            rowMouseoverHandler (renderData) {
                const targetNode = this.$refs[renderData.componentId].$el

                // removeClassWithNodeClass('.bk-layout-grid-row', 'row-hover')
                targetNode.classList.add('row-hover')
            },

            /**
             * 组件 mouseleave 事件回调
             *
             * @param {Object} renderData 当前行数据
             */
            rowMouseoutHandler (renderData) {
                const targetNode = this.$refs[renderData.componentId].$el
                targetNode.classList.remove('row-hover')
            },

            removeRow (e) {
                e.stopPropagation()
            },

            onStart (e) {
                this.setFreeLayoutItemPlaceholderPointerEvents('all')
                // console.error('onEnd2222', e)
            },

            onEnd (e) {
                this.setFreeLayoutItemPlaceholderPointerEvents('none')
                // console.error('onEnd2222', e)
            },

            handleAddColumn () {
                if (this.renderData.renderSlots.default.val.length === 12) {
                    this.messageWarn('最多支持12栅格')
                    return
                }
                this.renderData.renderSlots.default.val.push({ span: 1, children: [] })
                this.updateBindProps()
                this.setColWidth()
            },
            handleAddClone () {
                const parentRow = findComponentParentRow(this.targetData, this.renderData.componentId)
                const selfIndex = _.findIndex(parentRow, _ => _.componentId === this.renderData.componentId)
                console.log('fome clone grid', selfIndex)
                const renderProps = _.cloneDeep(this.componentData.renderProps)
                const renderSlots = _.cloneDeep(this.componentData.renderSlots)
                renderSlots.default.val = this.renderData.renderSlots.default.val.map(() => ({ span: 1, children: [] }))

                parentRow.splice(selfIndex + 1, 0, {
                    componentId: this.componentData.name + '-' + uuid(),
                    tabPanelActive: this.componentData.tabPanelActive,
                    renderKey: uuid(),
                    name: this.componentData.name,
                    type: this.componentData.type,
                    renderProps,
                    renderStyles: {},
                    renderEvents: {},
                    renderDirectives: [],
                    renderSlots
                })
            }
        }
    }
</script>
<style lang="postcss">
    @import "./grid.css";
</style>
