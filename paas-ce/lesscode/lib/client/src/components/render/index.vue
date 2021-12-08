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
        <div @mouseleave="handleMouseleave">
            <draggable
                v-if="isReady"
                class="target-drag-area"
                :component-data="componentData"
                :list="componentData.slot.default"
                disabled
                :sort="true"
                :group="{
                    name: 'layout',
                    pull: true,
                    put: putCheck
                }">
                <template v-for="componentNode in componentData.slot.default">
                    <!-- root 的子组件只会是布局组件和交互式组件 -->
                    <!-- 布局组件 -->
                    <resolve-component
                        v-if="!componentNode.isInteractiveComponent"
                        :key="componentNode.renderKey"
                        :component-data="componentNode" />
                    <!-- 交互式组件 -->
                    <resolve-interactive-component
                        v-else
                        :key="componentNode.renderKey"
                        :component-data="componentNode" />
                </template>
            </draggable>
        </div>
        <div
            v-show="showNotVisibleMask"
            class="not-visible-mask"
            :style="{ height: canvasHeight + 'px' }">
            {{`该组件(${invisibleComponent})处于隐藏状态，请先打开`}}
        </div>
    </layout>
</template>
<script>
    import LC from '@/element-materials/core'
    import Draggable, {
        getDragTargetGroup
    } from './components/draggable'
    import Layout from './widget/layout'
    import ResolveInteractiveComponent from './resolve-interactive-component'

    export default {
        name: 'render',
        components: {
            Draggable,
            Layout,
            ResolveComponent: () => import('./resolve-component'),
            ResolveInteractiveComponent
        },
        provide () {
            return {
                attachToInteractiveComponent: false
            }
        },
        data () {
            return {
                isReady: false,
                showNotVisibleMask: false,
                canvasHeight: 100,
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

            const nodeTreeReadyCallback = () => {
                this.isReady = true
                this.observeInteractiveMask()
            }

            const updateCallback = (event) => {
                console.log('from target updateCallback == ', event)
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                }
            }
            /**
             * @name interactiveWatcher
             * @description 当交互式组件的状态改变，每次更新需要监测是否显示“打开交互式组件”的提示
             */
            const interactiveWatcher = event => {
                const activeNode = LC.getActiveNode()
                if (activeNode) {
                    this.showNotVisibleMask = activeNode.isInteractiveComponent && !activeNode.interactiveShow
                }
            }

            LC.addEventListener('ready', nodeTreeReadyCallback)
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', interactiveWatcher)
            LC.addEventListener('toggleInteractive', interactiveWatcher)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('ready', nodeTreeReadyCallback)
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', interactiveWatcher)
                LC.removeEventListener('toggleInteractive', interactiveWatcher)
            })
        },
        mounted () {
            const resetCallback = () => {
                LC.clearMenu()
            }
            document.body.addEventListener('click', resetCallback)
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('click', resetCallback)
            })
        },
        methods: {
            observeInteractiveMask () {
                const canvas = document.querySelector('.lesscode-editor-layout')
                this.canvasHeight = canvas.offsetHeight
                const resizeObserve = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        this.canvasHeight = entry.target.offsetHeight
                    }
                })
                resizeObserve.observe(canvas)
                this.$once('hook:beforeDestroy', () => {
                    resizeObserve.unobserve()
                    resizeObserve.disconnect()
                })
            },
            /**
             * @desc 只可以放入布局类型和交互是类型的组件
             * @param { Object } target
             * @param { Object } source
             * @returns { Boolean }
             */
            putCheck (target, source) {
                // 画布区域内部拖动
                if (getDragTargetGroup() === 'layout') {
                    return true
                }
                // 从物料区拖入
                const {
                    group
                } = source.options
                if (['layout', 'interactive'].includes(group.name)) {
                    return true
                }
                return false
            },
            /**
             * @desc 鼠标离开时清除组件 hover 效果
             * @param { Boolean } name
             * @returns { Boolean }
             */
            handleMouseleave () {
                LC.triggerEventListener('component-mouserleave')
            }
        }
    }
</script>
<style lang="postcss">
    .target-drag-area{
        z-index: 100000000;
    }
    .not-visible-mask{
        position: fixed;
        z-index: 1000000000000;
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
