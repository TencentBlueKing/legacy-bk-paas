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
    <style-layout title="定位">
        <style-item name="position">
            <bk-select :value="positionValue" style="width: 100%;" font-size="medium" placeholder="请选择" @change="handlePositionChange">
                <bk-option v-for="option in positionList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <template v-if="positionValue && positionValue !== 'static'">
            <style-item :name="item.name" v-for="item in posConfigRender" :key="item.key">
                <size-input v-model="item.value" @change="handleInputChange(item, $event)">
                    <append-select v-if="item.key !== 'zIndex'" v-model="item.unit" @change="handleSelectChange(item, $event)"></append-select>
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

    const posConfig = [
        {
            name: 'top',
            key: 'top'
        },
        {
            name: 'left',
            key: 'left'
        },
        {
            name: 'right',
            key: 'right'
        },
        {
            name: 'bottom',
            key: 'bottom'
        },
        {
            name: 'z-index',
            key: 'zIndex'
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
                positionValue: this.value.position || '',
                posConfigRender: [],
                positionList: [
                    { id: 'absolute', name: 'absolute' },
                    { id: 'fixed', name: 'fixed' },
                    { id: 'static', name: 'static' }
                ]
            }
        },
        mounted () {
            this.handleInitValueList()
        },
        methods: {
            handleInitValueList () {
                let result = posConfig
                if (this.include && this.include.length) {
                    result = result.filter(item => this.include.includes(item.key))
                }
                if (this.exclude) {
                    result = result.filter(item => !this.exclude.includes(item.key))
                }
                const that = this
                result = result.map(function (item) {
                    if (item.key === 'zIndex') {
                        item['value'] = that.value[item.key] || ''
                    } else {
                        item['value'] = splitValueAndUnit('value', that.value[item.key])
                        item['unit'] = splitValueAndUnit('unit', that.value[item.key]) || 'px'
                    }
                    return item
                })
                this.posConfigRender = result
            },
            handleInputChange (item, val) {
                item.value = val
                const unit = item.key !== 'zIndex' ? item.unit : ''
                const newValue = val === '' ? '' : val + unit
                this.change(item.key, newValue)
            },
            handleSelectChange (item, unit) {
                if (item.value !== '') {
                    item.unit = unit
                    item.value = Math.min(item.value, unit === '%' ? 100 : item.value)
                    this.change(item.key, item.value + unit)
                }
            },
            handlePositionChange (val) {
                this.posConfigRender.forEach(item => {
                    this.handleSelectChange(item, 'px')
                    this.handleInputChange(item, '')
                })
                this.positionValue = val
                this.change('position', val)
            }
        }
    }
</script>
