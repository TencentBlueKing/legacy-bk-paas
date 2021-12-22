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
    <div :class="$style['row']" role="render-row">
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'render-row',
        inheritAttrs: false,
        props: {
            // 栅格间距，单位 px，左右平分
            gutter: {
                type: Number,
                default: 0
            },
            // 栅格容器的左右外边距
            marginHorizontal: {
                type: Number,
                default: 1
            },
            // 栅格容器的上下外边距
            marginVertical: {
                type: Number,
                default: 1
            },
            // 控制 row 是否使用 flex 布局
            // flex 可帮助撑开 bk-col 的高度，避免复杂的 dom 计算
            flex: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                renderCols: 0,
                renderGutter: this.gutter,
                renderFlex: this.flex
            }
        },
        watch: {
            flex: {
                handler (newVal) {
                    this.renderFlex = newVal
                },
                immediate: true
            },
            gutter: {
                handler (newVal) {
                    this.renderGutter = newVal
                },
                immediate: true
            }
        }
    }
</script>

<style lang="postcss" module>
    .row{
        display: flex !important;
        flex: 1 0 100%;
    }
</style>
