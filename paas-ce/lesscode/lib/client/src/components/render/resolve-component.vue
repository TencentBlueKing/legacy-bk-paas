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
        :class="{
            [$style['component']]: true,
            [$style['selected']]: componentData.isActived,
            [$style['hover']]: isHover,
            'bk-layout-custom-component-wrapper': componentData.isCustomComponent
        }"
        :style="componentData.style"
        :data-component-id="`component-${componentData.componentId}`"
        role="component-root"
        @mousedown.stop="handleMousedown"
        @mousemove="handleMousemove"
        @mouseup="handleMouseup"
        @click.stop="handleClick"
        @contextmenu.stop="handleShowContextmenu">
        <render-component
            :ref="componentData.componentId"
            :component-data="componentData" />
        <save-to-template
            v-if="componentData.layoutType
                && componentData.parentNode.layoutType
                && componentData.isActived" />
    </div>
</template>
<script>
    import _ from 'lodash'
    import { getStyle } from '@/common/util'
    import LC from '@/element-materials/core'
    import SaveToTemplate from './components/save-to-template'
    import WidgetForm from './widget/form'
    import WidgetFormItem from './widget/form-item'
    import offsetMixin from './widget/offset-mixin'
    import RenderComponent from './render-component'
    import RenderSlot from './render-slot'

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

    // 记录鼠标 hover 组件的 id
    let hoverComponentId = ''
    // 记录 mousedown 状态
    let isMousedown = false

    export default {
        name: 'resolve-component',
        components: {
            SaveToTemplate,
            /* eslint-disable vue/no-unused-components */
            WidgetForm,
            WidgetFormItem,
            RenderGrid: () => import('./widget/grid'),
            FreeLayout: () => import('./widget/free-layout'),
            ResolveComponent: () => import('./resolve-component'),
            RenderComponent,
            RenderSlot
        },
        mixins: [offsetMixin],
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                required: true
            },
            attachToFreelayout: {
                type: Boolean,
                default: false
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
                isHover: false
            }
        },
        created () {
            const updateCallback = _.throttle((event) => {
                const {
                    target
                } = event
                if (target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    this.$emit('component-update')
                }
            }, 60)
            const componentHoverCallback = _.throttle(() => {
                this.isHover = hoverComponentId === this.componentData.componentId
            }, 100)

            LC.addEventListener('update', updateCallback)
            LC.addEventListener('component-hover', componentHoverCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('component-hover', componentHoverCallback)
            })
        },
        updated () {
            console.log('**************** component update **************', this.componentData.componentId)
        },
        mounted () {
            this.setDefaultStyleWidthAttachToFreelayout()
            this.initComponentStyleDispaly()
            this.$emit('component-mounted')
        },
        methods: {
            /**
             * @desc 判断渲染组件的 display 的值
             */
            initComponentStyleDispaly () {
                let result = ''
                if (this.$refs[this.componentData.componentId]) {
                    const domNode = this.$refs[this.componentData.componentId].$el
                        || this.$refs[this.componentData.componentId] // 原生html不会有$el元素
                    if (!domNode) {
                        return
                    }
                    const componentDisplay = getStyle(domNode, 'display')

                    if (componentDisplay) {
                        result = componentDisplay
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
                    if (['bk-custom-icon'].includes(this.componentData.type)) {
                        result = 'inline-block'
                    }
                }
                if (result) {
                    this.componentData.setStyle('display', result)
                }
            },
            /**
             * @desc 当组件在 freelayout 布局中时需要设置一些默认样式
             */
            setDefaultStyleWidthAttachToFreelayout () {
                if (!this.attachToFreelayout) {
                    return
                }
                const defaultStyle = {
                    width: {
                        'bk-tag-input': '200px',
                        'bk-slider': '200px',
                        'bk-select': '200px',
                        'bk-member-selector': '400px',
                        'bk-cascade': '200px',
                        'bk-process': '600px',
                        'bk-steps': '500px',
                        'bk-divider': '500px'
                    },
                    pointerEvents: {
                        'bk-badge': 'none'
                    }
                }
                Object.keys(defaultStyle).forEach(styleName => {
                    if (defaultStyle[styleName].hasOwnProperty(this.componentData.type)) {
                        this.componentData.setStyle(styleName, defaultStyle[styleName][this.componentData.type])
                    }
                })
            },
            /**
             * @desc 记录鼠标按下状态，抛出 component-mousedown 事件
             * @param {Object} event 事件对象
             */
            handleMousedown (event) {
                isMousedown = true
                this.$emit('component-mousedown', event)
            },
            /**
             * @desc 切换鼠标按下状态
             */
            handleMouseup () {
                isMousedown = false
            },
            /**
             * @desc 组件点击事件回调
             */
            handleClick () {
                if (this.componentData.isActived) {
                    return
                }
                const activeNode = LC.getActiveNode()
                if (activeNode) {
                    activeNode.activeClear()
                }
                this.componentData.active()
            },
            /**
             * @desc 鼠标右键，弹出菜单
             * @param { Object } event
             */
            handleShowContextmenu (event) {
                LC.showMenu(event)
            },
            /**
             * @desc 组件 wrapper mousemove 事件回调
             * @param { Object } event
             *
             * 如果鼠标是按下状态不执行 hover 的逻辑
             */
            handleMousemove (event) {
                // fix: 在自由布局中同样监听 mouseover 事件
                // 鼠标 hover 效果和 自由布局拖动效果有点冲突
                if (isMousedown) {
                    return
                }
                event.stopImmediatePropagation()
                event.stopPropagation()
                event.preventDefault()
                hoverComponentId = this.componentData.componentId
                LC.triggerEventListener('component-hover')
            }
        }
    }
</script>
<style lang="postcss" module>
    .component {
        vertical-align: middle;
        -webkit-text-size-adjust: none;
        &.selected,
        &.hover{
            position: relative;
            &:before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 1;
                pointer-events: auto;
            }
        }
        &.selected {
            &:before {
                border: 1px solid #3a84ff;
            }
        }
        &.hover{
            cursor: pointer;
            &:before {
                border: 1px dashed #3a84ff !important;
            }
            /* &.in-column-ghost {
                &:before {
                    border: none !important;
                }
            }
            &.in-free-layout-item-ghost {
                &:before {
                    border: none !important;
                }
            } */
        }
        /* .bk-dialog-wrapper > .bk-dialog {
            pointer-events: none;
            .bk-dialog-body {
                pointer-events: auto;
            }
        }
        .bk-sideslider-wrapper > .bk-sideslider-content {
            padding: 10px;
        } */
    }

    /* .wrapper-cls-hover {
        .bk-card, .empty-widget-form, .bk-form {
            border: 1px dashed #3a84ff !important;
        }
        
    }

    .wrapper-cls-selected {
        .bk-card, .bk-form, .empty-widget-form {
            border: 1px solid #3a84ff !important;
        }
    }
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
    } */

</style>
