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
            :class="$style['canvas']"
            @click="handleCanvaseClick"
            @mouseleave="handleMouseleave">
            <draggable
                v-if="isReady"
                class="target-drag-area"
                :class="[$style['editor']]"
                :component-data="componentData"
                :list="componentData.slot.default"
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
        </div>
        <div
            v-if="showNotVisibleMask"
            :class="$style['not-visible-mask']">
            {{`该组件(${invisibleComponent})处于隐藏状态，请先打开`}}
        </div>
    </layout>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import Draggable, {
        getDragTargetGroup
    } from './components/draggable'
    import LesscodeFocus from './components/lesscode-focus'
    import LesscodeTools from './components/lesscode-tools'
    import Layout from './widget/layout'
    import ResolveComponent from './resolve-component'
    import ResolveInteractiveComponent from './resolve-interactive-component'
    import { mapGetters } from 'vuex'

    export default {
        name: 'render',
        components: {
            Draggable,
            LesscodeFocus,
            LesscodeTools,
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
                isReady: LC.isReady,
                showNotVisibleMask: false,
                invisibleComponent: ''
            }
        },
        computed: {
            ...mapGetters('page', ['platform'])
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

            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    this.autoType()
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

            LC.addEventListener('ready', readyCallback)
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', interactiveCallbak)
            LC.addEventListener('toggleInteractive', interactiveCallbak)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('ready', readyCallback)
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', interactiveCallbak)
                LC.removeEventListener('toggleInteractive', interactiveCallbak)
            })
        },
        mounted () {
            this.componentData.mounted(this.$refs.root)
            const resetCallback = () => {
                LC.clearMenu()
            }
            document.body.addEventListener('click', resetCallback)
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('click', resetCallback)
            })
        },
        methods: {
            /**
             * @desc 自动排版子组件
             */
            autoType: _.throttle(function () {
                setTimeout(() => {
                    this.$refs.component.forEach((componentIns, index) => {
                        componentIns.componentData.setStyle('margin-bottom', '10px')
                        if (index > 0) {
                            componentIns.componentData.setStyle('margin-top', '10px')
                        }
                    })
                })
            }, 20),
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
                if ([
                    'layout',
                    'interactive'
                ].includes(group.name)) {
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
                LC.triggerEventListener('componentMouserleave', {
                    type: 'componentMouserleave'
                })
            },
            /**
             * @desc 画布编辑区空白区域被点击取消组件的选中状态
             * @param { Object } event
             */
            handleCanvaseClick (event) {
                if (event.target.classList.contains(this.$style['editor'])) {
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
        z-index: 1000000000000 !important;
        min-height: calc(100% - 20px) !important;
    }
    .editor{
        /* 规避一些组件内部因为设置了 pointer-events 导致鼠标事件非法触发 */
        padding-bottom: 300px;
        * {
            pointer-events: none;
        }
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
