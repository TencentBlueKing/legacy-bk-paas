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
    <style-layout title="最小宽度">
        <style-item name="最小宽度">
            <size-input v-model="minWidthValue" @change="handleInputChange('minWidth', $event)">
                <append-select v-model="minWidthUnit" @change="handleSelectChange('minWidth', $event)"></append-select>
            </size-input>
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '@/element-materials/modifier/component/styles/layout/index'
    import StyleItem from '@/element-materials/modifier/component/styles/layout/item'
    import AppendSelect from '@/components/modifier/append-select'
    import SizeInput from '@/components/modifier/size-input'
    import { splitValueAndUnit } from '@/common/util'
    import defaultUnitMixin from '@/common/defaultUnit.mixin'

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
            type: {
                type: String,
                default: ''
            },
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                minWidthValue: '',
                minWidthUnit: ''
            }
        },
        created () {
            this.initData()
        },
        methods: {
            initData () {
                this.minWidthValue = splitValueAndUnit('value', this.value.minWidth)
                this.minWidthUnit = splitValueAndUnit('unit', this.value.minWidth) || this.defaultUnit
            },
            handleInputChange (key, val) {
                const unitMap = {
                    minWidth: this.minWidthUnit
                }
                const newValue = val === '' ? '' : val + unitMap[key]
                this.change(key, newValue)
            },
            handleSelectChange (key, unit) {
                if (key === 'minWidth' && this.minWidthValue !== '') {
                    this.minWidthValue = Math.min(this.minWidthValue, unit === '%' ? 100 : this.minWidthValue)
                }
                const valueMap = {
                    minWidth: this.minWidthValue
                }
                if (valueMap[key] !== '') {
                    this.change(key, valueMap[key] + unit)
                }
            }
        }
    }
</script>
