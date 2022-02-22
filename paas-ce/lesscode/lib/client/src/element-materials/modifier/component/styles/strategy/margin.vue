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
    <style-layout title="外边距">
        <div class="margin-style-container">
            <div class="margin-style-col-container">
                <margin-style
                    name="上"
                    :value="marginTopValue"
                    :unit="marginTopUnit"
                    @inputChange="handleInputChange('marginTop', $event)"
                    @selectChange="handleSelectChange('marginTop', $event)"
                ></margin-style>
                <margin-style
                    name="左"
                    :value="marginLeftValue"
                    :unit="marginLeftUnit"
                    @inputChange="handleInputChange('marginLeft', $event)"
                    @selectChange="handleSelectChange('marginLeft', $event)"
                ></margin-style>
            </div>
            <div class="margin-style-col-container">
                <margin-style
                    name="下"
                    :value="marginBottomValue"
                    :unit="marginBottomUnit"
                    @inputChange="handleInputChange('marginBottom', $event)"
                    @selectChange="handleSelectChange('marginBottom', $event)"
                ></margin-style>
                <margin-style
                    name="右"
                    :value="marginRightValue"
                    :unit="marginRightUnit"
                    @inputChange="handleInputChange('marginRight', $event)"
                    @selectChange="handleSelectChange('marginRight', $event)"
                ></margin-style>
            </div>
        </div>
    </style-layout>
</template>

<script>
    import { mapGetters } from 'vuex'

    import StyleLayout from '../layout/index'
    import MarginStyle from '@/components/modifier/margin-style'
    import { splitValueAndUnit } from '@/common/util'
    import defaultUnitMixin from '@/common/defaultUnit.mixin'

    export default {
        components: {
            StyleLayout,
            MarginStyle
        },
        mixins: [defaultUnitMixin],
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
            console.log(this.defaultUnit, 'fuck unit')
            return {
                marginTopValue: splitValueAndUnit('value', this.value.marginTop),
                marginRightValue: splitValueAndUnit('value', this.value.marginRight),
                marginBottomValue: splitValueAndUnit('value', this.value.marginBottom),
                marginLeftValue: splitValueAndUnit('value', this.value.marginLeft),
                marginTopUnit: '',
                marginRightUnit: '',
                marginBottomUnit: '',
                marginLeftUnit: '',
                styleMap: {
                    marginTop: 'marginBottom',
                    marginBottom: 'marginTop',
                    marginLeft: 'marginRight',
                    marginRight: 'marginLeft'
                }
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        created () {
            this.initData()
        },
        methods: {
            initData () {
                this.marginTopUnit = splitValueAndUnit('unit', this.value.marginTop) || this.defaultUnit
                this.marginRightUnit = splitValueAndUnit('unit', this.value.marginRight) || this.defaultUnit
                this.marginBottomUnit = splitValueAndUnit('unit', this.value.marginBottom) || this.defaultUnit
                this.marginLeftUnit = splitValueAndUnit('unit', this.value.marginLeft) || this.defaultUnit
            },
            handleInputChange (key, value) {
                // 修改对应属性值并通知父组件
                const styleValue = value === '' ? '' : value + this[key + 'Unit']
                this[key + 'Value'] = value

                // bk-divider 本身带有 margin 的 inline 样式，所以这里 important
                if (this.curSelectedComponentData.type === 'bk-divider') {
                    this.change(key, styleValue + ' !important')
                } else {
                    this.change(key, styleValue)
                }
            },
            handleSelectChange (key, unit) {
                const styleValue = this[key + 'Value'] === '' ? '' : this[key + 'Value'] + unit
                this[key + 'Unit'] = unit

                // bk-divider 本身带有 margin 的 inline 样式，所以这里 important
                if (this.curSelectedComponentData.type === 'bk-divider') {
                    this.change(key, styleValue + ' !important')
                } else {
                    this.change(key, styleValue)
                }
            }
        }
    }
</script>

<style lang="postcss">
    .margin-style-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
