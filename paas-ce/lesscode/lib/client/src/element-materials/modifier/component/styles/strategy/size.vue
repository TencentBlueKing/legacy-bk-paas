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
        <style-item :name="item.name" v-for="item in sizeConfigRender" :key="item.key">
            <bk-select
                v-if="item.key === 'display'"
                :value="item.value" style="width: 100%;"
                font-size="medium" :clearable="false"
                @change="handleDisplayChange(item, $event)">
                <bk-option id="block" name="block" />
                <bk-option id="inline" name="inline" />
                <bk-option id="inline-block" name="inline-block" />
                <bk-option id="inherit" name="inherit" />
                <bk-option id="initial" name="initial" />
            </bk-select>
            <size-input v-else :value="item.value" @change="handleInputChange(item, $event)">
                <append-select :value="item.unit" @change="handleSelectChange(item, $event)"></append-select>
            </size-input>
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    import AppendSelect from '@/components/modifier/append-select'
    import SizeInput from '@/components/modifier/size-input'
    import { splitValueAndUnit } from '@/common/util'

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
        mounted () {
            this.handleInitValueList()
        },
        methods: {
            handleInitValueList () {
                let result = sizeConfig
                if (this.include && this.include.length) {
                    result = result.filter(item => this.include.includes(item.key))
                }
                if (this.exclude) {
                    result = result.filter(item => !this.exclude.includes(item.key))
                }
                const that = this
                result = result.map(function (item) {
                    if (item.key === 'display') {
                        item['value'] = that.value.display || ''
                    } else {
                        item['value'] = splitValueAndUnit('value', that.value[item.key])
                        item['unit'] = splitValueAndUnit('unit', that.value[item.key]) || 'px'
                    }
                    return item
                })
                this.sizeConfigRender = result
            },
            handleInputChange (item, val) {
                const newValue = val === '' ? '' : val + item.unit
                this.change(item.key, newValue)
            },
            handleSelectChange (item, unit) {
                if (item.value !== '') {
                    item.value = Math.min(item.value, unit === '%' ? 100 : item.value)
                    this.change(item.key, item.value + unit)
                }
            },
            handleDisplayChange (item, val) {
                item.value = val
                this.change('display', val)
            }
        }
    }
</script>
