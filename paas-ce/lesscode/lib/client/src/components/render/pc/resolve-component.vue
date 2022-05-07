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
        ref="componentRoot"
        :class="{
            [$style['component']]: true,
            [$style['precent-width']]: fixPercentStyleWidth,
            [$style['precent-height']]: fixPercentStyleHeight,
            'bk-layout-custom-component-wrapper': componentData.isCustomComponent
        }"
        role="component-root"
        :data-layout="componentData.layoutType"
        :style="Object.assign({}, componentData.style, safeStyles)"
        v-bind="{
            [componentData.componentId]: ''
        }"
        @mousedown.stop="handleMousedown"
        @mousemove="handleMousemove"
        @mouseup="handleMouseup"
        @click.stop="handleClick"
        @dblclick.stop="handleDBClick"
        @contextmenu.stop="handleShowContextmenu">
        <render-component
            :ref="componentData.componentId"
            :component-data="componentData" />
    </div>
</template>
<script>
    import LC from '@/element-materials/core'
    import RenderComponent from './render-component'
    import RenderSlot from './render-slot'

    const getRenderStyleDisplayValue = display => {
        switch (display) {
            case 'flex':
            case 'gird':
            case 'block':
                return 'block'
            case 'inline-flex':
            case 'inline-grid':
            case 'inline-block':
                return 'inline-block'
            case 'inline':
                return 'inline'
            // 默认按块级元素处理
            default:
                return 'block'
        }
    }

    // 记录 mousedown 状态
    let isMousedown = false

    const safeStyles = {
        // fix: 影响子元素排版
        display: 'block',
        'padding': '',
        'padding-top': '',
        'padding-right': '',
        'padding-bottom': '',
        'padding-left': '',
        'line-height': '',
        'letter-spacing': '',
        'word-spacing': '',
        'text-align': '',
        'text-decoration': '',
        'text-indent': '',
        'text-overflow': '',
        'text-rendering': '',
        'text-size-adjust': '',
        'text-shadow': '',
        'text-transform': '',
        'word-break': '',
        'word-wrap': '',
        'white-space': '',
        // fix: 父子元素效果叠加
        'background': '',
        'background-attachment': '',
        'background-color': '',
        'background-image': '',
        'background-position': '',
        'background-repeat': '',
        'background-size': '',
        'border': '',
        'border-image': '',
        'border-collapse': '',
        'border-color': '',
        'border-top': '',
        'border-right': '',
        'border-bottom': '',
        'border-left': '',
        'border-top-color': '',
        'border-right-color': '',
        'border-bottom-color': '',
        'border-left-color': '',
        'border-spacing': '',
        'border-style': '',
        'border-top-style': '',
        'border-right-style': '',
        'border-bottom-style': '',
        'border-left-style': '',
        'border-width': '',
        'border-top-width': '',
        'border-right-width': '',
        'border-bottom-width': '',
        'border-left-width': '',
        'border-radius': '',
        'border-top-right-radius': '',
        'border-bottom-right-radius': '',
        'border-bottom-left-radius': '',
        'border-top-left-radius': '',
        'border-radius-topright': '',
        'border-radius-bottomright': '',
        'border-radius-bottomleft': '',
        'border-radius-topleft': '',
        opacity: ''
    }

    export default {
        name: 'resolve-component',
        components: {
            /* eslint-disable vue/no-unused-components */
            FreeLayout: () => import('./widget/free-layout'),
            RenderGrid: () => import('./widget/grid'),
            RenderColumn: () => import('./widget/column'),
            RenderBlock: () => import('./widget/block.vue'),
            WidgetForm: () => import('./widget/form'),
            WidgetFormItem: () => import('./widget/form-item'),
            ResolveComponent: () => import('./resolve-component'),
            RenderComponent,
            RenderSlot
        },
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
                // 默认会继承组件的 style 配置，如果直接继承有些样式会造成排版问题需要重置
                safeStyles: Object.assign({}, safeStyles),
                // 百分比宽度时需要修正相对父级的值
                fixPercentStyleWidth: false,
                // 百分比高度时需要修正相对父级的值
                fixPercentStyleHeight: false
            }
        },
        computed: {
            /**
             * @desc 为了达到编辑区渲染排版效果而创建的一些影子组件
             * @returns { Boolean }
             */
            isShadowComponent () {
                const shadowComMap = {
                    'free-layout': true,
                    'render-grid': true,
                    'render-column': true,
                    'widget-form': true,
                    'widget-form-item': true,
                    'resolve-component': true
                }
                return shadowComMap[this.componentData.type] || false
            }
        },
        created () {
            // 优先获取组件的 material Config 缓存起来，
            // 后续需要使用直接使用这个不在从 componentData.material 获取
            this.material = this.componentData.material

            // 编辑更新
            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.safeStylesWithDisplay()
                    this.safeStyleWithWidth()
                    this.safeStyleWithHeight()
                    this.$forceUpdate()
                    this.$emit('component-update')
                }
            }

            LC.addEventListener('update', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        },
        mounted () {
            this.safeStylesWithDisplay()
            this.safeStyleWithWidth()
            this.safeStyleWithHeight()
            this.setDefaultStyleWithAttachToFreelayout()
            this.componentData.mounted(this.$refs.componentRoot)
            this.$emit('component-mounted')
        },
        beforeDestroy () {
            isMousedown = false
            // 销毁时如果组件被激活，取消激活状态
            if (this.componentData.isActived) {
                this.componentData.activeClear()
            }
        },
        methods: {
            /**
             * @desc 保证组件的 display 配置和渲染正确
             */
            safeStylesWithDisplay () {
                if (this.isShadowComponent) {
                    return
                }

                // 优先使用自定义配置的 display
                const customDisplay = this.componentData.style.display
                if (customDisplay) {
                    this.safeStyles = Object.assign({}, this.safeStyles, {
                        display: getRenderStyleDisplayValue(customDisplay)
                    })
                    return
                }

                // 兼容异步组件 bk-custom-icon
                if (['bk-custom-icon'].includes(this.componentData.type)) {
                    this.safeStyles = Object.assign({}, this.safeStyles, {
                        display: 'inline-block'
                    })
                    return
                }
                
                // 继承组件渲染结果的 display
                const $baseComponentEl = this.$refs.componentRoot.querySelector('[lesscode-base-component]')
                if ($baseComponentEl) {
                    const {
                        display
                    } = window.getComputedStyle($baseComponentEl)
                    this.safeStyles = Object.assign({}, this.safeStyles, {
                        display: getRenderStyleDisplayValue(display)
                    })
                }
            },
            /**
             * @desc 保证组件的 width 渲染正确
             *
             * 某些组件可能是通过 prop 配置 width 而不是直接配置 css 的 width
             */
            safeStyleWithWidth () {
                if (this.isShadowComponent) {
                    return
                }
                // 优先使用自定义配置的 width
                if (this.componentData.style.width) {
                    this.fixPercentStyleWidth = /%$/.test(this.componentData.style.width)
                    return
                }

                this.$nextTick(() => {
                    // 因为异步任务执行的时机问题，此时可能组件已经被销毁
                    if (!this.$refs.componentRoot) {
                        return
                    }
                    const $baseComponentEl = this.$refs.componentRoot.querySelector('[lesscode-base-component]')
                    if ($baseComponentEl) {
                        const styleWidth = $baseComponentEl.style.width
                        if (styleWidth) {
                            this.safeStyles = Object.assign({}, this.safeStyles, {
                                width: styleWidth
                            })
                        }
                        this.fixPercentStyleWidth = /%$/.test(styleWidth)
                    }
                })
            },
            /**
             * @desc 保证组件的 height 渲染正确
             *
             * 某些组件可能是通过 prop 配置 height 而不是直接配置 css 的 height
             */
            safeStyleWithHeight () {
                if (this.isShadowComponent) {
                    return
                }
                
                // 优先使用自定义配置的 height
                if (this.componentData.style.height) {
                    this.fixPercentStyleHeight = /%$/.test(this.componentData.style.height)
                    return
                }

                this.$nextTick(() => {
                    // 因为异步任务执行的时机问题，此时可能组件已经被销毁
                    if (!this.$refs.componentRoot) {
                        return
                    }
                    const $baseComponentEl = this.$refs.componentRoot.querySelector('[lesscode-base-component]')
                    if ($baseComponentEl) {
                        const styleHeight = $baseComponentEl.style.height
                        if (styleHeight) {
                            this.safeStyles = Object.assign({}, this.safeStyles, {
                                height: styleHeight
                            })
                        }
                        this.fixPercentStyleHeight = /%$/.test(styleHeight)
                    }
                })
            },
            /**
             * @desc 当组件在 freelayout 布局中时需要设置一些默认样式
             */
            setDefaultStyleWithAttachToFreelayout () {
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
             * @desc 组件点击事件回调
             */
            handleClick () {
                LC.clearMenu()
                this.componentData.active()
            },
            handleDBClick () {
                console.log('dbdbdb')
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
             * @desc 组件 wrapper mousemove 事件回调
             * @param { Object } event
             *
             * 如果鼠标是按下状态不执行 hover 的逻辑
             */
            handleMousemove (event) {
                // fix: 在自由布局中同样监听 mouseover 事件
                // 鼠标 hover 效果和自由布局拖动效果有点冲突
                if (isMousedown) {
                    return
                }
                event.stopImmediatePropagation()
                event.stopPropagation()
                event.preventDefault()
                LC.triggerEventListener('componentHover', {
                    type: 'componentHover',
                    target: this.componentData
                })
            },
            /**
             * @desc 鼠标右键——选中组件、弹出菜单
             * @param { Object } event
             */
            handleShowContextmenu (event) {
                this.componentData.active()
                LC.showMenu(event)
            }
        }
    }
</script>
<style lang="postcss" module>
    .component {
        position: relative;
        min-height: 10px;
        pointer-events: auto !important;
        cursor: pointer;
        &.precent-width{
            & > * {
                width: 100% !important;
            }
        }
        &.precent-height{
            & > * {
                height: 100% !important;
            }
        }
    }
</style>
