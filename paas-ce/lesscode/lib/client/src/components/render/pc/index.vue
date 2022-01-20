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
            :class="$style['canvas']"
            @mouseleave="handleMouseleave">
            <draggable
                v-if="isReady"
                class="target-drag-area"
                :class="[$style['editor'], platform === 'mobile' && $style['mobile']]"
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
    import Layout from './widget/layout'
    import ResolveInteractiveComponent from './resolve-interactive-component'
    import { mapGetters } from 'vuex'

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

            const nodeTreeReadyCallback = () => {
                this.isReady = true
            }

            const updateCallback = (event) => {
                console.log('from target updateCallback == ', event)
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    this.autoType()
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
            /**
             * @desc 自动排版子组件
             */
            autoType: _.throttle(function () {
                setTimeout(() => {
                    this.$refs.component.forEach((componentIns, index) => {
                        componentIns.componentData.setStyle('marginBottom', '10px')
                        if (index > 0) {
                            componentIns.componentData.setStyle('marginTop', '10px')
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
                // console.log('from render putCheckputCheckputCheckputCheckputCheckputCheck = ', source, getDragTargetGroup())
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
                LC.triggerEventListener('component-mouserleave')
            }
        }
    }
</script>
<style lang="postcss" module>
    @import './widget/patch.css';

    .canvas{
        min-height: calc(100% - 20px) !important;
        z-index: 1000000000000;
        /* 规避一些组件内部因为设置了 pointer-events 导致鼠标事件非法触发 */
        * {
            pointer-events: none;
        }
    }
    .editor{
        padding-bottom: 300px;
        z-index: 1000000000000 !important;
    }
    .mobile {
        padding-bottom: 50px;
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
