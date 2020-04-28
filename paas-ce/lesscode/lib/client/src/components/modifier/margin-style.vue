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
    <bk-input
        type="number"
        placeholder=" "
        :ext-cls="isError ? 'king-input-margin-style king-input-modifier-style-error' : 'king-input-margin-style'"
        :precision="0"
        :value="value"
        @change="handleInputChange">
        <template slot="prepend">
            <div class="common-input-slot-text">{{ name }}</div>
        </template>
        <template slot="append">
            <append-select :value="unit" :is-margin-style="true" @change="$emit('selectChange', $event)"></append-select>
        </template>
    </bk-input>
</template>

<script>
    import AppendSelect from '@/components/modifier/append-select'
    import { validateNaturalNumber, validateRoundNumber } from '@/common/util'

    export default {
        components: {
            AppendSelect
        },
        props: {
            name: {
                type: String,
                required: true
            },
            value: {
                type: [String, Number],
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            disableNegative: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isError: false
            }
        },
        methods: {
            handleInputChange (val) {
                if (this.disableNegative) {
                    if (!validateNaturalNumber(val)) {
                        this.isError = true
                    } else {
                        this.isError = false
                        this.$emit('inputChange', val)
                    }
                } else {
                    if (!validateRoundNumber(val)) {
                        this.isError = true
                    } else {
                        this.isError = false
                        this.$emit('inputChange', val)
                    }
                }
            }
        }
    }
</script>

<style lang="postcss">
    .king-input-margin-style {
        width: 132px;
        margin-top: 10px;
        .bk-form-input {
            padding: 0 26px 0 6px;
        }
    }
</style>
