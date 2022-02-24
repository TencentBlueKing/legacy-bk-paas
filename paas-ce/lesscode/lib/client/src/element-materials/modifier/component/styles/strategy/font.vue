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
        <style-item name="字体" v-if="handleHasKey('fontFamily')">
            <bk-select
                :value="renderValueMap.fontFamily"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('fontFamily', $event)"
                style="width: 100%;">
                <bk-option id="inherit" name="默认" />
                <bk-option id="PingFang SC, sans-serif" name="苹方" />
                <bk-option id="Microsoft Yahei, san-serif" name="微软雅黑" />
                <bk-option id="Songti SC, sans-serif" name="宋体" />
                <bk-option id="Arial, sans-serif" name="Arial" />
                <bk-option id="Helvetica, sans-serif" name="Helvetica" />
            </bk-select>
        </style-item>
        <style-item name="字号字重" v-if="handleHasKey('fontSize') || handleHasKey('fontWeight')">
            <font-size-input :value="renderValueMap.fontSize" @change="handleFontWithUnitChange('fontSize', $event)" />
            <bk-select
                :value="renderValueMap.fontWeight"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('fontWeight', $event)"
                style="width: 96px;">
                <bk-option id="inherit" name="默认" />
                <bk-option id="normal" name="normal" />
                <bk-option id="lighter" name="lighter" />
                <bk-option id="bolder" name="bolder" />
                <bk-option id="400" name="400" />
                <bk-option id="500" name="500" />
                <bk-option id="600" name="600" />
                <bk-option id="700" name="700" />
                <bk-option id="800" name="800" />
                <bk-option id="900" name="900" />
            </bk-select>
        </style-item>
        <style-item name="颜色" v-if="handleHasKey('color')">
            <bk-color-picker
                :value="renderValueMap.color"
                style="width: 100%;"
                @change="handleFontChange('color', $event)" />
        </style-item>
        <style-item name="字体样式" v-if="handleHasKey('fontStyle')">
            <bk-select
                :value="renderValueMap.fontStyle"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('fontStyle', $event)"
                style="width: 100%;">
                <bk-option id="normal" name="normal" />
                <bk-option id="italic" name="italic" />
                <bk-option id="oblique" name="oblique" />
                <bk-option id="inherit" name="inherit" />
            </bk-select>
        </style-item>
        <style-item name="行高" v-if="handleHasKey('lineHeight')">
            <size-input :value="renderValueMap.lineHeight" @change="handleInputChange('lineHeight', $event)">
                <append-select :value="unitMap.lineHeight" @change="handleSelectChange('lineHeight', $event)" />
            </size-input>
        </style-item>
        <style-item name="字符间距" v-if="handleHasKey('letterSpacing')">
            <font-size-input
                :value="renderValueMap.letterSpacing"
                placeholder="请输入"
                @change="handleFontWithUnitChange('letterSpacing', $event)"
                style="width: 100%" />
        </style-item>
        <style-item name="word-spacing" v-if="handleHasKey('wordSpacing')">
            <font-size-input
                :value="renderValueMap.wordSpacing"
                placeholder="请输入"
                @change="handleFontWithUnitChange('wordSpacing', $event)"
                style="width: 100%" />
        </style-item>
        <style-item name="text-align" v-if="handleHasKey('textAlign')">
            <bk-select
                :value="renderValueMap.textAlign"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('textAlign', $event)"
                style="width: 100%;">
                <bk-option id="left" name="left" />
                <bk-option id="center" name="center" />
                <bk-option id="right" name="right" />
            </bk-select>
        </style-item>
        <style-item name="text-decoration" v-if="handleHasKey('textDecoration')">
            <bk-select
                :value="renderValueMap.textDecoration"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('textDecoration', $event)"
                style="width: 100%;">
                <bk-option id="none" name="none" />
                <bk-option id="underline" name="underline" />
                <bk-option id="overline" name="overline" />
                <bk-option id="line-through" name="line-through" />
            </bk-select>
        </style-item>
        <style-item name="缩进" v-if="handleHasKey('textIndent')">
            <size-input :value="renderValueMap.textIndent" @change="handleInputChange('textIndent', $event)">
                <append-select :value="unitMap.textIndent" @change="handleSelectChange('textIndent', $event)" />
            </size-input>
        </style-item>
        <style-item name="text-overflow" v-if="handleHasKey('textOverflow')">
            <bk-select
                :value="renderValueMap.textOverflow"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('textOverflow', $event)"
                style="width: 100%;">
                <bk-option id="clip" name="clip" />
                <bk-option id="ellipsis" name="ellipsis" />
            </bk-select>
        </style-item>
        <style-item name="word-break" v-if="handleHasKey('wordBreak')">
            <bk-select
                :value="renderValueMap.wordBreak"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('wordBreak', $event)"
                style="width: 100%;">
                <bk-option id="normal" name="normal" />
                <bk-option id="break-all" name="break-all" />
                <bk-option id="keep-all" name="keep-all" />
            </bk-select>
        </style-item>
        <style-item name="word-wrap" v-if="handleHasKey('wordWrap')">
            <bk-select
                :value="renderValueMap.wordWrap"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('wordWrap', $event)"
                style="width: 100%;">
                <bk-option id="normal" name="normal" />
                <bk-option id="break-word" name="break-word" />
            </bk-select>
        </style-item>
        <style-item name="white-space" v-if="handleHasKey('whiteSpace')">
            <bk-select
                :value="renderValueMap.whiteSpace"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('whiteSpace', $event)"
                style="width: 100%;">
                <bk-option id="normal" name="normal" />
                <bk-option id="pre" name="pre" />
                <bk-option id="nowrap" name="nowrap" />
                <bk-option id="pre-wrap" name="pre-wrap" />
                <bk-option id="pre-line" name="pre-line" />
                <bk-option id="inherit" name="inherit" />
            </bk-select>
        </style-item>
        <style-item name="垂直对齐" v-if="handleHasKey('verticalAlign')">
            <bk-select
                :value="renderValueMap.verticalAlign"
                font-size="medium"
                :clearable="false"
                @change="handleFontChange('verticalAlign', $event)"
                style="width: 100%;">
                <bk-option id="baseline" name="baseline" />
                <bk-option id="sub" name="sub" />
                <bk-option id="super" name="super" />
                <bk-option id="top" name="top" />
                <bk-option id="text-top" name="text-top" />
                <bk-option id="middle" name="middle" />
                <bk-option id="bottom" name="bottom" />
                <bk-option id="text-bottom" name="text-bottom" />
            </bk-select>
        </style-item>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    import FontSizeInput from '@/components/modifier/font-size-input'
    import AppendSelect from '@/components/modifier/append-select'
    import SizeInput from '@/components/modifier/size-input'
    import { splitValueAndUnit } from '@/common/util'
    import { getCssProperties } from '../common/util'

    export default {
        components: {
            StyleLayout,
            StyleItem,
            FontSizeInput,
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
                valueMap: {
                    fontFamily: this.value.fontFamily || 'inherit',
                    fontSize: splitValueAndUnit('value', this.value.fontSize),
                    fontWeight: this.value.fontWeight || 'inherit',
                    color: this.value.color || '',
                    fontStyle: this.value.fontStyle || 'normal',
                    lineHeight: splitValueAndUnit('value', this.value.lineHeight),
                    letterSpacing: splitValueAndUnit('value', this.value.letterSpacing),
                    wordSpacing: splitValueAndUnit('value', this.value.wordSpacing),
                    textAlign: this.value.textAlign || 'left',
                    textDecoration: this.value.textDecoration || 'none',
                    textIndent: splitValueAndUnit('value', this.value.textIndent),
                    textOverflow: this.value.textOverflow || 'clip',
                    wordBreak: this.value.wordBreak || 'normal',
                    wordWrap: this.value.wordWrap || 'normal',
                    whiteSpace: this.value.whiteSpace || 'normal',
                    verticalAlign: this.value.verticalAlign || 'baseline'
                },
                unitMap: {
                    lineHeight: splitValueAndUnit('unit', this.value.lineHeight) || 'px',
                    textIndent: splitValueAndUnit('unit', this.value.textIndent) || 'px'
                },
                renderValueMap: {}
            }
        },
        mounted () {
            this.handleInitValueMap()
        },
        methods: {
            handleInitValueMap () {
                const result = getCssProperties(this.valueMap, this.include, this.exclude)
                if (result.hasOwnProperty('fontSize') || result.hasOwnProperty('fontWeight')) {
                    result['fontSize'] = this.valueMap['fontSize']
                    result['fontWeight'] = this.valueMap['fontWeight']
                }
                this.renderValueMap = result
            },
            handleFontChange (key, val) {
                this.renderValueMap[key] = val
                this.change(key, val)
            },
            handleFontWithUnitChange (key, val) {
                this.renderValueMap[key] = val
                const newVal = val === '' ? '' : val + 'px'
                this.change(key, newVal)
            },
            handleInputChange (key, val) {
                const newValue = val === '' ? '' : val + this.unitMap[key]
                this.change(key, newValue)
            },
            handleSelectChange (key, unit) {
                if (this.renderValueMap[key] !== '') {
                    this.change(key, this.renderValueMap[key] + unit)
                }
            },
            handleHasKey (key) {
                return this.renderValueMap.hasOwnProperty(key)
            }
        }
    }
</script>
