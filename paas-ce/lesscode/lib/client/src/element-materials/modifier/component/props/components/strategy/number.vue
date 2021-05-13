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
    <div class="modifier-props-input-container">
        <bk-input type="number"
            style="width: 100%"
            :class="isError && 'king-input-modifier-style-error'"
            :value="defaultValue"
            @change="handleChange" />
        <p class="modifier-input-error-text" v-if="isError">{{describe.regErrorText || '格式错误，请重新输入'}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            defaultValue: {
                type: [Number, String],
                required: true
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            describe: {
                type: Object,
                required: true
            },
            change: {
                type: Function,
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
                const { regExp } = this.describe
                // 如果配置了正则就先校验 输入的时候从 bk-input 拿到的 val 是字符串
                if (regExp) {
                    val = val.toString()
                    if (val.match(regExp) || val === '') {
                        this.change(`${this.name}`, parseInt(~~val, 10), this.type)
                        this.isError = false
                    } else {
                        this.isError = true
                    }
                } else {
                    this.change(`${this.name}`, parseInt(~~val, 10), this.type)
                }
            }
        }
    }
</script>
