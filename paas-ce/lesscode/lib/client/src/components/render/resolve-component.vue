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
                // 大多数样式是影响组件内部子元素的
                safeStyles: {
                    display: 'block',
                    'white-space': 'unset',
                    'word-break': 'unset'
                }
            }
        },
        computed: {
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
            // 优先获取组件的 material Config 缓存起来，后续需要使用直接使用这个不在从 componentData.material 获取
            this.material = this.componentData.material
            const updateCallback = (event) => {
                const {
                    target
                } = event
                if (target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    this.$emit('component-update')
                }
            }
            
            const componentHoverCallback = _.throttle(() => {
                this.isHover = hoverComponentId === this.componentData.componentId
            }, 60)

            const componentMouseleaveCallback = () => {
                hoverComponentId = ''
                this.isHover = false
            }

            LC.addEventListener('update', updateCallback)
            LC.addEventListener('component-hover', componentHoverCallback)
            LC.addEventListener('component-mouserleave', componentMouseleaveCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('component-hover', componentHoverCallback)
                LC.removeEventListener('component-mouserleave', componentMouseleaveCallback)
            })
        },
        mounted () {
            this.safeBaseComponentStyle()
            this.setDefaultStyleWithAttachToFreelayout()
            this.$emit('component-mounted')
        },
        methods: {
            /**
             * @desc 继承基础组件的某些特殊样式
             */
            safeBaseComponentStyle () {
                if (this.isShadowComponent) {
                    return
                }
                
                // 兼容异步组件 bk-custom-icon
                if (['bk-custom-icon'].includes(this.componentData.type)) {
                    this.safeStyles = Object.assign({}, this.safeStyles, {
                        display: 'inline-block'
                    })
                    return
                }
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
        cursor: pointer;
        -webkit-text-size-adjust: none;
        &.selected{
            position: relative;
           .line-top,
            .line-right,
            .line-bottom,
            .line-left {
                border-style: solid;
            }
        }
        &.hover{
            position: relative;
            .line-top,
            .line-right,
            .line-bottom,
            .line-left {
                border-style: dashed;
            }
        }
        .line-top,
        .line-right,
        .line-bottom,
        .line-left{
            position: absolute;
            
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
