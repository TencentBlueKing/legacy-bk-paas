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
    <style-layout title="文字">
        <style-item name="字体">
            <bk-select :value="fontFamilyValue" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontFamilyChange">
                <bk-option v-for="option in fontFamilyList" :key="option.id" :id="option.id" :name="option.name" :style="'font-family:' + option.id"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="字号字重">
            <font-size-input :value="fontSizeValue" @change="handleFontSizeChange"></font-size-input>
            <bk-select :value="fontWeightValue" style="width: 96px;" font-size="medium" :clearable="false" @change="handleFontWeightChange">
                <bk-option v-for="option in fontWeightList" :key="option.id" :id="option.id" :name="option.name" :style="'font-weight:' + option.id"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="颜色">
            <bk-color-picker style="width: 100%;" v-model="colorValue" @change="handleColorChange"></bk-color-picker>
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    import FontSizeInput from '@/components/modifier/font-size-input'
    import { splitValueAndUnit } from '@/common/util'

    export default {
        components: {
            StyleLayout,
            StyleItem,
            FontSizeInput
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
                fontFamilyValue: this.value.fontFamily || 'inherit',
                fontFamilyList: [{
                    id: 'inherit', name: '默认'
                }, {
                    id: 'PingFang SC, sans-serif', name: '苹方'
                }, {
                    id: 'Microsoft Yahei, san-serif', name: '微软雅黑'
                }, {
                    id: 'Songti SC, sans-serif', name: '宋体'
                }, {
                    id: 'Arial, sans-serif', name: 'Arial'
                }, {
                    id: 'Helvetica, sans-serif', name: 'Helvetica'
                }],
                fontSizeValue: splitValueAndUnit('value', this.value.fontSize),
                fontWeightValue: this.value.fontWeight || 'inherit',
                fontWeightList: [{
                    id: 'inherit', name: '默认'
                }, {
                    id: 'normal', name: 'normal'
                }, {
                    id: 'lighter', name: 'lighter'
                }, {
                    id: 'bolder', name: 'bolder'
                }, {
                    id: '400', name: '400'
                }, {
                    id: '500', name: '500'
                }, {
                    id: '600', name: '600'
                }, {
                    id: '700', name: '700'
                }, {
                    id: '800', name: '800'
                }, {
                    id: '900', name: '900'
                }],
                colorValue: this.value.color || ''
            }
        },
        methods: {
            handleFontFamilyChange (val) {
                this.fontFamilyValue = val
                this.change('fontFamily', val)
            },
            handleFontSizeChange (val) {
                this.fontSizeValue = val
                const newVal = val === '' ? '' : val + 'px'
                this.change('fontSize', newVal)
            },
            handleFontWeightChange (val) {
                this.fontWeightValue = val
                this.change('fontWeight', val)
            },
            handleColorChange (val) {
                this.colorValue = val
                this.change('color', val)
            }
        }
    }
</script>
