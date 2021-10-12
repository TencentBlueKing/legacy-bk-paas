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
        <template v-if="type === 'min-width'">
            <style-item name="最小宽度">
                <size-input v-model="minWidthValue" @change="handleInputChange('minWidth', $event)">
                    <append-select v-model="minWidthUnit" @change="handleSelectChange('minWidth', $event)"></append-select>
                </size-input>
            </style-item>
        </template>
        <template v-else>
            <style-item name="宽度">
                <size-input v-model="widthValue" @change="handleInputChange('width', $event)">
                    <append-select v-model="widthUnit" @change="handleSelectChange('width', $event)"></append-select>
                </size-input>
            </style-item>
            <style-item name="高度">
                <size-input v-model="heightValue" @change="handleInputChange('height', $event)">
                    <append-select v-model="heightUnit" @change="handleSelectChange('height', $event)"></append-select>
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
                minWidthValue: splitValueAndUnit('value', this.value.minWidth),
                widthValue: splitValueAndUnit('value', this.value.width),
                heightValue: splitValueAndUnit('value', this.value.height),
                minWidthUnit: splitValueAndUnit('unit', this.value.minWidth) || 'px',
                widthUnit: splitValueAndUnit('unit', this.value.width) || 'px',
                heightUnit: splitValueAndUnit('unit', this.value.height) || 'px'
            }
        },
        methods: {
            handleInputChange (key, val) {
                const unitMap = {
                    width: this.widthUnit,
                    height: this.heightUnit,
                    minWidth: this.minWidthUnit
                }
                const newValue = val === '' ? '' : val + unitMap[key]
                this.change(key, newValue)
            },
            handleSelectChange (key, unit) {
                if (key === 'width' && this.widthValue !== '') {
                    this.widthValue = Math.min(this.widthValue, unit === '%' ? 100 : this.widthValue)
                }
                if (key === 'height' && this.heightValue !== '') {
                    this.heightValue = Math.min(this.heightValue, unit === '%' ? 100 : this.heightValue)
                }
                if (key === 'minWidth' && this.minWidthValue !== '') {
                    this.minWidthValue = Math.min(this.minWidthValue, unit === '%' ? 100 : this.minWidthValue)
                }
                const valueMap = {
                    width: this.widthValue,
                    height: this.heightValue,
                    minWidth: this.minWidthValue
                }
                if (valueMap[key] !== '') {
                    this.change(key, valueMap[key] + unit)
                }
            }
        }
    }
</script>
