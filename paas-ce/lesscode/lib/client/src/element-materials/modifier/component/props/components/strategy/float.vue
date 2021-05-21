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
        <!-- <bk-input type="number"
            :max="10"
            :min="0"
            :precision="2"
            style="width: 100%"
            :class="isError && 'king-input-modifier-style-error'"
            :value="defaultValue"
            @change="handleChange" /> -->
        <div class="bk-form-control" style="width: 100%;">
            <div class="bk-input-number">
                <input type="text"
                    maxlength="20"
                    style="width: 100%"
                    class="bk-form-input"
                    :class="isError && 'king-input-modifier-style-error'"
                    @keydown="inputKeydownHandler($event)"
                    v-model="renderValue"
                    @input="handleChange" />
                <span class="input-number-option">
                    <span class="number-option-item bk-icon icon-angle-up" @click="add"></span>
                    <span class="number-option-item bk-icon icon-angle-down" @click="sub"></span>
                </span>
            </div>
        </div>
        <p class="modifier-input-error-text" v-if="isError">{{describe.regErrorText || '格式错误，请重新输入'}}</p>
    </div>
</template>

<script>
    import { accAdd, accSub } from '@/common/util'

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
                isError: false,
                // 数字输入框中允许输入的键盘按钮的 keyCode 集合
                validKeyCodeList: [
                    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // 0-9
                    8, // backspace
                    // 189, // -
                    190, // .
                    38, 40, 37, 39, // up down left right
                    46, // del
                    9 // tab
                ],
                renderValue: 0
            }
        },
        watch: {
            defaultValue: {
                handler (v) {
                    this.renderValue = v
                },
                immediate: true
            }
        },
        methods: {
            /**
             * 数字文本框获 keydown 事件回调
             * input type=number 不支持 setSelectionRange
             *
             * @param {Object} e 事件对象
             */
            inputKeydownHandler (e) {
                const keyCode = e.keyCode
                const target = e.currentTarget
                const value = target.value
                // 键盘按下不允许的按钮
                if (this.validKeyCodeList.indexOf(keyCode) < 0
                    || (value.indexOf('.') >= 0 && keyCode === 190) // 已经有一个小数点了，本次又输入的是小数点
                ) {
                    e.stopPropagation()
                    e.preventDefault()
                    return false
                }
            },

            handleChange (e) {
                const val = this.renderValue
                const { regExp } = this.describe
                // 如果配置了正则就先校验 输入的时候从 bk-input 拿到的 val 是字符串
                if (regExp) {
                    if (String(val).match(regExp) || val === '') {
                        this.change(this.name, parseFloat(val), this.type)
                        this.isError = false
                    } else {
                        this.isError = true
                    }
                } else {
                    this.change(this.name, parseFloat(val), this.type)
                }
            },

            add () {
                if (parseFloat(this.renderValue) >= 1) {
                    return
                }
                this.renderValue = accAdd(this.renderValue, 0.1)
                this.handleChange()
            },

            sub () {
                if (parseFloat(this.renderValue) <= 0) {
                    return
                }
                this.renderValue = accSub(this.renderValue, 0.1)
                this.handleChange()
            }
        }
    }
</script>
