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
    <style-layout title="尺寸">
        <template v-for="item in sizeConfigRender">
            <style-item
                v-if="item.key === 'display' || (item.key !== 'display' && !isInline)"
                :name="item.name"
                :key="item.key">
                <bk-select
                    v-if="item.key === 'display'"
                    :value="item.value"
                    font-size="medium"
                    :clearable="false"
                    @change="handleDisplayChange(item, $event)"
                    style="width: 100%;">
                    <bk-option id="block" name="block" />
                    <bk-option id="inline" name="inline" />
                    <bk-option id="inline-block" name="inline-block" />
                    <bk-option id="unset" name="unset" />
                </bk-select>
                <size-input
                    v-else
                    :value="item.value"
                    @change="handleInputChange(item, $event)">
                    <append-select
                        :value="item.unit"
                        @change="handleSelectChange(item, $event)" />
                </size-input>
            </style-item>
        </template>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    import AppendSelect from '@/components/modifier/append-select'
    import SizeInput from '@/components/modifier/size-input'
    import { splitValueAndUnit } from '@/common/util'
    import { getCssProperties } from '../common/util'
    import defaultUnitMixin from '@/common/defaultUnit.mixin'

    const sizeConfig = [
        {
            name: 'display',
            key: 'display'
        },
        {
            name: '宽度',
            key: 'width'
        },
        {
            name: '高度',
            key: 'height'
        },
        {
            name: '最小宽度',
            key: 'minWidth'
        },
        {
            name: '最大宽度',
            key: 'maxWidth'
        },
        {
            name: '最小高度',
            key: 'minHeight'
        },
        {
            name: '最大高度',
            key: 'maxHeight'
        }
    ]
    
    export default {
        components: {
            StyleLayout,
            StyleItem,
            AppendSelect,
            SizeInput
        },
        mixins: [defaultUnitMixin],
        props: {
            value: {
                type: Object,
                required: true
            },
            include: {
                type: Array
            },
            exclude: {
                type: Array
            },
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                sizeConfigRender: []
            }
        },
        computed: {
            isInline () {
                const display = this.sizeConfigRender.filter(item => item.key === 'display')
                return display.length && display[0].value === 'inline'
            }
        },
        watch: {
            value: {
                handler (value) {
                    if (this.isInnerChange) {
                        this.isInnerChange = false
                        return
                    }
                    let result = getCssProperties(sizeConfig, this.include, this.exclude)
                    result = result.map((item) => {
                        if (item.key === 'display') {
                            item['value'] = value.display || ''
                        } else {
                            item['value'] = splitValueAndUnit('value', value[item.key])
                            item['unit'] = splitValueAndUnit('unit', value[item.key]) || this.defaultUnit
                        }
                        return item
                    })
                    this.sizeConfigRender = result
                },
                immediate: true
            }
        },
        created () {
            this.isInnerChange = false
        },
        methods: {
            triggerChange (key, value) {
                this.isInnerChange = true
                this.$emit('change', key, value)
            },
            handleInputChange (item, val) {
                const newValue = val === '' ? '' : val + item.unit
                item.value = val
                
                this.triggerChange(item.key, newValue)
            },
            handleSelectChange (item, unit) {
                item.unit = unit
                if (item.value !== '') {
                    item.value = Math.min(item.value, unit === '%' ? 100 : item.value)
                    this.triggerChange(item.key, item.value + unit)
                }
            },
            handleDisplayChange (item, val) {
                item.value = val
                if (val === 'inline') {
                    const that = this
                    this.sizeConfigRender.forEach(function (item) {
                        if (item.key !== 'display') {
                            item.value = ''
                            that.handleInputChange(item, '')
                        }
                    })
                }
                this.triggerChange('display', val)
            }
        }
    }
</script>
