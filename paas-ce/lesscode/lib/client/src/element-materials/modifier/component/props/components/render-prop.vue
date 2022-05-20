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
    <div class="modifier-prop">
        <variable-select
            :show="!isReadOnly && variableSelectEnable"
            :options="variableSelectOptions"
            :value="formData"
            @change="handleVariableFormatChange">
            <template v-slot:title>
                <div class="prop-name">
                    <span
                        :class="{ label: describe.tips }"
                        v-bk-tooltips="introTips">
                        {{ displayName }}
                    </span>
                </div>
            </template>
            <bk-radio-group
                v-if="renderComponentList.length > 1"
                :value="selectValueType"
                style="margin-bottom: 10px;"
                @change="handleValueTypeChange">
                <bk-radio-button
                    v-for="item in renderComponentList"
                    :key="item.type"
                    :value="item.type">
                    {{ item.type | valueTypeTextFormat }}
                </bk-radio-button>
            </bk-radio-group>
            <div class="prop-action">
                <template v-for="(renderCom, index) in renderComponentList">
                    <template v-if="selectValueType === renderCom.type || selectValueType === renderCom.valueType">
                        <component
                            :is="renderCom.component"
                            :name="name"
                            :type="renderCom.type"
                            :describe="describe"
                            :default-value="propTypeValueMemo[selectValueType].val"
                            :payload="propTypeValueMemo[selectValueType].payload"
                            :remote-validate="describe.remoteValidate"
                            :key="`${renderCom.type}_${index}`"
                            :readonly="isReadOnly"
                            :change="handleCodeChange" />
                    </template>
                </template>
            </div>
        </variable-select>
    </div>
</template>
<script>
    import { transformTipsWidth } from '@/common/util'
    import safeStringify from '@/common/json-safe-stringify'
    import variableSelect from '@/components/variable/variable-select'

    import {
        getDefaultValueByType,
        isEmpty,
        toPascal
    } from '../../utils'

    import TypeSize from './strategy/size'
    import TypeRemote from './strategy/remote'
    import TypeFunction from './strategy/function'
    import TypeBoolean from './strategy/boolean'
    import TypeColumn from './strategy/column'
    import TypeNumber from './strategy/number'
    import TypeFloat from './strategy/float'
    import TypeSelect from './strategy/select'
    import TypeString from './strategy/string'
    import TypeTextarea from './strategy/textarea'
    import TypeText from './strategy/text'
    import TypeTableColumn from './strategy/table-column'
    import TypeCollapse from './strategy/collapse.vue'
    import TypeJson from './strategy/json-view.vue'
    import TypeSlot from './strategy/slot.vue'
    import TypeFreeLayoutItem from './strategy/free-layout-item.vue'
    import TypeSlotWrapper from './strategy/slot-wrapper'
    import TypeIcon from './strategy/icon'
    import TypeVanIcon from './strategy/van-icon'
    import TypeColor from './strategy/color'
    import TypleElProps from './strategy/el-props'
    import TypeDataSource from './strategy/data-source.vue'
    import TypeTableDataSource from './strategy/table-data-source.vue'

    const getRealValue = (type, target) => {
        if (type === 'object') {
            const FunctionCon = Function
            return (new FunctionCon(`return ${safeStringify(target)}`))()
        }
        return target
    }

    export default {
        name: 'render-prop-modifier',
        components: {
            variableSelect
        },
        filters: {
            valueTypeTextFormat (valueType) {
                const textMap = {
                    'areatext': '文本',
                    'number': '数字',
                    'object': '对象',
                    'string': '字符串',
                    'array': '数组',
                    'remote': '远程函数',
                    'data-source': '数据源',
                    'table-data-source': '数据源'
                }
                return textMap[valueType] || toPascal(valueType)
            }
        },
        props: {
            componentType: String,
            // prop 的 name
            name: {
                type: String,
                required: true
            },
            // prop 的 配置
            describe: {
                type: Object,
                required: true
            },
            // 用户的配置的值
            lastValue: {
                type: [Number, String, Boolean, Object, Array],
                default: () => ({})
            }
        },
        data () {
            return {
                selectValueType: '',
                formData: {}
            }
        },
        computed: {
            /**
             * @desc format 为 value 时 valueType 编辑组件
             * @returns { Object }
             */
            renderComponentList () {
                const config = this.describe
                const comMap = {
                    'areatext': TypeTextarea,
                    'boolean': TypeBoolean,
                    'size': TypeSize,
                    'column': TypeColumn,
                    'number': TypeNumber,
                    'float': TypeFloat,
                    'select': TypeSelect,
                    'string': TypeString,
                    'text': TypeText,
                    'table-column': TypeTableColumn,
                    'collapse': TypeCollapse,
                    'remote': TypeRemote,
                    'json': TypeJson,
                    'slot-html': TypeSlot,
                    'free-layout-item': TypeFreeLayoutItem,
                    'icon': TypeIcon,
                    'van-icon': TypeVanIcon,
                    'color': TypeColor,
                    'step': TypeSlotWrapper,
                    'function': TypeFunction,
                    'el-props': TypleElProps,
                    'data-source': TypeDataSource,
                    'table-data-source': TypeTableDataSource
                }

                const typeMap = {
                    'array': 'json',
                    'boolean': 'boolean',
                    'column': 'column',
                    'size': 'size',
                    'number': 'number',
                    'float': 'float',
                    'object': 'json',
                    'string': 'string',
                    'text': 'text',
                    'paragraph': 'text',
                    'tab-panel': 'tab-panel',
                    'radio': 'radio',
                    'radio-button': 'radio-button',
                    'checkbox': 'checkbox',
                    'table-column': 'table-column',
                    'option': 'option',
                    'collapse': 'collapse',
                    'remote': 'remote',
                    'json': 'json',
                    'html': 'slot-html',
                    'free-layout-item': 'free-layout-item',
                    'bread-crumb': 'bread-crumb',
                    'icon': 'icon',
                    'van-icon': 'van-icon',
                    'form-item': 'form-item',
                    'color': 'color',
                    'step': 'step',
                    'function': 'function',
                    'el-step': 'el-step',
                    'timeline': 'timeline',
                    'carousel': 'carousel',
                    'el-radio': 'el-radio',
                    'el-checkbox': 'el-checkbox',
                    'el-props': 'el-props',
                    'data-source': 'data-source',
                    'table-data-source': 'table-data-source'
                }
                const valueMap = {
                    'text': 'string',
                    'paragraph': 'string',
                    'html': 'string',
                    'json': 'object',
                    'icon': 'string',
                    'van-icon': 'string',
                    'float': 'number',
                    'object': 'hidden'
                }

                let realType = config.type
                // 属性type支持配置数组，内部逻辑全部按数组处理
                if (typeof config.type === 'string') {
                    realType = [config.type]
                }

                return realType.reduce((res, propType) => {
                    if (typeMap.hasOwnProperty(propType)) {
                        const renderType = Array.isArray(config.options) ? 'select' : typeMap[propType]
                        res.push({
                            type: propType,
                            component: comMap[renderType],
                            valueType: valueMap[propType] || propType
                        })
                    }
                    return res
                }, [])
            },
            /**
             * @desc prop name
             * @returns { String }
             */
            displayName () {
                if (this.renderComponentList.length > 1) {
                    return this.name
                }
                const [editCom] = this.renderComponentList
                return `${this.name}(${toPascal(editCom.type)})`
            },
            /**
             * @desc 不支持的变量切换类型(variable、expression)
             * @returns { Array }
             */
            disableVariableType () {
                return this.describe.disableVariableType ? this.describe.disableVariableType : []
            },
            /**
             * @desc prop 描述 tips
             * @returns { Object }
             */
            introTips () {
                const tip = transformTipsWidth(this.describe.tips)
                const disabled = !tip
                return typeof tip === 'string' ? {
                    disabled,
                    content: tip,
                    interactive: false
                } : Object.assign(tip, { disabled, interactive: false })
            },
            /**
             * @desc type 支持 remote 类型的不支持配置变量
             * @returns { Boolean }
             */
            variableSelectEnable () {
                return !this.renderComponentList.some(com => com.type === 'remote')
            }
        },
        watch: {
            lastValue: {
                handler (lastValue) {
                    if (this.isInnerChange) {
                        this.isInnerChange = false
                        return
                    }
                    setTimeout(() => {
                        if (lastValue && lastValue.valueType) {
                            // fix: 旧数据存在 valueType 是数组的情况
                            const lastValueType = Array.isArray(lastValue.valueType)
                                ? lastValue.valueType[0]
                                : lastValue.valueType
                            // fix: 错误数据转换，表达式类型的 format 包存成了 value
                            const isFixedComputeFormat = lastValue.format === 'value'
                                && /=/.test(lastValue.code)
                                && !/</.test(lastValue.code)
                            this.formData = Object.freeze({
                                ...this.formData,
                                format: isFixedComputeFormat ? 'expression' : lastValue.format,
                                code: lastValue.code,
                                valueType: lastValueType
                            })
                
                            this.propTypeValueMemo[this.formData.valueType] = {
                                val: lastValue.code,
                                payload: lastValue.payload || {}
                            }
                        }
                        this.selectValueType = this.formData.valueType
                    })
                },
                immediate: true
            }
        },
        created () {
            this.isReadOnly = this.componentType === 'widget-form' && this.name === 'model'
            const {
                type,
                val
            } = this.describe
            
            const defaultValue = val !== undefined ? val : getDefaultValueByType(type)
            const valueTypeInclude = Array.isArray(type) ? type : [type]

            // 构造 variable-select 的配置
            this.variableSelectOptions = {
                type: 'v-bind',
                prop: this.name,
                format: 'value',
                formatInclude: ['value', 'variable', 'expression'],
                code: defaultValue,
                valueTypeInclude: valueTypeInclude
            }

            // prop 的初始值
            this.formData = Object.freeze({
                format: 'value',
                code: defaultValue,
                valueType: valueTypeInclude[0],
                renderValue: defaultValue,
                payload: this.lastValue.payload || {}
            })
            
            // 编辑状态缓存
            this.propTypeValueMemo = {
                [this.formData.valueType]: {
                    val: this.formData.renderValue,
                    payload: this.formData.payload
                }
            }
        },
        methods: {
            /**
             * @desc 同步更新用户操作
             */
            triggerChange () {
                this.isInnerChange = true
                // 缓存用户本地编辑值
                this.propTypeValueMemo[this.formData.valueType] = {
                    val: this.formData.code || this.formData.renderValue,
                    payload: this.formData.payload
                }

                this.$emit('on-change', this.name, {
                    ...this.formData,
                    modifiers: this.describe.modifiers || []
                })
            },
            /**
             * @desc 变量切换
             * @param { Object } variableSelectData
             */
            handleVariableFormatChange (variableSelectData) {
                const {
                    format,
                    code,
                    renderValue
                } = variableSelectData
                this.formData = Object.freeze({
                    ...this.formData,
                    format,
                    code,
                    renderValue
                })
                this.triggerChange()
            },
            /**
             * @desc prop 值得类型切换
             * @param { String } valueType
             */
            handleValueTypeChange (valueType) {
                this.selectValueType = valueType
                let code = null
                let payload = {}
                if (this.propTypeValueMemo.hasOwnProperty(valueType)) {
                    code = this.propTypeValueMemo[valueType].val
                    payload = this.propTypeValueMemo[valueType].payload
                } else if ([
                    'remote',
                    'data-source',
                    'table-data-source'
                ].includes(valueType)) {
                    // fix:
                    // 远程函数、数据源类型在没有获取数据前使用配置文件设置的默认值
                    code = this.describe.val
                } else {
                    // 切换值类型时，通过类型获取默认值
                    code = getDefaultValueByType(valueType)
                }
                
                this.formData = Object.freeze({
                    ...this.formData,
                    code,
                    payload,
                    valueType,
                    renderValue: code
                })
                
                this.triggerChange()
            },
            /**
             * @desc 更新 prop value 的配置
             * @param { String } name
             * @param { Any } value
             * @param { String } type
             * @param { Object } payload prop 配置附带的额外信息(eq: type 为 remote 时接口函数相关的配置)
             */
            handleCodeChange (name, value, type, payload = {}) {
                try {
                    let code = null
                    let renderValue

                    const val = getRealValue(type, value)

                    if (this.formData.valueType === 'remote') {
                        // 配置的是远程函数、数据源
                        // code 此时无效，设置为 null
                        // api 返回数据不为空时在画布编辑区才应用 api 数据
                        if (!isEmpty(val)) {
                            renderValue = val
                        }
                    } else {
                        code = val
                        renderValue = val
                    }
                    
                    this.formData = Object.freeze({
                        ...this.formData,
                        code,
                        payload,
                        renderValue
                    })
                    this.triggerChange()
                } catch {
                    this.$bkMessage({
                        theme: 'error',
                        message: `属性【${name}】的值设置不正确`
                    })
                }
            }
        }
    }
</script>
<style lang="postcss">
    .item-ghost {
        border: 1px dashed #3a84ff;
        background: #fff !important;
        color: #fff !important;
        height: 32px;
        .bk-form-control, .bk-drag-icon, .bk-icon, .label {
            display: none;
        }
    }
    .block-item-ghost {
        border: 1px dashed #3a84ff;
        background: #fff !important;
        color: #fff !important;
        height: 100px;
        .bk-form-control, .bk-icon, .bk-drag-icon, .label, .bk-form-radio, .bk-select, .bk-form-checkbox {
            display: none;
        }
    }
    .option-col-operate {
        position: absolute;
        right: 12px;
        color: #979BA5;
        display: none;
        font-size: 24px;
        .option-col-del {
            cursor: pointer;
        }
        .option-col-drag {
            cursor: move;
            margin-right: -10px;
            padding-left: 220px;
        }
    }
    .modifier-prop {
        margin: 0 10px;
        .prop-name {
            display: flex;
            align-items: center;
            height: 32px;
            font-size: 14px;
            color: #63656E;
            word-break: keep-all;
            max-width: calc(100% - 80px);
            .label {
                border-bottom: 1px dashed #979ba5;
                cursor: pointer;
            }
            span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            /* .icon-info-circle {
                padding: 4px;
                color: #979BA5;
                font-size: 16px;
                cursor: pointer;
            } */
        }
        .prop-action {
            width: 100%;
        }
        &.slots {
            border-top: 1px solid #ccc;
            margin-top: 20px;
        }
    }
</style>
