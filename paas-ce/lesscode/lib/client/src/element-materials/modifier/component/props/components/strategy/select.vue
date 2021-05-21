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

<!-- <template functional>
    <bk-select style="width: 100%" :value="props.defaultValue" @change="val => props.change(`${props.name}`, val, props.type)">
        <bk-option
            v-for="option in props.describe.options"
            :key="option"
            :id="option"
            :name="option" />
    </bk-select>
</template> -->

<template>
    <bk-select style="width: 100%" v-model="renderValue" @change="handleChange" :clearable="clearable">
        <bk-option
            v-for="option in renderDescribe.options"
            :key="option"
            :id="option"
            :name="option" />
    </bk-select>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import { bus } from '@/common/bus'

    import { mapGetters } from 'vuex'

    export default {
        props: {
            defaultValue: {
                type: String,
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
            const clearable = this.describe.clearable
            return {
                clearable: (clearable === undefined || clearable === null) ? true : clearable,
                renderValue: '',
                renderDescribe: {}
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        watch: {
            defaultValue: {
                handler (v) {
                    this.renderValue = v
                },
                immediate: true
            }
        },
        created () {
            this.renderDescribe = cloneDeep(this.describe)
            const { listener } = this.renderDescribe
            if (listener) {
                bus.$on(listener, this.describeTriggerHandler)
                this.$once('hook:beforeDestroy', () => {
                    bus.$off(listener, this.describeTriggerHandler)
                })
            }

            // 第一次点击组件时触发一次
            const { trigger } = this.renderDescribe
            if (trigger) {
                bus.$emit(trigger, {
                    describe: this.describe,
                    name: this.name,
                    type: this.type,
                    val: this.renderValue
                })
            }
        },
        methods: {
            handleChange (val) {
                // bk-date-picker 组件，切换 type 时，把 value 清空。因为 daterange 类型的 bk-date-picker 默认值不是 YYYY-MM-DD
                if (this.curSelectedComponentData.type === 'bk-date-picker') {
                    this.change('value', '', 'string')
                }
                this.change(this.name, val, this.type)

                const { trigger } = this.renderDescribe
                if (trigger) {
                    bus.$emit(trigger, {
                        describe: this.describe,
                        name: this.name,
                        type: this.type,
                        val: val
                    })
                }
            },

            describeTriggerHandler (triggerData) {
                if (triggerData.name === 'type') {
                    const options = []
                    switch (triggerData.val) {
                        case 'date':
                        case 'daterange':
                        case 'datetime':
                        case 'datetimerange':
                            options.push('yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss')
                            break
                        case 'month':
                            options.push('yyyy-MM')
                            break
                        case 'year':
                            options.push('yyyy')
                            break
                        default:
                            break
                    }
                    this.renderDescribe.options.splice(0, this.renderDescribe.options.length, ...options)
                    this.renderDescribe.val = this.renderDescribe.options[0]
                    this.renderValue = this.renderDescribe.val
                }
            }
        }
    }
</script>
