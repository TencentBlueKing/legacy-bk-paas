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
    <style-layout title="内边距" :icon-show="true" @reset="handleReset">
        <div class="margin-style-container">
            <div class="margin-style-col-container">
                <margin-style
                    name="上"
                    disable-negative
                    :value="paddingTopValue"
                    :unit="paddingTopUnit"
                    @inputChange="handleInputChange('paddingTop', $event)"
                    @selectChange="handleSelectChange('paddingTop', $event)"
                ></margin-style>
                <margin-style
                    name="左"
                    disable-negative
                    :value="paddingLeftValue"
                    :unit="paddingLeftUnit"
                    @inputChange="handleInputChange('paddingLeft', $event)"
                    @selectChange="handleSelectChange('paddingLeft', $event)"
                ></margin-style>
            </div>
            <div class="margin-style-col-container">
                <margin-style
                    name="下"
                    disable-negative
                    :value="paddingBottomValue"
                    :unit="paddingBottomUnit"
                    @inputChange="handleInputChange('paddingBottom', $event)"
                    @selectChange="handleSelectChange('paddingBottom', $event)"
                ></margin-style>
                <margin-style
                    name="右"
                    disable-negative
                    :value="paddingRightValue"
                    :unit="paddingRightUnit"
                    @inputChange="handleInputChange('paddingRight', $event)"
                    @selectChange="handleSelectChange('paddingRight', $event)"
                ></margin-style>
            </div>
        </div>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import MarginStyle from '@/components/modifier/margin-style'
    import { splitValueAndUnit } from '@/common/util'

    export default {
        components: {
            StyleLayout,
            MarginStyle
        },
        props: {
            value: {
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
                paddingTopValue: splitValueAndUnit('value', this.value.paddingTop),
                paddingRightValue: splitValueAndUnit('value', this.value.paddingRight),
                paddingBottomValue: splitValueAndUnit('value', this.value.paddingBottom),
                paddingLeftValue: splitValueAndUnit('value', this.value.paddingLeft),
                paddingTopUnit: splitValueAndUnit('unit', this.value.paddingTop) || 'px',
                paddingRightUnit: splitValueAndUnit('unit', this.value.paddingRight) || 'px',
                paddingBottomUnit: splitValueAndUnit('unit', this.value.paddingBottom) || 'px',
                paddingLeftUnit: splitValueAndUnit('unit', this.value.paddingLeft) || 'px',
                styleMap: {
                    paddingTop: 'paddingBottom',
                    paddingBottom: 'paddingTop',
                    paddingLeft: 'paddingRight',
                    paddingRight: 'paddingLeft'
                }
            }
        },
        methods: {
            handleInputChange (key, val) {
                // 修改对应属性值并通知父组件
                const styleValue = val === '' ? '' : val + this[key + 'Unit']
                this[key + 'Value'] = val
                this.change(key, styleValue)
            },
            handleSelectChange (key, unit) {
                const styleValue = this[key + 'Value'] === '' ? '' : this[key + 'Value'] + unit
                this[key + 'Unit'] = unit
                this.change(key, styleValue)
            },
            handleReset () {
                this.handleInputChange('paddingBottom', '')
                this.handleInputChange('paddingTop', '')
                this.handleInputChange('paddingRight', '')
                this.handleInputChange('paddingLeft', '')
            }
        }
    }
</script>
