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
    <div class="bk-layout-grid-col" :style="style">
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'render-col',
        props: {
            // 每个栅格的宽度
            width: {
                type: [String, Number],
                default: ''
            },
            // 栅格的占位格数，可选值为 0~24 的整数，为 0 时，则为 col 相当于 width: 100%
            span: {
                type: Number,
                default: 1
            }
        },
        computed: {
            style () {
                const { width } = this
                const { renderGutter } = this.$parent
                return {
                    width,
                    'padding-right': `${renderGutter / 2}px`,
                    'padding-left': `${renderGutter / 2}px`
                }
            }
        }
    }
</script>

<style lang="postcss">
    @import "./col.css";
</style>
