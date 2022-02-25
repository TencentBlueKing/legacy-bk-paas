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
    <div class="modifier-style">
        <div class="style-title">
            {{ title }}
            <span
                class="style-icon"
                v-if="iconShow"
                v-bk-tooltips.top="'重置属性值'"
                @click="handleClick">
                <i class="bk-drag-icon bk-drag-undo" />
            </span>
        </div>
        <div class="style-action">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            iconShow: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClick () {
                this.$emit('reset')
            }
        }
    }
</script>

<style lang='postcss'>
    .modifier-style {
        display: flex;
        flex-direction: column;
        width: 276px;
        padding: 20px 0 10px;
        margin-left: 12px;
        .style-title {
            font-size: 12px;
            display: flex;
            align-items: center;
            height: 20px;
            line-height: 20px;
            font-weight: bold;

            .style-icon {
                height: 20px;
                cursor: pointer;
                font-size: 16px;
                line-height: 18px;
                margin-left: 10px;
            }
        }
    }
</style>
