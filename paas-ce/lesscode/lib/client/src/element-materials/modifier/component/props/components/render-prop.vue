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
            :show="variableSelectEnable"
            :value="defaultRelatedVariable.val"
            :val-type="defaultRelatedVariable.valType"
            :available-types="renderComponentList.map(x => x.valueType)"
            :disable-variable-type="disableVariableType"
            @change="handleVariableSelectChange">
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
                @change="handlePropValueTypeChange">
                <bk-radio-button
                    v-for="item in renderComponentList"
                    :key="item.type"
                    :value="item.type">
                    {{ item.type | propTypeFormat }}
                </bk-radio-button>
            </bk-radio-group>
            <div class="prop-action">
                <template v-for="(renderCom, index) in renderComponentList">
                    <template v-if="selectValueType === renderCom.type">
                        <component
                            :is="renderCom.component"
                            :name="name"
                            :type="renderCom.type"
                            :describe="describe"
                            :default-value="propTypeValueMemo[selectValueType].val"
                            :payload="propTypeValueMemo[selectValueType].payload"
                            :remote-validate="describe.remoteValidate"
                            :key="`${renderCom.type}_${index}`"
                            :change="handleUpdate" />
                    </template>
                </template>
            </div>
        </variable-select>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { transformTipsWidth } from '@/common/util'
    import safeStringify from '@/common/json-safe-stringify'
    import variableSelect from '@/components/variable/variable-select'

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
    import TypeColor from './strategy/color'
    import TypleElProps from './strategy/el-props'

    const getRealValue = (type, target) => {
        if (type === 'object') {
            const FunctionCon = Function
            return (new FunctionCon(`return ${safeStringify(target)}`))()
        }
        return target
    }

    const getDefaultValueWithType = (() => {
        const typeValueMap = {
            'string': '',
            'array': [],
            'object': {},
            'boolean': false,
            'number': 0,
            'json': {}
        }
        return type => {
            if (typeValueMap.hasOwnProperty(type)) {
                return typeValueMap[type]
            }
            return ''
        }
    })()

    const propTypeFormat = type => `${type.substring(0, 1).toUpperCase()}${type.substring(1).toLowerCase()}`

    export default {
        name: 'render-prop-modifier',
        components: {
            variableSelect
        },
        filters: {
            propTypeFormat (propType) {
                return propTypeFormat(propType)
            }
        },
        props: {
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
            },
            // 组件的执行配置
            lastDirectives: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                selectValueType: ''
            }
        },
        computed: {
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
                    'color': TypeColor,
                    'step': TypeSlotWrapper,
                    'function': TypeFunction,
                    'el-props': TypleElProps
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
                    'form-item': 'form-item',
                    'color': 'color',
                    'step': 'step',
                    'function': 'function',
                    'el-step': 'el-step',
                    'timeline': 'timeline',
                    'carousel': 'carousel',
                    'el-radio': 'el-radio',
                    'el-checkbox': 'el-checkbox',
                    'el-props': 'el-props'
                }
                const valueMap = {
                    'text': 'string',
                    'paragraph': 'string',
                    'html': 'string',
                    'json': 'object',
                    'icon': 'string',
                    'float': 'number'
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
                return `${this.name}(${propTypeFormat(editCom.type)})`
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
             * @desc 从 renderDirectives 中解析 prop 关联的变量
             * @returns { Object }
             */
            defaultRelatedVariable () {
                const relateDirective = this.lastDirectives.find(({ type, prop }) => `${type}${prop}` === `v-bind${this.name}`)
                
                if (relateDirective) {
                    return relateDirective
                }
                    
                return {
                    val: '',
                    valType: 'value'
                }
            },
            /**
             * @desc type 支持 remote 类型的不支持配置变量
             * @returns { Boolean }
             */
            variableSelectEnable () {
                return !this.renderComponentList.some(com => com.type === 'remote')
            }
        },
        created () {
            // 记录每个 prop type 的用户编辑值
            this.propTypeValueMemo = {}
            
            if (this.lastValue && this.lastValue.type) {
                // 用户配置过该 prop ，使用用户的配置项（优先级最高）
                this.selectValueType = this.lastValue.type
                this.propTypeValueMemo[this.selectValueType] = {
                    val: this.lastValue.val,
                    payload: this.lastValue.payload || {}
                }
            } else {
                // 默认选中第一个属性 type
                const configType = this.describe.type
                this.selectValueType = Array.isArray(configType) ? configType[0] : configType
                this.propTypeValueMemo[this.selectValueType] = {
                    val: this.describe.hasOwnProperty('val') ? this.describe.val : '',
                    payload: this.describe.payload || {}
                }
            }
        },
        methods: {
            /**
             * @desc 更新 prop 的配置
             * @param { String } name
             * @param { Any } value
             * @param { String } type
             * @param { Object } payload prop 配置附带的额外信息(eq: type 为 remote 时接口函数相关的配置)
             */
            handleUpdate (name, value, type, payload = {}) {
                try {
                    const val = getRealValue(type, value)
                    // 缓存用户本地编辑值
                    this.propTypeValueMemo[type] = {
                        val,
                        payload
                    }
                    // 应用 prop 配置
                    this.$emit('on-change', name, {
                        type,
                        val,
                        payload,
                        attrs: this.describe.attrs || []
                    })
                } catch {
                    this.$bkMessage({
                        theme: 'error',
                        message: `属性【${name}】的值设置不正确`
                    })
                }
            },
            /**
             * @desc prop 值得类型切换
             * @param { String } type
             */
            handlePropValueTypeChange (type) {
                this.selectValueType = type
                let defaultValue = null
                let payload = {}
                if (this.propTypeValueMemo.hasOwnProperty(type)) {
                    defaultValue = this.propTypeValueMemo[type].val
                    payload = this.propTypeValueMemo[type].payload
                } else {
                    defaultValue = getDefaultValueWithType(type)
                }
                this.handleUpdate(this.name, defaultValue, type, payload)
            },
            /**
             * @desc 变量切换
             * @param { Object } variableData
             */
            handleVariableSelectChange (variableData) {
                if (variableData.valueType === 'value') {
                    // 为值类型时

                    // prop 值的 type 默认设置为第一个
                    const type = this.renderComponentList[0].type
                    this.handlePropValueTypeChange(type)
                } else {
                    // 为变量、表达式类型时

                    // 转换 prop 的变量配置为 renderDirectives
                    const newDirective = {
                        type: 'v-bind',
                        prop: this.name,
                        val: variableData.val,
                        valType: variableData.valType,
                        modifiers: this.describe.modifiers
                    }
                    const renderDirectives = _.cloneDeep(this.lastDirectives)
                    const index = renderDirectives.findIndex(({ type, prop }) => `${type}${prop}` === `v-bind${this.name}`)
                    if (index > -1) {
                        renderDirectives.splice(index, 1, newDirective)
                    } else {
                        renderDirectives.push(newDirective)
                    }
                    this.$emit('batch-update', {
                        renderDirectives
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
        display: flex;
        align-items: flex-start;
        flex-direction: column;
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
