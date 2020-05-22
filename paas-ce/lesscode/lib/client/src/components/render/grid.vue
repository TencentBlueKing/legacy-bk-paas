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
    <div :ref="`${renderData.componentId}-wrapper`" class="bk-layout-grid-row-wrapper">
        <render-row v-bind="bindProps"
            :style="renderData.renderStyles"
            :ref="renderData.componentId"
            @click.native.stop="rowClickHandler(renderData, $event)"
            @contextmenu.native="rowClickHandler(renderData, $event)"
            @mouseover.native.stop="rowMouseoverHandler(renderData)"
            @mouseout.native.stop="rowMouseoutHandler(renderData)">
            <context-menu class="grid-context-menu"
                :target="contextMenuTarget"
                :show="contextMenuVisible"
                @update:show="show => contextMenuVisible = show">
                <a href="javascript:;" @click="handleContextmenuDelete">删除</a>
            </context-menu>
            <render-col v-bind="column" :key="columnIndex" v-for="(column, columnIndex) in renderDataSlot.val"
                :class="columnIndex === renderDataSlot.val.length - 1 ? 'last' : ''">
                <vue-draggable
                    class="drag-area target-in-column"
                    :sort="true"
                    :list="column.children"
                    :group="{ name: groupType, pull: true, put: ['render-grid', 'component'] }"
                    ghost-class="in-column-ghost"
                    chosen-class="in-column-chosen"
                    drag-class="in-column-drag"
                    :data-component-id="renderData.componentId"
                    :data-column-index="columnIndex"
                    @change="log(arguments, column)"
                    @choose="onChoose(arguments, column)"
                    @end="onEnd"
                >
                    <render-component
                        v-for="itemInColumn in column.children"
                        :key="itemInColumn.componentId"
                        :component-data="itemInColumn" />
                </vue-draggable>
            </render-col>
            <div class="add-column" @click="handleAddColumn">+</div>
            <div class="add-clone" @click="handleAddClone">+</div>
        </render-row>
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

    export default {
        name: 'render-grid',
        components: {
            renderRow,
            renderCol,
            renderComponent
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                groupType: 'component',
                renderData: {},
                renderDataSlot: null,
                bindProps: {},
                contextMenuVisible: false,
                contextMenuTarget: null
            }
        },
        computed: {
            ...mapGetters('drag', [
                'targetData'
            ])
        },
        watch: {
            renderDataSlot () {
                this.setColWidth()
            }
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
                'setTargetData'
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
                if (this.renderData.renderProps.slots) {
                    this.renderDataSlot = this.renderData.renderProps.slots
                }
            },

            /**
             * on-update-props:grid 事件回调
             *
             * @param {Object} data 更新的数据
             */
            updatePropsHandler (data) {
                if (data.componentId === this.renderData.componentId) {
                    const { renderStyles = {}, renderProps = {}, tabPanelActive = 'props' } = data.modifier
                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.tabPanelActive = tabPanelActive
                    this.updateBindProps()
                }
            },

            log (e, column) {
                // console.warn(column)
                // console.error('eeeee', e, column)
            },

            onChoose (e, column) {
                const evt = e[0]
                const curChooseComponent = column.children[evt.oldIndex]
                this.groupType = curChooseComponent.type === 'render-grid' ? 'render-grid' : 'component'
            },

            /**
             * 行点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            rowClickHandler (renderData, e) {
                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.component-wrapper', 'selected')

                const curRowNode = getNodeWithClass(e.target, 'bk-layout-grid-row')
                curRowNode.classList.add('selected')

                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
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

            onEnd (e) {
                // console.error('onEnd2222', e)
            },
            handleAddColumn () {
                if (this.renderData.renderProps.slots.val.length === 12) {
                    this.messageWarn('最多支持12栅格')
                    return
                }
                this.renderData.renderProps.slots.val.push({ span: 1, children: [] })
                this.updateBindProps()
                this.setColWidth()
            },
            handleAddClone () {
                const parentRow = findComponentParentRow(this.targetData, this.renderData.componentId)
                const selfIndex = _.findIndex(parentRow, _ => _.componentId === this.renderData.componentId)
                console.log('fome clone grid', selfIndex)
                const renderProps = _.cloneDeep(this.componentData.renderProps)
                renderProps.slots.val = this.renderData.renderProps.slots.val.map(() => ({ span: 1, children: [] }))

                parentRow.splice(selfIndex + 1, 0, {
                    componentId: this.componentData.name + '-' + uuid(),
                    name: this.componentData.name,
                    type: this.componentData.type,
                    renderProps,
                    renderStyles: {},
                    renderEvents: {}
                })
            }
        }
    }
</script>
<style lang="postcss">
    @import "./grid.css";
</style>
