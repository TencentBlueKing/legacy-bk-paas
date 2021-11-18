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
        <draggable
            class="target-drag-area"
            :component-data="componentData"
            :list="componentData.slot.default"
            disabled
            :sort="true"
            :group="{
                pull: 'clone',
                put: [
                    'layout',
                    'interactive'
                ]
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
        <div
            v-show="showNotVisibleMask"
            class="not-visible-mask"
            :style="{ height: canvasHeight + 'px' }">
            <span class="not-visible-text">
                {{`该组件(${invisibleComponent})处于隐藏状态，请先打开`}}
            </span>
        </div>
    </layout>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import Draggable from './components/draggable'
    import Layout from './widget/layout'
    import ResolveInteractiveComponent from './resolve-interactive-component'
    import { bus } from '@/common/bus'

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
        props: {
            mainContentLoading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showNotVisibleMask: false,
                canvasHeight: 100,
                resizeObserve: null,
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
            const updateCallback = _.throttle((event) => {
                console.log('from target updateCallback == ', event)
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                }
            }, 100)
            /** 当主页面拉去数据、加载页面后，调用动态计算遮罩的方法 */
            bus.$on('pageInitialized', this.observeInteractiveMask)

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
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', interactiveWatcher)
            LC.addEventListener('toggleInteractive', interactiveWatcher)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', interactiveWatcher)
                LC.removeEventListener('toggleInteractive', interactiveWatcher)
                bus.$off('pageInitialized')
            })
        },
        mounted () {
            const resetCallback = () => {
                LC.clearMenu()
            }
            document.body.addEventListener('click', resetCallback)
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('click', resetCallback)
                this.resizeObserve && this.resizeObserve.disconnect()
            })
        },
        methods: {
            observeInteractiveMask () {
                const canvas = document.querySelector('.lesscode-editor-layout')
                this.canvasHeight = canvas.offsetHeight
                this.resizeObserve = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        this.canvasHeight = entry.target.offsetHeight
                    }
                })
                this.resizeObserve.observe(canvas)
            }
        }
    }
</script>
<style lang="postcss">
    .save-as-template {
        z-index: 1001;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        font-size: 12px;
        color: #fff;
        background: #3a84ff;
        border-radius: 2px;
        padding: 2px 5px;
        cursor: pointer;
        &:hover {
            background: #1964E1;
        }
    }
</style>
