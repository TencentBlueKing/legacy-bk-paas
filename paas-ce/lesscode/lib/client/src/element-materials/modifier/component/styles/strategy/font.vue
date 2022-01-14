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
            <bk-select :value="renderValueMap.fontFamily" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('fontFamily', $event)">
                <bk-option v-for="option in fontFamilyList" :key="option.id" :id="option.id" :name="option.name" :style="'font-family:' + option.id"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="字号字重" v-if="handleHasKey('fontSize') || handleHasKey('fontWeight')">
            <font-size-input :value="renderValueMap.fontSize" @change="handleFontWithUnitChange('fontSize', $event)"></font-size-input>
            <bk-select :value="renderValueMap.fontWeight" style="width: 96px;" font-size="medium" :clearable="false" @change="handleFontChange('fontWeight', $event)">
                <bk-option v-for="option in fontWeightList" :key="option.id" :id="option.id" :name="option.name" :style="'font-weight:' + option.id"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="颜色" v-if="handleHasKey('color')">
            <bk-color-picker style="width: 100%;" v-model="renderValueMap.color" @change="handleFontChange('color', $event)"></bk-color-picker>
        </style-item>
        <style-item name="字体样式" v-if="handleHasKey('fontStyle')">
            <bk-select :value="renderValueMap.fontStyle" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('fontStyle', $event)">
                <bk-option v-for="option in fontStyleList" :key="option.id" :id="option.id" :name="option.name" :style="'font-style:' + option.id"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="行间距" v-if="handleHasKey('lineHeight')">
            <size-input v-model="renderValueMap.lineHeight" @change="handleInputChange('lineHeight', $event)">
                <append-select v-model="unitMap.lineHeight" @change="handleSelectChange('lineHeight', $event)"></append-select>
            </size-input>
        </style-item>
        <style-item name="字符间距" v-if="handleHasKey('letterSpacing')">
            <font-size-input style="width: 100%" :value="renderValueMap.letterSpacing" placeholder="请输入" @change="handleFontWithUnitChange('letterSpacing', $event)"></font-size-input>
        </style-item>
        <style-item name="word-spacing" v-if="handleHasKey('wordSpacing')">
            <font-size-input style="width: 100%" :value="renderValueMap.wordSpacing" placeholder="请输入" @change="handleFontWithUnitChange('wordSpacing', $event)"></font-size-input>
        </style-item>
        <style-item name="text-align" v-if="handleHasKey('textAlign')">
            <bk-select :value="renderValueMap.textAlign" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('textAlign', $event)">
                <bk-option v-for="option in textAlignList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="text-decoration" v-if="handleHasKey('textDecoration')">
            <bk-select :value="renderValueMap.textDecoration" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('textDecoration', $event)">
                <bk-option v-for="option in textDecorationList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="缩进" v-if="handleHasKey('textIndent')">
            <size-input v-model="renderValueMap.textIndent" @change="handleInputChange('textIndent', $event)">
                <append-select v-model="unitMap.textIndent" @change="handleSelectChange('textIndent', $event)"></append-select>
            </size-input>
        </style-item>
        <style-item name="text-overflow" v-if="handleHasKey('textOverflow')">
            <bk-select :value="renderValueMap.textOverflow" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('textOverflow', $event)">
                <bk-option v-for="option in textOverflowList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="word-break" v-if="handleHasKey('wordBreak')">
            <bk-select :value="renderValueMap.wordBreak" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('wordBreak', $event)">
                <bk-option v-for="option in wordBreakList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="word-wrap" v-if="handleHasKey('wordWrap')">
            <bk-select :value="renderValueMap.wordWrap" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('wordWrap', $event)">
                <bk-option v-for="option in wordWrapList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="white-space" v-if="handleHasKey('whiteSpace')">
            <bk-select :value="renderValueMap.whiteSpace" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('whiteSpace', $event)">
                <bk-option v-for="option in whiteSpaceList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
            </bk-select>
        </style-item>
        <style-item name="垂直对齐" v-if="handleHasKey('verticalAlign')">
            <bk-select :value="renderValueMap.verticalAlign" style="width: 100%;" font-size="medium" :clearable="false" @change="handleFontChange('verticalAlign', $event)">
                <bk-option v-for="option in verticalAlignList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
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
                fontStyleList: [{
                    id: 'normal', name: 'normal'
                }, {
                    id: 'italic', name: 'italic'
                }, {
                    id: 'oblique', name: 'oblique'
                }, {
                    id: 'inherit', name: 'inherit'
                }],
                textAlignList: [{
                    id: 'left', name: 'left'
                }, {
                    id: 'center', name: 'center'
                }, {
                    id: 'right', name: 'right'
                }],
                textDecorationList: [{
                    id: 'none', name: 'none'
                }, {
                    id: 'underline', name: 'underline'
                }, {
                    id: 'overline', name: 'overline'
                }, {
                    id: 'line-through', name: 'line-through'
                }],
                textOverflowList: [{
                    id: 'clip', name: 'clip'
                }, {
                    id: 'ellipsis', name: 'ellipsis'
                }],
                wordBreakList: [{
                    id: 'normal', name: 'normal'
                }, {
                    id: 'break-all', name: 'break-all'
                }, {
                    id: 'keep-all', name: 'keep-all'
                }],
                wordWrapList: [{
                    id: 'normal', name: 'normal'
                }, {
                    id: 'break-word', name: 'break-word'
                }],
                whiteSpaceList: [{
                    id: 'normal', name: 'normal'
                }, {
                    id: 'pre', name: 'pre'
                }, {
                    id: 'nowrap', name: 'nowrap'
                }, {
                    id: 'pre-wrap', name: 'pre-wrap'
                }, {
                    id: 'pre-line', name: 'pre-line'
                }, {
                    id: 'inherit', name: 'inherit'
                }],
                verticalAlignList: [{
                    id: 'baseline', name: 'baseline'
                }, {
                    id: 'sub', name: 'sub'
                }, {
                    id: 'super', name: 'super'
                }, {
                    id: 'top', name: 'top'
                }, {
                    id: 'text-top', name: 'text-top'
                }, {
                    id: 'middle', name: 'middle'
                }, {
                    id: 'bottom', name: 'bottom'
                }, {
                    id: 'text-bottom', name: 'text-bottom'
                }],
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
                const result = this.include && this.include.length ? {} : this.valueMap
                for (const i in this.valueMap) {
                    if (this.include && this.include.includes(i)) {
                        result[i] = this.valueMap[i]
                    }
                    if (this.exclude && this.exclude.includes(i)) {
                        delete result[i]
                    }
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
