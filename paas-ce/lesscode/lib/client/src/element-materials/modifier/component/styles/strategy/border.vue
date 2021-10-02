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
    <style-layout title="边框">
        <div class="radius-container">
            <div class="radius-label">圆角</div>
            <div class="radius-content">
                <div class="all-border-container">
                    <div class="icon-container">
                        <span class="bk-drag-icon bk-drag-radius-all" :class="isAllBorder && 'active'" @click="isAllBorder = true"></span>
                        <span class="bk-drag-icon bk-drag-radius-sj" :class="!isAllBorder && 'active'" @click="isAllBorder = false"></span>
                    </div>
                    <bk-slider ext-cls="border-radius-slider" :max-value="99" v-model="borderRadius"></bk-slider>
                    <append-number-input v-model="borderRadius" format></append-number-input>
                </div>
                <div class="single-border-container" v-show="!isAllBorder">
                    <div class="row-container">
                        <div class="single-border">
                            <img src="../../../../../images/svg/icon-radius-s.svg" alt="" width="20px">
                            <div class="img-cover" v-show="isDifferent"></div>
                            <append-number-input v-model="borderTopLeftRadius" format></append-number-input>
                        </div>
                        <div class="single-border">
                            <img src="../../../../../images/svg/icon-radius-zs.svg" alt="" width="20px">
                            <div class="img-cover" v-show="isDifferent"></div>
                            <append-number-input v-model="borderTopRightRadius" format></append-number-input>
                        </div>
                    </div>
                    <div class="row-container">
                        <div class="single-border">
                            <img src="../../../../../images/svg/icon-radius-ys.svg" alt="" width="20px">
                            <div class="img-cover" v-show="isDifferent"></div>
                            <append-number-input v-model="borderBottomLeftRadius" format></append-number-input>
                        </div>
                        <div class="single-border">
                            <img src="../../../../../images/svg/icon-radius-yx.svg" alt="" width="20px">
                            <div class="img-cover" v-show="isDifferent"></div>
                            <append-number-input v-model="borderBottomRightRadius" format></append-number-input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="property-container">
            <div class="border-icons-container">
                <div class="top-icons icons-box">
                    <div class="border-icon-container" @click="activeBorder = 'borderTop'">
                        <img src="../../../../../images/svg/icon-border-s.svg" alt="" width="20px">
                        <div class="img-cover" v-show="activeBorder === 'borderTop'"></div>
                    </div>
                </div>
                <div class="middle-icons icons-box">
                    <div class="border-icon-container" @click="activeBorder = 'borderLeft'">
                        <img src="../../../../../images/svg/icon-border-z.svg" alt="" width="20px">
                        <div class="img-cover" v-show="activeBorder === 'borderLeft'"></div>
                    </div>
                    <div class="border-icon-container" @click="activeBorder = 'border'">
                        <img src="../../../../../images/svg/icon-border-all.svg" alt="" width="20px">
                        <div class="img-cover" v-show="activeBorder === 'border'"></div>
                    </div>
                    <div class="border-icon-container" @click="activeBorder = 'borderRight'">
                        <img src="../../../../../images/svg/icon-border-y.svg" alt="" width="20px">
                        <div class="img-cover" v-show="activeBorder === 'borderRight'"></div>
                    </div>
                </div>
                <div class="bottom-icons icons-box">
                    <div class="border-icon-container" @click="activeBorder = 'borderBottom'">
                        <img src="../../../../../images/svg/icon-border-x.svg" alt="" width="20px">
                        <div class="img-cover" v-show="activeBorder === 'borderBottom'"></div>
                    </div>
                </div>
            </div>
            <border-detail
                v-show="activeBorder === 'border'"
                :border-style="borderStyle"
                :border-width="borderWidth"
                :border-color="borderColor"
                @borderStyleChange="handleBorderStyleChange('border', $event)"
                @borderWidthChange="handleBorderWidthChange('border', $event)"
                @borderColorChange="handleBorderColorChange('border', $event)"
            ></border-detail>
            <border-detail
                v-show="activeBorder === 'borderTop'"
                :border-style="borderTopStyle"
                :border-width="borderTopWidth"
                :border-color="borderTopColor"
                @borderStyleChange="handleBorderStyleChange('borderTop', $event)"
                @borderWidthChange="handleBorderWidthChange('borderTop', $event)"
                @borderColorChange="handleBorderColorChange('borderTop', $event)"
            ></border-detail>
            <border-detail
                v-show="activeBorder === 'borderRight'"
                :border-style="borderRightStyle"
                :border-width="borderRightWidth"
                :border-color="borderRightColor"
                @borderStyleChange="handleBorderStyleChange('borderRight', $event)"
                @borderWidthChange="handleBorderWidthChange('borderRight', $event)"
                @borderColorChange="handleBorderColorChange('borderRight', $event)"
            ></border-detail>
            <border-detail
                v-show="activeBorder === 'borderBottom'"
                :border-style="borderBottomStyle"
                :border-width="borderBottomWidth"
                :border-color="borderBottomColor"
                @borderStyleChange="handleBorderStyleChange('borderBottom', $event)"
                @borderWidthChange="handleBorderWidthChange('borderBottom', $event)"
                @borderColorChange="handleBorderColorChange('borderBottom', $event)"
            ></border-detail>
            <border-detail
                v-show="activeBorder === 'borderLeft'"
                :border-style="borderLeftStyle"
                :border-width="borderLeftWidth"
                :border-color="borderLeftColor"
                @borderStyleChange="handleBorderStyleChange('borderLeft', $event)"
                @borderWidthChange="handleBorderWidthChange('borderLeft', $event)"
                @borderColorChange="handleBorderColorChange('borderLeft', $event)"
            ></border-detail>
        </div>
    </style-layout>
</template>

<script>
    import StyleLayout from '../layout/index'
    import AppendNumberInput from '@/components/modifier/append-number-input'
    import BorderDetail from '@/components/modifier/border-detail'
    import { splitValueAndUnit, computeIsDifferent } from '@/common/util'

    export default {
        components: {
            StyleLayout,
            AppendNumberInput,
            BorderDetail
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
                // 两种模式 true：一键修改四个 border，false：分别修改四个border
                isAllBorder: true,
                isDifferent: false,
                borderRadius: splitValueAndUnit('value', this.value.borderRadius) || 0,
                borderTopLeftRadius: splitValueAndUnit('value', this.value.borderTopLeftRadius),
                borderTopRightRadius: splitValueAndUnit('value', this.value.borderTopRightRadius),
                borderBottomRightRadius: splitValueAndUnit('value', this.value.borderBottomRightRadius),
                borderBottomLeftRadius: splitValueAndUnit('value', this.value.borderBottomLeftRadius),
                borderWidth: splitValueAndUnit('value', this.value.borderWidth),
                borderTopWidth: splitValueAndUnit('value', this.value.borderTopWidth),
                borderRightWidth: splitValueAndUnit('value', this.value.borderRightWidth),
                borderBottomWidth: splitValueAndUnit('value', this.value.borderBottomWidth),
                borderLeftWidth: splitValueAndUnit('value', this.value.borderLeftWidth),
                // 当前修改的边框： border、borderTop、borderRight、borderBottom、borderLeft
                activeBorder: 'border',
                borderColor: this.value.borderColor || '',
                borderTopColor: this.value.borderTopColor || '',
                borderRightColor: this.value.borderRightColor || '',
                borderBottomColor: this.value.borderBottomColor || '',
                borderLeftColor: this.value.borderLeftColor || '',
                borderStyle: this.value.borderStyle || '',
                borderTopStyle: this.value.borderTopStyle || '',
                borderRightStyle: this.value.borderRightStyle || '',
                borderBottomStyle: this.value.borderBottomStyle || '',
                borderLeftStyle: this.value.borderLeftStyle || ''
            }
        },
        watch: {
            borderRadius (val) {
                this.borderTopLeftRadius = this.borderTopRightRadius = this.borderBottomRightRadius = this.borderBottomLeftRadius = val
                this.change('borderRadius', val + 'px')
            },
            borderTopLeftRadius (val) {
                this.changeSeparateBorderRadius('borderTopLeftRadius', val)
            },
            borderTopRightRadius (val) {
                this.changeSeparateBorderRadius('borderTopRightRadius', val)
            },
            borderBottomRightRadius (val) {
                this.changeSeparateBorderRadius('borderBottomRightRadius', val)
            },
            borderBottomLeftRadius (val) {
                this.changeSeparateBorderRadius('borderBottomLeftRadius', val)
            }
        },
        mounted () {
            if (this.borderTopLeftRadius || this.borderTopRightRadius || this.borderBottomRightRadius || this.borderBottomLeftRadius) {
                // 分别修改四个 border 模式
                this.isAllBorder = false
            } else if (this.borderRadius) {
                // 一键修改时初始化四个方向的值
                this.borderTopLeftRadius = this.borderTopRightRadius = this.borderBottomRightRadius = this.borderBottomLeftRadius = this.borderRadius
            }
        },
        methods: {
            changeSeparateBorderRadius (key, val) {
                const newVal = val === '' ? '' : val + 'px'
                this.change(key, newVal)
                if (!this.isAllBorder) {
                    this.isDifferent = computeIsDifferent([this.borderTopLeftRadius, this.borderTopRightRadius, this.borderBottomRightRadius, this.borderBottomLeftRadius])
                }
            },
            handleBorderStyleChange (pattern, val) {
                const key = pattern + 'Style'
                this[key] = val
                this.change(key, val)
                if (pattern === 'border') {
                    this.clearSeparateData('Style')
                }
            },
            handleBorderWidthChange (pattern, val) {
                const key = pattern + 'Width'
                this[key] = val
                const newVal = val === '' ? '' : val + 'px'
                this.change(key, newVal)
                if (pattern === 'border') {
                    this.clearSeparateData('Width')
                }
            },
            handleBorderColorChange (pattern, val) {
                const key = pattern + 'Color'
                this[key] = val
                this.change(key, val)
                if (pattern === 'border') {
                    this.clearSeparateData('Color')
                }
            },
            // 修改 border 简写 css 时，清除其他四个方向的 css
            clearSeparateData (type) {
                const keys = ['borderTop' + type, 'borderRight' + type, 'borderBottom' + type, 'borderLeft' + type]
                keys.forEach(key => {
                    this[key] = ''
                    this.change(key, '')
                })
            }
        }
    }
</script>

<style lang="postcss">
    .radius-container {
        display: flex;
        .radius-label {
            width: 42px;
            line-height: 32px;
        }
        .radius-content {
            display: flex;
            flex-flow: column;
            .all-border-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 234px;
                height: 32px;
                .icon-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 43px;
                }
                .border-radius-slider {
                    width: 92px;
                }
            }
            .single-border-container {
                padding-left: 23px;
                .row-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 32px;
                    margin-top: 8px;
                    .single-border {
                        position: relative;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 94px;
                        .img-cover {
                            position: absolute;
                            top: 6px;
                            left: 0;
                            width: 20px;
                            height: 20px;
                            border-radius: 2px;
                            background: rgba(58, 132, 255, .16);
                        }
                    }
                }
            }
            .all-border-container .bk-drag-icon, .single-border-container .bk-drag-icon {
                font-size: 20px;
                color: #979BA5;
                &.active {
                    color: #3A84FF;
                }
            }
            .all-border-container .bk-drag-icon {
                cursor: pointer;
            }
        }
    }
    .property-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .border-icons-container {
            width: 72px;
            .icons-box {
                display: flex;
                align-items: center;
                height: 30px;
                .border-icon-container {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    .img-cover {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 20px;
                        height: 20px;
                        border-radius: 2px;
                        background: rgba(58, 132, 255, .2);
                    }
                }
            }
            .top-icons, .bottom-icons {
                justify-content: center;
            }
            .middle-icons {
                justify-content: space-between;
            }
        }
    }
</style>
