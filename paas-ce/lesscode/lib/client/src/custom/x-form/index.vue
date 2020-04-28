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
    <div>
        <bk-form :label-width="200" form-type="vertical">
            <bk-form-item label="文本框">
                <x-input style="width: 250px;" class="x-input" v-model="curValue" :placeholder="placeholder" />
            </bk-form-item>
            <bk-form-item label="下拉框">
                <x-select
                    style="width: 250px;"
                    v-model="selectRenderValue"
                    :multiple="selectMultiple"
                    :disabled="selectDisabled"
                    :readonly="selectReadonly"
                    :show-select-all="showSelectAll"
                >
                    <x-option v-for="option in selectRenderList"
                        :key="option.id"
                        :id="option.id"
                        :name="option.name">
                    </x-option>
                </x-select>
            </bk-form-item>
            <bk-form-item>
                <x-button :theme="buttonTheme" :title="title" @click="handleClick" style="margin-top: 20px">
                    {{buttonText || 123}}
                </x-button>
            </bk-form-item>
        </bk-form>
    </div>
</template>

<script>
    import XInput from './components/input/input'
    import XSelect from './components/select/select'
    import XOption from './components/select/option'
    import XButton from './components/button/button'

    export default {
        name: 'x-form',
        components: {
            XInput,
            XSelect,
            XOption,
            XButton
        },
        props: {
            // input
            value: {
                type: String,
                default: 'hello world'
            },
            placeholder: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            'extCls': {
                type: String
            },
            // button
            title: {
                type: String,
                default: 'hello world'
            },
            buttonText: {
                type: String,
                default: ''
            },
            buttonSubmitUrl: {
                type: String,
                default: ''
            },
            buttonTheme: {
                type: String,
                default: 'primary'
            },
            // select
            selectValue: {
                type: String,
                default: ''
            },
            showSelectAll: {
                type: Boolean,
                default: true
            },
            selectMultiple: {
                type: Boolean,
                default: true
            },
            selectDisabled: {
                type: Boolean,
                default: false
            },
            selectReadonly: {
                type: Boolean,
                default: false
            },
            selectAjaxUrl: {
                type: String,
                default: ''
            },
            selectRenderList: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                curValue: '',
                selectRenderValue: ''
            }
        },
        watch: {
            value: {
                handler (val, old) {
                    this.setCurValue(val)
                },
                immediate: true
            },
            selectValue: {
                handler (val, old) {
                    this.selectRenderValue = val
                },
                immediate: true
            }
        },
        async created () {
            if (this.selectAjaxUrl) {
                await this.getSelectData()
            }
        },
        mounted () {
        },
        methods: {
            setCurValue (val) {
                if (val === this.curValue) {
                    return false
                }

                this.curValue = val
            },
            async getSelectData () {
                await this.$http.get(this.selectAjaxUrl).then(res => {
                    this.selectRenderList.splice(0, this.selectRenderList.length, ...res.data)
                })
            },
            async handleClick () {
                if (this.buttonSubmitUrl) {
                    await this.$http.get(this.buttonSubmitUrl).then(res => {
                        console.warn('button submit trigger')
                        console.warn(res)
                    })
                } else {
                    alert('button click')
                }
            }
        }
    }
</script>

<style lang="postcss">
</style>
