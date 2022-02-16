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
    <section class="directive-home">
        <template v-if="directiveList.length">
            <h3 class="directive-tip">
                编辑函数时，可以使用 lesscode.指令值，必须通过编辑器自动补全功能选择对应属性指令值，来获取或者修改当前页面中配置了指令的组件属性值
            </h3>
            <bk-form form-type="vertical" :label-width="280">
                <bk-form-item
                    v-for="(directive, index) in directiveList"
                    :key="index"
                    class="directive-item">
                    <variable-select
                        :options="directive"
                        :value="lastDirectiveMap[genDirectiveKey(directive)]"
                        :readonly="isAttachToForm"
                        @change="value => handleVariableFormatChange(directive, value)">
                        <template v-slot:title>
                            <span
                                v-bk-tooltips="{
                                    content: directive.tips && directive.tips(directive),
                                    disabled: !directive.tips,
                                    width: 290
                                }"
                                :class="{
                                    'under-line': directive.tips,
                                    'directive-label': true
                                }">
                                {{ getLabel(directive) }}
                            </span>
                        </template>
                        <bk-input
                            :value="directive.val"
                            @change="(val) => handleCodeChange(directive, val)"
                            clearable />
                    </variable-select>
                </bk-form-item>
            </bk-form>
        </template>
        <!-- <div class="no-prop" v-else>
            该组件暂无指令
        </div> -->
    </section>
</template>

<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import variableSelect from '@/components/variable/variable-select'

    const camelize = str => str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')

    const optionDirectives = [
        {
            type: 'v-if',
            prop: '',
            format: 'variable',
            includesFormat: ['variable', 'expression'], // v-if 支持配置（变量、表达式）
            code: '',
            includesValueType: ['boolean'],
            renderValue: true
        },
        {
            type: 'v-show',
            prop: '',
            format: 'variable',
            includesFormat: ['variable', 'expression'], // v-show 支持配置（变量、表达式）
            code: '',
            includesValueType: ['boolean'],
            renderValue: true
        }
    ]

    export default {
        name: 'modifier-directives',
        components: {
            variableSelect
        },
        data () {
            return {
                isAttachToForm: false,
                directiveList: [],
                lastDirectiveMap: {}
            }
        },
        created () {
            this.currentComponentNode = LC.getActiveNode()
            const {
                componentId,
                material,
                renderDirectives
            } = this.currentComponentNode

            this.id = camelize(componentId)

            // 解析组件 directive 配置
            const propConfig = material.props || {}
            const directiveConfig = material.directives || []
            const directiveList = directiveConfig.reduce((result, directiveConfig) => {
                const {
                    type,
                    prop,
                    valType,
                    val,
                    tips
                } = directiveConfig
                if (propConfig[prop]) {
                    const propConfigType = propConfig[directiveConfig.prop].type
                    // 解析对应 prop 配置的值类型、默认值
                    const includesValueType = Array.isArray(propConfigType) ? propConfigType : [propConfigType]
                    const renderValue = propConfig[directiveConfig.prop].val
                    if (type === 'v-bind') {
                        result.push({
                            type: 'v-bind',
                            prop,
                            format: valType,
                            includesFormat: ['variable'], // v-bind 支持配置（变量）
                            code: val,
                            includesValueType,
                            renderValue,
                            tips: tips
                        })
                    } else if (type === 'v-model') {
                        result.push({
                            type: 'v-model',
                            prop,
                            format: 'variable',
                            includesFormat: ['variable'], // v-bind 支持配置（变量）
                            code: '',
                            includesValueType,
                            renderValue,
                            tips: tips
                        })
                    }
                }
                return result
            }, [])
            // 公共 v-for
            directiveList.unshift(
                {
                    type: 'v-for',
                    prop: '',
                    format: 'variable',
                    includesFormat: ['value', 'variable'], // v-bind 支持配置（值、变量）
                    code: '',
                    includesValueType: ['boolean'],
                    renderValue: 1,
                    tips: (dir) => {
                        return dir.val
                            ? `可以使用 【${this.id}Item】 为当前组件和子组件的指令赋值，当前组件的 v-if 和 v-show 除外`
                            : '可以使用 v-for 指令， 把一个数组转换为一组元素'
                    }
                }
            )
            
            // 目前bk-dialog与bk-sidesslider不支持v-if和v-show
            if (![
                'bk-dialog',
                'bk-sideslider'
            ].includes(this.currentComponentNode.type)) {
                directiveList.push(...optionDirectives)
            }
            this.directiveList = Object.freeze(directiveList)

            // directives 默认配置解析
            const lastDirectiveMap = directiveList.reduce((result, directive) => {
                const {
                    type,
                    prop,
                    format,
                    code,
                    renderValue
                } = directive
                result[this.genDirectiveKey(directive)] = {
                    type,
                    prop,
                    format,
                    code,
                    renderValue
                }
                return result
            }, {})

            // 同步用户配置
            renderDirectives.forEach((directive) => {
                const directiveKey = this.genDirectiveKey(directive)
                if (lastDirectiveMap[directiveKey]) {
                    Object.assign(lastDirectiveMap[directiveKey], {
                        format: directive.format,
                        code: directive.code
                    })
                }
            })
            this.lastDirectiveMap = Object.freeze(lastDirectiveMap)
            
            this.checkAttachToFrom()
        },
        methods: {
            genDirectiveKey (directive) {
                return `${directive.type}${directive.prop ? ':' + directive.prop : ''}`
            },
            /**
             * @desc 检测是否是 widget-form 的子节点
             */
            checkAttachToFrom () {
                this.isAttachToForm = false
                let parentNode = this.currentComponentNode.parentNode
                while (parentNode) {
                    if (parentNode.type === 'widget-form') {
                        this.isAttachToForm = true
                    }
                    parentNode = parentNode.parentNode
                }
            },
            /**
             * @desc directive 显示 label
             * @param { Boolean } Object
             * @returns { String }
             */
            getLabel (directive) {
                const {
                    type,
                    modifiers = [],
                    prop = ''
                } = directive
                let res = ''
                switch (type) {
                    case 'v-model':
                    case 'v-html':
                        res = type
                        break
                    case 'v-for':
                        const tips = directive.val ? `(${this.id}Item)` : ''
                        res = `${type}${tips}`
                        break
                    default:
                        const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
                        res = `${type}${prop ? `:${prop}` : ''}${modifierStr}`
                        break
                }
                return res
            },
            /**
             * @desc directive 值类型切换（值、变量、表达式）
             * @param { Object } directive
             * @param { Object } variableSelectData
             */
            handleVariableFormatChange (directive, variableSelectData) {
                this.lastDirectiveMap = Object.freeze({
                    ...this.lastDirectiveMap,
                    [this.genDirectiveKey(directive)]: {
                        type: directive.type,
                        prop: directive.prop,
                        format: variableSelectData.format,
                        code: variableSelectData.code,
                        renderValue: variableSelectData.renderValue
                    }
                })
                this.triggleUpdate()
            },

            /**
             * @desc directive 是值类型时，值得 value 改变
             * @param { Object } directive
             * @param { String } value
             */
            handleCodeChange (directive, value) {
                const directiveKey = this.genDirectiveKey(directive)
                this.lastDirectiveMap = Object.freeze({
                    ...this.lastDirectiveMap,
                    [directiveKey]: {
                        ...this.lastDirectiveMap[directiveKey],
                        code: value,
                        renderValue: value
                    }
                })
                this.triggleUpdate()
            },

            triggleUpdate: _.throttle(function () {
                this.currentComponentNode.setRenderDirectives(Object.values(this.lastDirectiveMap))
            }, 60)
        }
    }
</script>

<style lang='postcss' scoped>
    .directive-home {
        margin: 0 10px;
    }
    .directive-item.bk-form-item {
        margin: 0 !important;
    }
    .directive-tip {
        margin: 10px 0 0;
        padding: 0;
        font-size: 12px;
        font-weight: normal;
    }
    .directive-label {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: calc(100 - 80px);
    }
    .under-line {
        line-height: 20px;
        border-bottom: 1px dashed #979ba5;
        cursor: pointer;
    }
</style>
