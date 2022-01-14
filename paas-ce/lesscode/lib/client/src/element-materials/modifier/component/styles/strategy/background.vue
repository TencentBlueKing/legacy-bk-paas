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
    <style-layout title="背景">
        <style-item name="颜色" v-if="handleHasKey('backgroundColor')">
            <bk-color-picker style="width: 100%;" v-model="renderValueMap.backgroundColor" @change="handleValueChange('backgroundColor', $event)"></bk-color-picker>
        </style-item>
        <style-item name="背景图" v-if="handleHasKey('backgroundImage')">
            <bk-switcher theme="primary" size="small" :value="backgroundImageShow" @change="handleImageShowChange" />
        </style-item>
        <template v-if="backgroundImageShow">
            <style-item name="url">
                <bk-input style="width: 100%" :value="renderValueMap.backgroundImage" @change="handleValueChange('backgroundImage', $event)" />
            </style-item>
            <style-item name="大小">
                <template>
                    <size-input style="width: 60px" v-model="backgroundSize.width" :placeholder="' '" @change="handleInputChange('backgroundSize', $event)"></size-input>
                    <size-input style="width: 60px" v-model="backgroundSize.height" :placeholder="' '" @change="handleInputChange('backgroundSize', $event)"></size-input>
                </template>
                <append-select style="border: 1px solid #c4c6cc" :value="backgroundSize.unit" :is-margin-style="true" @change="handleUnitChange('backgroundSize', $event)"></append-select>
            </style-item>
            <style-item name="位置">
                <template>
                    <size-input style="width: 60px" v-model="backgroundPosition.x" :placeholder="' '" @change="handleInputChange('backgroundPosition', $event)"></size-input>
                    <size-input style="width: 60px" v-model="backgroundPosition.y" :placeholder="' '" @change="handleInputChange('backgroundPosition', $event)"></size-input>
                </template>
                <append-select style="border: 1px solid #c4c6cc" :value="backgroundPosition.unit" :is-margin-style="true" @change="handleUnitChange('backgroundPosition', $event)"></append-select>
            </style-item>
            <style-item name="repeat">
                <bk-select :value="imageConfig.backgroundRepeat" style="width: 100%;" font-size="medium" @change="handleConfigChange('backgroundRepeat', $event)">
                    <bk-option v-for="option in repeatList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
                </bk-select>
            </style-item>
            <style-item name="attachment">
                <bk-select :value="imageConfig.backgroundAttachment" style="width: 100%;" font-size="medium" @change="handleConfigChange('backgroundAttachment', $event)">
                    <bk-option v-for="option in attachmentList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
                </bk-select>
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
                unitList: [
                    { name: 'px', id: 'px' },
                    { name: '%', id: '%' }
                ],
                repeatList: [
                    { name: 'repeat', id: 'repeat' },
                    { name: 'repeat-x', id: 'repeat-x' },
                    { name: 'repeat-y', id: 'repeat-y' },
                    { name: 'no-repeat', id: 'no-repeat' }
                ],
                attachmentList: [
                    { name: 'scroll', id: 'scroll' },
                    { name: 'fixed', id: 'fixed' }
                ],
                valueMap: {
                    backgroundColor: this.value.backgroundColor,
                    backgroundImage: this.value.backgroundImage
                },
                // background-image相关属性
                backgroundImageShow: false,
                backgroundSize: { width: '', height: '', unit: 'px' },
                backgroundPosition: { x: '', y: '', unit: 'px' },
                imageConfig: {
                    backgroundRepeat: this.value.backgroundRepeat || 'repeat',
                    backgroundAttachment: this.value.backgroundAttachment || 'scroll'
                },
                renderValueMap: {}
            }
        },
        mounted () {
            this.handleMapInit()
        },
        methods: {
            handleMapInit () {
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

                // 初始化background-image相关属性
                if (this.renderValueMap.hasOwnProperty('backgroundImage')) {
                    if (this.renderValueMap.backgroundImage) {
                        this.backgroundImageShow = true
                        this.renderValueMap.backgroundImage = this.renderValueMap.backgroundImage.replace(/url\(|\)/g, '')
                    }
                    if (this.value.backgroundSize) {
                        const size = this.value.backgroundSize.split(' ')
                        this.backgroundSize.width = splitValueAndUnit('value', size[0])
                        this.backgroundSize.height = splitValueAndUnit('value', size[1])
                        this.backgroundSize.unit = splitValueAndUnit('unit', size[0])
                    }
                    if (this.value.backgroundPosition) {
                        const pos = this.value.backgroundPosition.split(' ')
                        this.backgroundPosition.x = splitValueAndUnit('value', pos[0])
                        this.backgroundPosition.y = splitValueAndUnit('value', pos[1])
                        this.backgroundPosition.unit = splitValueAndUnit('unit', pos[0])
                    }
                }
            },
            handleValueChange (key, value) {
                this.renderValueMap[key] = value
                const newValue = key === 'backgroundImage' && value ? `url(${value})` : value
                this.change(key, newValue)
            },
            handleConfigChange (key, value) {
                this.imageConfig[key] = value
                this.change(key, value)
            },
            handleUnitChange (key, val) {
                if (key === 'backgroundSize') {
                    this.backgroundSize.unit = val
                } else if (key === 'backgroundPosition') {
                    this.backgroundPosition.unit = val
                }
                this.handleInputChange(key)
            },
            handleInputChange (key, val) {
                let newValue
                if (key === 'backgroundSize' && this.backgroundSize.width && this.backgroundSize.height) {
                    const unit = this.backgroundSize.unit
                    newValue = `${this.backgroundSize.width}${unit} ${this.backgroundSize.height}${unit}`
                } else if (key === 'backgroundPosition' && (this.backgroundPosition.x || this.backgroundPosition.y)) {
                    const unit = this.backgroundPosition.unit
                    const x = this.backgroundPosition.x ? `${this.backgroundPosition.x}${unit}` : `0${unit}`
                    const y = this.backgroundPosition.y ? `${this.backgroundPosition.y}${unit}` : `0${unit}`
                    newValue = `${x} ${y}`
                } else {
                    newValue = ''
                }
                this.change(key, newValue)
            },
            // 清除image配置
            handleImageShowChange (value) {
                this.backgroundImageShow = value
                if (!this.backgroundImageShow) {
                    this.handleValueChange('backgroundImage', '')
                    this.handleConfigChange('backgroundRepeat', '')
                    this.handleConfigChange('backgroundAttachment', '')
                    this.backgroundSize = { width: '', height: '', unit: 'px' }
                    this.backgroundPosition = { x: '', y: '', unit: 'px' }
                    this.handleInputChange('backgroundSize', '')
                    this.handleInputChange('backgroundPosition', '')
                }
            },
            handleHasKey (key) {
                return this.renderValueMap.hasOwnProperty(key)
            }
        }
    }
</script>
