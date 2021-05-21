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
    <div :class="wrapperClass">
        <template v-if="componentData.type === 'render-grid'">
            <render-grid :key="componentData.renderKey" :component-data="componentData">
            </render-grid>
        </template>
        <template v-else-if="componentData.type === 'free-layout'">
            <free-layout :key="componentData.renderKey" :component-data="componentData">
            </free-layout>
        </template>
        <template v-else>
            <div class="interactive-component" :style="interactiveLayout" v-show="componentData.interactiveShow">
                <ComponentModule :key="componentData.renderKey" :component-data="componentData" :interactive-layout="interactiveLayout"></ComponentModule>
            </div>
        </template>
    </div>
</template>

<script>
    import RenderGrid from '@/components/render/grid'
    import FreeLayout from '@/components/render/free-layout'
    import ComponentModule from '@/components/render/component'

    export default {
        name: 'render-index',
        components: {
            RenderGrid,
            FreeLayout,
            ComponentModule
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                interactiveLayout: {
                    height: 0,
                    width: 0,
                    left: 0,
                    top: 0,
                    position: 'fixed',
                    zIndex: 101,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                },
                canvas: null,
                resizeObserver: null
            }
        },
        computed: {
            wrapperClass () {
                if (this.componentData.type === 'render-grid') {
                    return 'bk-layout-grid-row-wrapper'
                }
                if (this.componentData.type === 'free-layout') {
                    return 'bk-layout-free-wrapper'
                }
                return ''
            }
        },
        watch: {
        },
        created () {
        },
        mounted () {
            if (this.componentData.type !== 'render-grid' && this.componentData.type !== 'free-layout') {
                this.canvas = document.getElementsByClassName('main-content')[0]
                this.resizeObserver = new ResizeObserver(this.resizeInteractiveWrapper)
                this.resizeObserver.observe(this.canvas)
            }
        },
        beforeDestroy () {
            this.resizeObserver && this.resizeObserver.unobserve(this.canvas)
        },
        methods: {
            resizeInteractiveWrapper () {
                const { height, width, left, top } = this.canvas.getBoundingClientRect()
                this.interactiveLayout.height = height + 'px'
                this.interactiveLayout.width = width + 'px'
                this.interactiveLayout.left = left + 'px'
                this.interactiveLayout.top = top + 'px'
            }
        }
    }
</script>
<style lang="postcss">
    @import "./free-layout.css";
    .interactive-component {
        transform: translate(0, 0);
        /deep/.bk-dialog-wrapper {
            z-index: 0 !important;
        }
    }
</style>
