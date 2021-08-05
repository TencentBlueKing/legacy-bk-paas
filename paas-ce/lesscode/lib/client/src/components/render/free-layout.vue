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
    <div class="bk-lesscode-free-layout"
        :data-component-id="`free-layout-${renderData.componentId}`"
        :ref="renderData.componentId"
        :style="Object.assign({}, renderData.renderStyles, (renderData.renderStyles && renderData.renderStyles.customStyle) || {})"
        @click.stop="freeLayoutClickHandler(renderData, $event)"
        @contextmenu.stop="freeLayoutClickHandler(renderData, $event)"
        @mouseover.stop="freeLayoutMouseHandler(renderData, 'enter')"
        @mouseout.stop="freeLayoutMouseHandler(renderData, 'leave')">
        <component-menu class="free-layout-context-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            :offset="getComputedMunuOffset"
            @update:show="show => contextMenuVisible = show">
            <a href="javascript:;" @click="handleContextmenuDelete">删除自由布局</a>
            <a href="javascript:;" @click="handleContextmenuClearFreeLayout">清空自由布局</a>
        </component-menu>
        <div class="free-layout-item-inner">
            <vue-draggable :style="{ height: renderData.renderStyles.height || '500px' }"
                :group="{ pull: true, put: ['component', ...extraDragCls] }"
                ghost-class="in-free-layout-item-ghost"
                :force-fallback="false"
                :list="renderDataSlot.val[0].children">
                <div class="free-layout-item-placeholder" :style="{ height: renderData.renderStyles.height || '500px', pointerEvents: freeLayoutItemPlaceholderPointerEvents }"></div>
                <render-component
                    style="position: absolute;"
                    @component-mousedown="mousedown"
                    @component-mounted="componentMounted"
                    v-for="slotData in renderDataSlot.val[0].children"
                    :key="slotData.renderKey"
                    :component-data="slotData">
                </render-component>
            </vue-draggable>
        </div>

        <bk-dialog v-model="clearFreeLayoutConf.visiable"
            class="del-component-dialog"
            theme="primary"
            :mask-close="false"
            :header-position="clearFreeLayoutConf.headerPosition"
            title="清空"
            @confirm="confirmClearFreeLayout"
            @cancel="cancelClearFreeLayout"
            @after-leave="afterLeaveClearFreeLayout">
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
    import { uuid, getNodeWithClass, removeClassWithNodeClass } from '@/common/util'

    import renderComponent from './component'
    import DragLine from '@/common/drag-line'
    // eslint-disable-next-line no-unused-vars
    import Drag from '@/common/drag'
    import ComponentMenu from '@/components/widget/context-menu.vue'
    import offsetMixin from './offsetMixin'

    export default {
        name: 'free-layout',
        components: {
            // eslint-disable-next-line vue/no-unused-components
            renderComponent,
            ComponentMenu
        },
        mixins: [offsetMixin],
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            },
            // vueDrabable所用的需要额外添加的groupName
            extraDragCls: {
                type: Array,
                default: () => ['interactiveInnerComp']
            }
        },
        data () {
            return {
                groupType: 'component',
                renderDataSlot: null,
                bindProps: {},
                dragLine: null,
                drag: null,
                contextMenuTarget: null,
                contextMenuVisible: false,
                clearFreeLayoutConf: {
                    visiable: false,
                    headerPosition: 'left'
                }
            }
        },
        computed: {
            ...mapGetters('drag', [
                'targetData',
                'curSelectedComponentData',
                'freeLayoutItemPlaceholderPointerEvents'
            ])
        },
        watch: {
        },
        created () {
            this.renderData = this.componentData
            // 直接 json 回溯的话，json 配置中不会有 componentId
            if (!this.componentData.componentId) {
                this.renderData.componentId = this.componentData.name + '-' + uuid()
            }

            this.updateBindProps()
            this.updateBindSlots()

            bus.$on('on-update-props', this.updatePropsHandler)
            bus.$on('on-update-free-layout-props', this.updateFreeLayoutPropsHandler)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-update-props', this.updatePropsHandler)
                bus.$off('on-update-free-layout-props', this.updateFreeLayoutPropsHandler)
            })
        },
        mounted () {
            this.contextMenuTarget = this.renderData.type === 'free-layout'
                ? this.$refs[`${this.renderData.componentId}`]
                : null
            this.dragLine = new DragLine({ container: this.$el, offset: this.layoutOffset })
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData',
                'pushTargetHistory'
            ]),

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
                this.renderDataSlot = this.renderData.renderSlots.default
            },

            /**
             * on-update-free-layout-props:free-layout 事件回调
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
                    // const { renderStyles = {}, renderProps = {}, tabPanelActive = 'props' } = data.modifier
                    const {
                        renderStyles = this.renderData.renderStyles,
                        renderProps = this.renderData.renderProps,
                        tabPanelActive = 'props',
                        renderDirectives = this.renderData.renderDirectives,
                        renderSlots = this.renderData.renderSlots
                    } = data.modifier
                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.renderDirectives = renderDirectives
                    this.renderData.renderSlots = renderSlots
                    this.renderData.tabPanelActive = tabPanelActive
                    this.updateBindProps()
                    this.updateBindSlots()
                }
            },

            /**
             * on-update-free-layout-props:free-layout 事件回调
             *
             * @param {Object} data 更新的数据
             */
            updateFreeLayoutPropsHandler (data) {
                this.updatePropsHandler(data)

                // 更新属性时，检测元素的 top + height 是否超过了容器的高度，如果超过了，那么就改变容器的高度
                // 更新自由布局高度之后，需要把 Drag 和 dragLine 实例的 container 重新设置一下。因此调用 doDrag，如果不调用，
                // 出现的问题是自由布局高度增加，这时首次点击元素是没法拖动到增加后的高度中，第二次点击元素才可以拖动到增加后的高度中去
                setTimeout(() => {
                    this.doDrag(data.dragNode, data.renderData)
                })
            },

            /**
             * 右键删除 free-layout
             */
            handleContextmenuDelete () {
                setTimeout(() => {
                    const delBtn = document.querySelector('#del-component-right-sidebar')
                    delBtn && delBtn.click()
                }, 0)
                this.contextMenuVisible = false
            },

            /**
             * 右键清空 free-layout
             */
            handleContextmenuClearFreeLayout () {
                this.clearFreeLayoutConf.visiable = true
            },

            /**
             * 显示清空 free-layout 的弹框
             */
            confirmClearFreeLayout () {
                const renderData = Object.assign({}, this.renderData)
                renderData.renderSlots.default.val.forEach(v => {
                    v.children = []
                })
                this.renderData = Object.assign({}, renderData)
                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
                this.contextMenuVisible = false
            },

            /**
             * 取消清空 free-layout 的弹框
             */
            cancelClearFreeLayout () {
                this.clearFreeLayoutConf.visiable = false
            },

            /**
             * 取消清空 free-layout 的弹框 afterLeave 回调
             */
            afterLeaveClearFreeLayout () {
            },

            /**
             * free-layout mouseenter mouseleave 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {string} idx 标识是 enter 还是 leave
             */
            freeLayoutMouseHandler (renderData, idx) {
                const targetNode = this.$refs[renderData.componentId]
                let hook = 'add'
                if (idx === 'leave') {
                    hook = 'remove'
                }
                targetNode.classList[hook]('free-layout-hover')
            },

            /**
             * free-layout 点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            freeLayoutClickHandler (renderData, e) {
                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'selected')
                removeClassWithNodeClass('.component-wrapper', 'selected')
                removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')

                const curRowNode = getNodeWithClass(e.target, 'bk-lesscode-free-layout')
                curRowNode.classList.add('selected')

                this.contextMenuVisible = false
                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
                bus.$emit('selected-tree', this.renderData.componentId)
            },

            /**
             * 设置默认的样式，有的组件没有设置尺寸等样式，在自由布局中由于绝对定位的原因会显示异常，需要设置一些默认样式来适配
             *
             * @param {Object} renderData 当前 component 数据
             */
            setStyle4Component (renderData) {
                switch (renderData.type) {
                    case 'bk-tag-input':
                        renderData.renderStyles.width = renderData.renderStyles.width || '200px'
                        break
                    case 'bk-slider':
                        renderData.renderStyles.width = renderData.renderStyles.width || '200px'
                        break
                    case 'bk-select':
                        renderData.renderStyles.width = renderData.renderStyles.width || '200px'
                        break
                    case 'bk-member-selector':
                        renderData.renderStyles.width = renderData.renderStyles.width || '400px'
                        break
                    case 'bk-cascade':
                        renderData.renderStyles.width = renderData.renderStyles.width || '200px'
                        break
                    case 'bk-process':
                        renderData.renderStyles.width = renderData.renderStyles.width || '600px'
                        break
                    case 'bk-steps':
                        renderData.renderStyles.width = renderData.renderStyles.width || '500px'
                        break
                    case 'bk-badge':
                        // 避免 .bk-badge.bk-primary.top-right.pinned 拖动
                        renderData.renderStyles.pointerEvents = renderData.renderStyles.pointerEvents || 'none'
                        break
                    case 'bk-divider':
                        renderData.renderStyles.width = renderData.renderStyles.width || '500px'
                        break
                    default:
                }
            },

            /**
             * 组件 wrapper mounted 事件回调
             *
             * @param {Object} { renderData 当前 component 数据, elem: component dom 节点 }
             */
            componentMounted (data) {
                if (!this.dragLine) {
                    this.dragLine = new DragLine({ container: this.$el, offset: this.layoutOffset })
                }

                const renderData = data.renderData
                this.setStyle4Component(renderData)
                this.doDrag(data.elem, renderData)

                // console.error('componentMounted', renderData)

                // 需要 emit 一次，因为刚拖入到自由布局中的组件还没有拖动，不会触发 end 事件
                bus.$emit('on-update-props', {
                    componentId: renderData.componentId,
                    modifier: {
                        tabPanelActive: renderData.tabPanelActive,
                        renderEvents: renderData.renderEvents,
                        renderDirectives: renderData.renderDirectives,
                        renderProps: Object.assign(
                            {},
                            renderData.renderProps,
                            { inFreeLayout: { val: true } }
                        ),
                        renderStyles: Object.assign(
                            {},
                            renderData.renderStyles,
                            { top: renderData.renderStyles.top || '0px', left: renderData.renderStyles.left || '0px' }
                        ),
                        renderSlots: renderData.renderSlots
                    }
                })
            },

            /**
             * 组件 wrapper mousedown 事件回调
             *
             * @param {Object} { renderData 当前 component 数据, e 事件对象 }
             */
            mousedown (data) {
                const e = data.originalEvent
                e.stopPropagation()
                e.preventDefault()
                this.doDrag(e.target, data.renderData)
            },

            doDrag (dragNode, renderData) {
                // 自由布局里面拖动自由布局时会有异常体验问题
                if (dragNode.className !== undefined && dragNode.className.indexOf('wrapperCls') < 0) {
                    return
                }
                this.drag = new Drag(dragNode, {
                    container: dragNode.parentNode
                })

                this.dragLine.setContainer(dragNode.parentNode)

                this.drag.on('move', () => {
                    this.dragLine.check(this.drag.$elem, '.component-wrapper')
                }).on('end', () => {
                    this.dragLine.uncheck()
                    // let top = this.drag.$elem.style.top
                    // if (!/^\d+\.{0,1}\d+%$/.test(top)) {
                    //     top = ((parseFloat(this.drag.$elem.style.top) / this.drag.containerHeight * 100).toFixed(4) + '%')
                    // }

                    // let left = this.drag.$elem.style.left
                    // if (!/^\d+\.{0,1}\d+%$/.test(left)) {
                    //     left = ((parseFloat(this.drag.$elem.style.left) / this.drag.containerWidth * 100).toFixed(4) + '%')
                    // }
                    const left = parseFloat(this.drag.$elem.style.left)
                    const top = parseFloat(this.drag.$elem.style.top)
                    const offset = {
                        left: left + 'px',
                        top: top + 'px'
                    }
                    // console.error('end')
                    // console.error(dragNode, dragNode.getBoundingClientRect(), renderData.renderStyles, offset)
                    // console.error(dragNode.getBoundingClientRect().height + top)
                    bus.$emit('on-update-props', {
                        componentId: renderData.componentId,
                        modifier: {
                            tabPanelActive: renderData.tabPanelActive,
                            renderEvents: renderData.renderEvents,
                            renderDirectives: renderData.renderDirectives,
                            renderProps: Object.assign(
                                {},
                                renderData.renderProps,
                                { inFreeLayout: { val: true } }
                            ),
                            renderStyles: Object.assign(
                                {},
                                renderData.renderStyles,
                                offset
                            ),
                            renderSlots: renderData.renderSlots
                        }
                    })
                })
            }
        }
    }
</script>
<style lang="postcss">
    @import "./free-layout.css";
</style>
