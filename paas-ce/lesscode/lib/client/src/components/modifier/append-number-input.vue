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
        :ext-cls="isError ? 'king-input-modifier-append-number-input king-input-modifier-style-error' : 'king-input-modifier-append-number-input'"
        :show-controls="controls"
        :value="value"
        @change="handleChange">
        <template slot="append">
            <div class="common-input-slot-text" style="width: 24px;">px</div>
        </template>
    </bk-input>
</template>

<script>
    import { validateNaturalNumber } from '@/common/util'

    export default {
        model: {
            event: 'change'
        },
        props: {
            value: {
                type: [Number, String],
                required: true
            },
            controls: {
                type: Boolean,
                default: false
            },
            // 是否转化数据类型为数值
            format: {
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
            handleChange (val) {
                if (!validateNaturalNumber(val)) {
                    this.isError = true
                    return
                }
                this.isError = false

                if (this.format) {
                    val = Number(val)
                }
                this.$emit('change', val)
            }
        }
    }
</script>

<style lang="postcss">
    .king-input-modifier-append-number-input {
        width: 64px;
        .bk-form-input {
            padding: 0 6px;
        }
    }
</style>
