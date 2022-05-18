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
    <layout>
        <div
            id="drawTarget"
            ref="root"
            :class="{
                [$style['canvas']]: true,
                [$style['empty']]: componentData.children.length < 1
            }"
            @click="handleCanvaseClick"
            @mouseleave="handleMouseleave">
            <draggable
                ref="dragArea"
                class="target-drag-area"
                :class="[$style['drag-area']]"
                :component-data="componentData"
                :list="componentData.slot.default"
                :sort="true"
                :group="{
                    name: 'layout',
                    pull: true,
                    put: true
                }">
                <template v-for="componentNode in componentData.slot.default">
                    <!-- root 的子组件只会是布局组件和交互式组件 -->
                    <!-- 布局组件 -->
                    <resolve-component
                        v-if="!componentNode.isInteractiveComponent"
                        ref="component"
                        :key="componentNode.renderKey"
                        :component-data="componentNode" />
                    <!-- 交互式组件 -->
                    <resolve-interactive-component
                        v-else
                        :key="componentNode.renderKey"
                        :component-data="componentNode" />
                </template>
            </draggable>
            <lesscode-focus />
            <lesscode-tools />
            <lesscode-resize />
        </div>
        <div
            v-if="showNotVisibleMask"
            :class="$style['not-visible-mask']">
            {{`该组件(${invisibleComponent})处于隐藏状态，请先打开`}}
        </div>
    </layout>
</template>
<script>
    import LC from '@/element-materials/core'
    import Draggable from './components/draggable'
    import LesscodeFocus from './tools/lesscode-focus'
    import LesscodeTools from './tools/lesscode-tool'
    import LesscodeResize from './tools/lesscode-resize'
    import Layout from './widget/layout'
    import ResolveComponent, { setMousedown } from './resolve-component'
    import ResolveInteractiveComponent from './resolve-interactive-component'

    export default {
        name: 'render',
        components: {
            Draggable,
            LesscodeFocus,
            LesscodeTools,
            LesscodeResize,
            Layout,
            ResolveComponent,
            ResolveInteractiveComponent
        },
        provide () {
            return {
                attachToInteractiveComponent: false
            }
        },
        data () {
            return {
                isReady: LC.__isReady,
                showNotVisibleMask: false,
                invisibleComponent: ''
            }
        },
        watch: {
            showNotVisibleMask (val) {
                if (val) {
                    const activeNode = LC.getActiveNode()
                    this.invisibleComponent = activeNode.componentId
                }
            }
        },
        created () {
            this.componentData = LC.getRoot()

            const readyCallback = () => {
                this.isReady = true
            }
            const updateLogCallback = event => {
                console.log('\n')
                console.log(`%c>> ${new Date().toString().slice(0, 25)}`,
                            'background-color: #3A84FF; color: #fff; padding: 2px 5px; border-radius: 3px; font-weight: bold;')
                console.log(`%c组件更新%c${event.target.componentId}`,
                            'padding: 2px 5px; background: #ea3636; color: #fff; border-radius: 3px 0 0 3px;',
                            'padding: 2px 5px; background: #42c02e; color: #fff; border-radius: 0 3px 3px 0; font-weight: bold;',
                            event)
            }
            
            const activeLogCallback = event => {
                console.log('\n')
                console.log(`%c>> ${new Date().toString().slice(0, 25)}`,
                            'background-color: #3A84FF; color: #fff; padding: 2px 5px; border-radius: 3px; font-weight: bold;')
                console.log(`%c组件选中%c${event.target.componentId}`,
                            'padding: 2px 5px; background: #ff9c01; color: #fff; border-radius: 3px 0 0 3px;',
                            'padding: 2px 5px; background: #42c02e; color: #fff; border-radius: 0 3px 3px 0; font-weight: bold;',
                            event)
            }

            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    setTimeout(() => {
                        this.autoType()
                    }, 20)
                }
            }

            /**
             * @name interactiveCallbak
             * @description 当交互式组件的状态改变，每次更新需要监测是否显示“打开交互式组件”的提示
             */
            const interactiveCallbak = event => {
                const activeNode = LC.getActiveNode()
                if (activeNode) {
                    this.showNotVisibleMask = activeNode.isInteractiveComponent && !activeNode.interactiveShow
                }
            }

            const nodeCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    setTimeout(() => {
                        this.autoType(event.child)
                    }, 20)
                }
            }

            LC.addEventListener('ready', readyCallback)
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('update', updateLogCallback)
            LC.addEventListener('active', interactiveCallbak)
            LC.addEventListener('active', activeLogCallback)
            LC.addEventListener('toggleInteractive', interactiveCallbak)
            LC.addEventListener('appendChild', nodeCallback)
            LC.addEventListener('moveChild', nodeCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('ready', readyCallback)
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('update', updateLogCallback)
                LC.removeEventListener('active', interactiveCallbak)
                LC.removeEventListener('active', activeLogCallback)
                LC.removeEventListener('toggleInteractive', interactiveCallbak)
                LC.removeEventListener('appendChild', nodeCallback)
                LC.removeEventListener('moveChild', nodeCallback)
            })
        },
        mounted () {
            this.componentData.mounted(this.$refs.root)
            LC._mounted()
            
            const mousedownCallback = () => {
                setMousedown(true)
            }
            const mouseupCallback = () => {
                setMousedown(false)
            }
            const resetCallback = () => {
                LC.clearMenu()
            }
            document.body.addEventListener('mousedown', mousedownCallback)
            document.body.addEventListener('mouseup', mouseupCallback)
            document.body.addEventListener('click', resetCallback)
            
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('mousedown', mousedownCallback)
                document.body.removeEventListener('mouseup', mouseupCallback)
                document.body.removeEventListener('click', resetCallback)
            })
        },
        beforeDestroy () {
            LC._unload()
            window.addEventListener('unload', () => {
                LC._unload()
            })
        },
        methods: {
            /**
             * @desc 自动排版子组件
             */
            autoType (childNode) {
                if (this._isDestroyed || !childNode) {
                    return
                }
                const {
                    top: boxTop,
                    left: boxLeft
                } = this.$refs.dragArea.$el.getBoundingClientRect()

                const $childEl = childNode.$elm

                const {
                    top: componentTop,
                    left: componentLeft
                } = $childEl.getBoundingClientRect()
                
                if (componentTop > boxTop) {
                    childNode.setStyle('marginTop', '10px')
                }
                if (componentLeft > boxLeft) {
                    childNode.setStyle('marginLeft', '10px')
                }
            },
            /**
             * @desc 鼠标离开时清除组件 hover 效果
             * @param { Boolean } name
             * @returns { Boolean }
             */
            handleMouseleave () {
                LC.triggerEventListener('componentMouserleave', {
                    type: 'componentMouserleave'
                })
            },
            /**
             * @desc 画布编辑区空白区域被点击取消组件的选中状态
             * @param { Object } event
             */
            handleCanvaseClick (event) {
                if (event.target.classList.contains(this.$style['drag-area'])) {
                    const activeNode = LC.getActiveNode()
                    if (activeNode) {
                        activeNode.activeClear()
                    }
                    LC.triggerEventListener('componentMouserleave', {
                        type: 'componentMouserleave'
                    })
                }
            }
        }
    }
</script>
<style lang="postcss" module>
    @import './widget/patch.css';

    .canvas{
        position: relative;
        z-index: 99999999 !important;
        min-height: calc(100% - 20px) !important;
        &.empty{
            &::before{
                content: "请拖入组件";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #C4C6CC;
                pointer-events: all;
            }
        }
    }
    .drag-area{
        padding-bottom: 300px;
        * {
            /* 规避一些组件内部因为设置了 pointer-events 导致鼠标事件非法触发 */
            pointer-events: none;
        }
    }
    .not-visible-mask{
        position: fixed;
        z-index: 99999999;
        display: flex;
        justify-content: center;
        background: rgba(0,0,0,0.8);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding-top: 100px;
        color: #fff;
    }
</style>
