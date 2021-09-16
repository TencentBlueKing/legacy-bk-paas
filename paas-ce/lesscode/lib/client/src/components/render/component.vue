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
    <div
        class="wrapperCls"
        :ref="`${renderData.componentId}-wrapper`"
        :data-component-id="`component-${renderData.componentId}`"
        :base-component="isBaseComponent"
        :class="wrapperClasses"
        :style="wrapperStyles"
        @mousedown.stop="componentWrapperMousedownHandler(renderData, $event)"
        @mouseenter.stop="componentWrapperMouseenterHandler(renderData, $event)"
        @mouseleave.stop="componentWrapperMouseleaveHandler(renderData, $event)"
        @click.stop="componentWrapperClickHandler(renderData, $event)"
        @contextmenu.stop="componentWrapperClickHandler(renderData, $event)">
        <component-menu
            class="component-context-menu context-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            :offset="getComputedMunuOffset"
            @update:show="show => contextMenuVisible = show">
            <a href="javascript:;" @click="handleContextmenuDelete">删除组件</a>
        </component-menu>
        <component-wrapper
            :render-data="renderData"
            :bind-props="bindProps"
            :refresh-key="renderDataSlotRefreshKey"
            :component-data="componentData"
            :ref="renderData.componentId">
            <component
                v-for="(slotName, index) in Object.keys(renderDataSlot)"
                is-child
                :is="getSlotComponentName(renderDataSlot[slotName])"
                :slot="slotName"
                :key="index"
                v-bind="getSlotProps(renderDataSlot[slotName])" />
        </component-wrapper>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters, mapMutations } from 'vuex'
    import { bus } from '@/common/bus'
    import {
        uuid,
        getNodeWithClass,
        removeClassWithNodeClass,
        getStyle,
        findComponentParentGrid
    } from '@/common/util'
    import ComponentMenu from '@/components/widget/context-menu'
    import WidgetForm from '@/components/widget/form'
    import WidgetFormItem from '@/components/widget/form-item'
    import renderSlot from './slot'
    import ComponentWrapper from './component-wrapper'
    import offsetMixin from './offset-mixin'

    const BLOCK_ELEMS = [
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'ul',
        'ol',
        'dl',
        'table',
        'form'
    ]

    const INLINE_ELEMS = [
        'span',
        'a',
        'strong',
        'b',
        'em',
        'i',
        'big',
        'small',
        'label',
        'img',
        'input',
        'select',
        'textarea',
        'svg'
    ]

    export default {
        name: 'render-component',
        components: {
            ComponentWrapper,
            ComponentMenu,
            WidgetForm,
            WidgetFormItem,
            renderSlot,
            renderLayout: () => import('./index'),
            renderGrid: () => import('./grid'),
            freeLayout: () => import('./free-layout')
        },
        mixins: [offsetMixin],
        props: {
            componentData: {
                type: Object,
                required: true
            }
        },
        data () {
            // 局部注册自定义组件
            for (const name in window.__innerCustomRegisterComponent__) {
                if (!this.$options.components[name]) {
                    this.$options.components[name] = window.__innerCustomRegisterComponent__[name]
                }
            }
            return {
                renderData: {},
                isLayoutNameSlot: false,
                renderDataSlot: {},
                renderDataSlotRefreshKey: Date.now(),
                componentStyleDisplayValue: '',
                bindProps: {},
                contextMenuVisible: false,
                contextMenuTarget: null
            }
        },
        computed: {
            ...mapGetters('drag', ['targetData']),
            ...mapGetters('components', ['curNameMap', 'interactiveComponents']),
            /**
             * @desc 组件渲染 root 的 class
             * @returns { String }
             */
            wrapperClasses () {
                const { type } = this.componentData
                const stack = []
                // 打包自定义组件时添加此类作为最上层父类，避免自定义组件的类污染画布页面的东西
                if (this.curNameMap[type]) {
                    stack.push('bk-layout-custom-component-wrapper')
                }
                // slot name 不是 layout
                if (!this.isLayoutNameSlot) {
                    stack.push('component-wrapper')
                }
                if (type === 'render-grid') {
                    stack.push('grid')
                } else if (type === 'free-layout') {
                    stack.push('free-layout')
                }
                return stack.join(' ')
            },
            /**
             * @desc 组件渲染 root 的 style
             * @returns { Object }
             */
            wrapperStyles () {
                const {
                    top,
                    left,
                    width,
                    height
                } = this.renderData.renderStyles

                const styles = {
                    top: top,
                    left: left,
                    display: this.componentStyleDisplayValue,
                    width: width
                }
                // bk-swiper 设置默认高度
                if (this.componentData.type === 'bk-swiper') {
                    styles.height = height
                }
                // charts类的宽度同步设置
                if (this.componentData.componentId.startsWith('chart-') || this.componentData.componentId.startsWith('bk-charts-')) {
                    const width = this.componentData.renderProps.width && this.componentData.renderProps.width.val
                    width && (styles.width = width)
                }
                return styles
            },
            /**
             * @desc 判断基础组件
             * @returns { Boolean }
             *
             * 不包含一下类型组件
             *  - render-grid
             *  - free-layout
             *  - 自定义组件
             *  - 复合组件
             */
            isBaseComponent () {
                if (this.isLayoutTypeComponent) {
                    return false
                }
                if (this.renderData.isCustomComponent) {
                    return false
                }
                if (this.renderData.isComplexComponent) {
                    return false
                }
                return true
            },
            /**
             * @desc 当前处理的组件是 Layout 类型（render-grid，free-layout）
             * @returns { Boolean }
             */
            isLayoutTypeComponent () {
                return [
                    'render-grid',
                    'free-layout'
                ].includes(this.componentData.type)
            }
        },
        watch: {
            'renderData.componentId': {
                handler () {
                    this.renderData.isCustomComponent = !!this.curNameMap[this.renderData.type]
                },
                immediate: true
            }
        },
        created () {
            this.renderData = this.componentData
            // 直接 json 回溯的话，json 配置中不会有 componentId
            if (!this.componentData.componentId) {
                this.renderData.componentId = this.componentData.name + '-' + uuid()
            }
            // 判断 slot 是否是 layout
            // eq: card, sideslider
            Object.values(this.renderData.renderSlots).forEach(item => {
                if (item.name === 'layout') {
                    this.isLayoutNameSlot = true
                }
            })

            this.updateBindProps()
            this.updateBindSlots()
            
            bus.$on('on-update-props', this.updatePropsHandler)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-update-props', this.updatePropsHandler)
            })
        },
        mounted () {
            // 非 layout 类型的组件
            if (!this.isLayoutTypeComponent) {
                this.contextMenuTarget = this.$refs[`${this.renderData.componentId}-wrapper`]
                this.$emit('component-mounted', {
                    renderData: this.renderData,
                    elem: this.$el
                })
                this.initComponentStyleDispaly()
            }
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData',
                'pushTargetHistory'
            ]),
            /**
             * @desc 判断渲染组件的 display 的值
             */
            initComponentStyleDispaly () {
                let result = ''
                if (this.$refs[this.renderData.componentId]) {
                    const domNode = this.$refs[this.renderData.componentId].$el
                        || this.$refs[this.renderData.componentId] // 原生html不会有$el元素
                    const componentDisplay = getStyle(domNode, 'display')
                    
                    if (componentDisplay) {
                        if (componentDisplay === 'block') {
                            result = 'block'
                        } else if (componentDisplay === 'inline-block' || componentDisplay === 'inline') {
                            result = 'inline-block'
                        } else if (componentDisplay === 'inline-flex') {
                            result = 'inline-flex'
                        }
                    } else {
                        const tagName = domNode.tagName.toLocaleLowerCase()
                        if (BLOCK_ELEMS.indexOf(tagName) > -1) {
                            result = 'block'
                        } else if (INLINE_ELEMS.indexOf(tagName) > -1) {
                            result = 'inline-block'
                        }
                    }
                } else {
                    // 兼容异步组件 bk-custom-icon，初始无法获取 ref
                    if (['bk-custom-icon'].includes(this.renderData.type)) {
                        result = 'inline-block'
                    }
                }
                if (result) {
                    this.componentStyleDisplayValue = result
                }
            },

            getSlotComponentName (slot) {
                const { name } = slot
                return name === 'layout' ? 'render-layout' : 'render-slot'
            },

            getSlotProps (slot) {
                const { name, val } = slot
                const props = name === 'layout' ? { componentData: val } : { slotData: slot }
                return props
            },
            /**
             * 右键删除 component
             */
            handleContextmenuDelete () {
                setTimeout(() => {
                    const delBtn = document.querySelector('#del-component-right-sidebar')
                    delBtn && delBtn.click()
                }, 0)
                this.contextMenuVisible = false
            },

            updateBindProps () {
                const { renderProps } = this.renderData

                const bindProps = {}
                Object.keys(renderProps).forEach(renderPropsKey => {
                    bindProps[renderPropsKey] = renderProps[renderPropsKey].val
                })
                this.bindProps = bindProps
            },

            updateBindSlots () {
                if (Object.keys(this.renderData.renderSlots || {}).length) {
                    this.renderDataSlot = this.renderData.renderSlots
                    if (!this.isLayoutTypeComponent) {
                        this.renderDataSlotRefreshKey = Date.now()
                    }
                }
            },

            /**
             * on-update-props:component 事件回调
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

                    const {
                        renderStyles = {},
                        renderProps = {},
                        renderEvents = {},
                        renderDirectives = [],
                        renderSlots = {},
                        tabPanelActive = 'props'
                    } = data.modifier

                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.renderEvents = renderEvents
                    this.renderData.renderDirectives = renderDirectives
                    this.renderData.renderSlots = renderSlots
                    this.renderData.tabPanelActive = tabPanelActive

                    this.updateBindProps()
                    this.updateBindSlots()

                    // 把组件的 display 样式更改同步到 .component-wrapper 元素上
                    if (renderStyles.display) {
                        this.componentStyleDisplayValue = renderStyles.display
                    }

                    // 更新属性时，检测元素的 top + height 是否超过了容器的高度，如果超过了，那么就改变容器的高度
                    this.$nextTick(() => {
                        const parent = findComponentParentGrid(this.targetData, this.renderData.componentId)
                        if (!parent || !parent.renderStyles) return // 交互是组件没有parent，无需修改父容器

                        const top = parseInt(this.$el.style.top, 10)
                        const nodeHeight = parseInt(this.$el.getBoundingClientRect().height, 10)
                        if (nodeHeight + top > parseInt(parent.renderStyles.height, 10) + 3) {
                            parent.renderStyles.height = `${parseInt(nodeHeight + top + 100, 10)}px`
                            bus.$emit('on-update-free-layout-props', {
                                componentId: parent.componentId,
                                modifier: {
                                    renderStyles: parent.renderStyles
                                },
                                renderData: this.renderData,
                                dragNode: this.$el
                            })
                        }
                    })
                }
            },

            /**
             * 组件 wrapper mousedown 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMousedownHandler (renderData, e) {
                this.$emit('component-mousedown', {
                    renderData,
                    originalEvent: e
                })
            },

            /**
             * 组件点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperClickHandler (renderData, e) {
                if (this.isLayoutTypeComponent) {
                    return
                }

                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'selected')
                removeClassWithNodeClass('.bk-layout-grid-row', 'row-hover')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'free-layout-hover')
                removeClassWithNodeClass('.wrapperCls', 'selected')
                removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')

                const curComponentNode = getNodeWithClass(e.target, 'wrapperCls')
                const className = this.isLayoutNameSlot ? 'wrapper-cls-selected' : 'selected'
                curComponentNode.classList.add(className)
                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
                bus.$emit('selected-tree', this.renderData.componentId)
                this.$clearMenu()
            },

            /**
             * 组件 wrapper mouseenter 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseenterHandler (renderData, e) {
                if (this.isLayoutTypeComponent) {
                    return
                }
                const className = this.isLayoutNameSlot ? 'wrapper-cls-hover' : 'component-wrapper-hover'
                const target = e.target
                target.classList.add(className)

                setTimeout(() => {
                    removeClassWithNodeClass('.bk-layout-grid-row', 'row-hover')
                    removeClassWithNodeClass('.bk-lesscode-free-layout', 'free-layout-hover')
                }, 100)
            },

            /**
             * 组件 wrapper mouseleave 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseleaveHandler (renderData, e) {
                if (this.isLayoutTypeComponent) {
                    return
                }
                const className = this.isLayoutNameSlot ? 'wrapper-cls-hover' : 'component-wrapper-hover'
                const target = e.target
                target.classList.remove(className)
            }
        }
    }
</script>
<style lang="postcss">
    @import "./component.css";
    .wrapperCls {
        .bk-dialog-wrapper > .bk-dialog {
            pointer-events: none;
            .bk-dialog-body {
                pointer-events: auto;
            }
        }
        .bk-sideslider-wrapper > .bk-sideslider-content {
            padding: 10px;
        }
    }

</style>
