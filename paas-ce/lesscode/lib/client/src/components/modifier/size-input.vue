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
    <bk-input type="number"
        :ext-cls="isError ? 'king-input-modifier-style-error' : ''"
        :precision="0"
        :value="value"
        @change="handleChange">
        <template slot="append">
            <slot></slot>
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
                type: [String, Number],
                required: true
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

                this.$emit('change', val)
            }
        }
    }
</script>
