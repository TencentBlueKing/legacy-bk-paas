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
    <bk-select :value="value" :ext-cls="extCls" :clearable="false" @change="$emit('change', $event)">
        <bk-option id="px" name="px"></bk-option>
        <bk-option id="%" name="%"></bk-option>
    </bk-select>
</template>

<script>
    export default {
        model: {
            event: 'change'
        },
        props: {
            value: {
                type: String,
                required: true
            },
            isMarginStyle: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            extCls () {
                return this.isMarginStyle ? 'king-select-append-input king-select-margin-style' : 'king-select-append-input'
            }
        }
    }
</script>

<style lang="postcss">
    .bk-select.king-select-append-input {
        width: 63px;
        border: none;
        background: #fafbfd;
        .bk-select-name {
            margin-left: 10px;
            padding: 0;
            font-size: 14px;
        }
        .bk-select-angle {
            font-size: 20px;
        }
        &.king-select-margin-style {
            width: 45px;
            .bk-select-name {
                margin-left: 6px;
            }
        }
    }
</style>
