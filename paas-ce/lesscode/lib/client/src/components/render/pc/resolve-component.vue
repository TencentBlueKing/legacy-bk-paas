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
            [$style['selected']]: componentData.isActived,
            [$style['hover']]: isHover,
            'bk-layout-custom-component-wrapper': componentData.isCustomComponent
        }"
        role="component-root"
        :data-component-id="`${componentData.componentId}`"
        :data-layout="componentData.layoutType"
        :style="Object.assign({}, componentData.style, safeStyles)"
        @mousedown.stop="handleMousedown"
        @mousemove="handleMousemove"
        @mouseup="handleMouseup"
        @click.stop="handleClick"
        @contextmenu.stop="handleShowContextmenu">
        <save-to-template
            v-if="componentData.layoutType
                && componentData.parentNode.layoutType
                && componentData.isActived" />
        <render-component
            :ref="componentData.componentId"
            :component-data="componentData" />
        <template v-if="componentData.isActived || isHover">
            <div :class="$style['line-top']" key="lineTop" role="line-top" />
            <div :class="$style['line-right']" key="lineRight" role="line-right" />
            <div :class="$style['line-bottom']" key="lineBottom" role="line-bottom" />
            <div :class="$style['line-left']" key="lineLeft" role="line-left" />
        </template>
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import SaveToTemplate from './components/save-to-template'
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

    // 记录鼠标 hover 组件的 id
    let hoverComponentId = ''
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
            WidgetForm: () => import('./widget/form'),
            WidgetFormItem: () => import('./widget/form-item'),
            ResolveComponent: () => import('./resolve-component'),
            RenderComponent,
            RenderSlot,
            SaveToTemplate
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
                isHover: false,
                // 默认会继承组件的 style 配置，如果直接继承有些样式会造成排版问题需要重置
                safeStyles: Object.assign({}, safeStyles)
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
            const updateCallback = _.throttle((event) => {
                const {
                    target
                } = event
                if (target.componentId === this.componentData.componentId) {
                    console.log('print event = ', event)
                    this.safeStylesWithDisplay()
                    this.safeStyleWithWidth()
                    this.safeStyleWithHeight()
                    this.$forceUpdate()
                    this.$emit('component-update')
                }
            }, 20)
            
            const componentHoverCallback = _.throttle(() => {
                this.isHover = hoverComponentId === this.componentData.componentId
            }, 20)

            const componentMouseleaveCallback = () => {
                hoverComponentId = ''
                this.isHover = false
            }

            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', updateCallback)
            LC.addEventListener('activeClear', updateCallback)
            LC.addEventListener('componentHover', componentHoverCallback)
            LC.addEventListener('componentMouserleave', componentMouseleaveCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', updateCallback)
                LC.removeEventListener('activeClear', updateCallback)
                LC.removeEventListener('componentHover', componentHoverCallback)
                LC.removeEventListener('componentMouserleave', componentMouseleaveCallback)
            })
        },
        mounted () {
            this.safeStylesWithDisplay()
            this.safeStyleWithWidth()
            this.safeStyleWithHeight()
            this.setDefaultStyleWithAttachToFreelayout()
            this.$emit('component-mounted')
        },
        beforeDestroy () {
            if (hoverComponentId === this.componentData.componentId) {
                hoverComponentId = ''
                isMousedown = false
            }
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
                const $baseComponentEl = this.$refs.componentRoot.querySelector('[data-base-component="true"]')
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
                    return
                }

                this.$nextTick(() => {
                    const $baseComponentEl = this.$refs.componentRoot.querySelector('[data-base-component="true"]')
                    if ($baseComponentEl) {
                        if ($baseComponentEl.style.width) {
                            this.safeStyles = Object.assign({}, this.safeStyles, {
                                width: $baseComponentEl.style.width
                            })
                        }
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
                    return
                }

                this.$nextTick(() => {
                    const $baseComponentEl = this.$refs.componentRoot.querySelector('[data-base-component="true"]')
                    if ($baseComponentEl) {
                        if ($baseComponentEl.style.height) {
                            this.safeStyles = Object.assign({}, this.safeStyles, {
                                height: $baseComponentEl.style.height
                            })
                        }
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
                LC.clearMenu()
                if (this.componentData.isActived) {
                    return
                }
                this.componentData.active()
            },
            /**
             * @desc 鼠标右键，弹出菜单
             * @param { Object } event
             */
            handleShowContextmenu (event) {
                console.log('from handleShowContextmenu', this.componentData)
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
                // 鼠标 hover 效果和自由布局拖动效果有点冲突
                if (isMousedown) {
                    return
                }
                event.stopImmediatePropagation()
                event.stopPropagation()
                event.preventDefault()
                hoverComponentId = this.componentData.componentId
                LC.triggerEventListener('componentHover')
            }
        }
    }
</script>
<style lang="postcss" module>
    .component {
        pointer-events: auto !important;
        cursor: pointer;
        -webkit-text-size-adjust: none;
        &.hover{
            position: relative;
            > .line-top,
            > .line-right,
            > .line-bottom,
            > .line-left {
                border-style: dashed;
            }
        }
        &.selected{
            position: relative;
            > .line-top,
            > .line-right,
            > .line-bottom,
            > .line-left {
                border-style: solid;
            }
        }
        
        .line-top,
        .line-right,
        .line-bottom,
        .line-left{
            position: absolute;
            z-index: 9999999;
            border-width: 0;
            border-color: #3a84ff;
        }
        .line-top {
            top: 0;
            right: 0;
            left: 0;
            border-top-width: 1px;
        }
        .line-right{
            top: 0;
            right: 0;
            bottom: 0;
            border-right-width: 1px;
        }
        .line-bottom{
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom-width: 1px;
        }
        .line-left{
            top: 0;
            bottom: 0;
            left: 0;
            border-left-width: 1px;
        }
    }
</style>
