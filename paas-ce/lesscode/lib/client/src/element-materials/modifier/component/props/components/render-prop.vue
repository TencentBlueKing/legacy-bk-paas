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
    <div :class="classes">
        <variable-select :show="!namedStrategy && !remoteStrategy"
            v-if="describe.type !== 'hidden'"
            :value="defaultVariable.val"
            :val-type="defaultVariable.valType"
            :available-types="formCom.map(x => x.valueType)"
            :disable-variable-type="disableVariableType"
            @change="changeVariable">
            <template v-slot:title>
                <div class="prop-name" v-if="describe.type !== 'free-layout-item' && !namedStrategy">
                    <span :class="{ label: name !== 'slots' && describe.tips }" v-bk-tooltips="computedTips">{{ defaultName }}</span>
                </div>
            </template>
            <template v-if="formCom.length < 2">
                <div class="prop-action">
                    <template v-for="(renderCom, index) in formCom">
                        <component
                            :is="renderCom.typeCom"
                            :describe="describe"
                            :type="renderCom.typeName"
                            :name="name"
                            :default-value="defaultValue"
                            :key="renderCom.typeName + index"
                            :payload="defaultPayload"
                            :remote-validate="describe.remoteValidate"
                            :change="handleUpdate" />
                    </template>
                </div>
            </template>
            <template v-else>
                <bk-radio-group :value="mutlTypeSelected" style="margin-bottom: 10px;" @change="changePropType">
                    <bk-radio-button
                        v-for="item in formCom"
                        :key="item.typeName"
                        :value="item.typeName">
                        {{ item.typeName | propTypeFormat }}
                    </bk-radio-button>
                </bk-radio-group>
                <div class="prop-action">
                    <template v-for="(renderCom, index) in formCom">
                        <template v-if="mutlTypeSelected === renderCom.typeName">
                            <component
                                :is="renderCom.typeCom"
                                :describe="describe"
                                :key="renderCom.typeName + index"
                                :type="renderCom.typeName"
                                :name="name"
                                :payload="defaultPayload"
                                :default-value="defaultValue"
                                :remote-validate="describe.remoteValidate"
                                :change="handleUpdate" />
                        </template>
                    </template>
                </div>
            </template>
        </variable-select>
    </div>
</template>
<script>
    import variableSelect from '@/components/variable/variable-select'
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
    import TypeRadioButton from './strategy/radio-button'
    import TypeTableColumn from './strategy/table-column'
    import TypeCollapse from './strategy/collapse.vue'
    import TypeJson from './strategy/json-view.vue'
    import TypeSlot from './strategy/slot.vue'
    import TypeFreeLayoutItem from './strategy/free-layout-item.vue'
    import TypeSlotWrapper from './strategy/slot-wrapper'
    import TypeIcon from './strategy/icon'
    import TypeColor from './strategy/color'
    import TypleElProps from './strategy/el-props'

    import { transformTipsWidth } from '@/common/util'
    import safeStringify from '@/common/json-safe-stringify'

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
            propTypeFormat (propType) {
                return `${propType.substring(0, 1).toUpperCase()}${propType.substring(1).toLowerCase()}`
            }
        },
        props: {
            name: {
                type: String,
                required: true
            },
            describe: {
                type: Object,
                required: true
            },
            lastValue: {
                type: [Number, String, Boolean, Object, Array],
                default: () => ({})
            },
            lastDirectives: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                mutlTypeSelected: '',
                mutlTypeVal: {}
            }
        },
        computed: {
            disableVariableType () {
                return this.describe.disableVariableType ? this.describe.disableVariableType : []
            },
            computedTips () {
                const tip = transformTipsWidth(this.describe.tips)
                const disabled = name === 'slots' || !tip
                return typeof tip === 'string' ? {
                    disabled,
                    content: tip,
                    interactive: false
                } : Object.assign(tip, { disabled, interactive: false })
                // return transformTipsWidth(this.describe.tips)
            },
            formCom () {
                const config = this.describe
                const comMap = {
                    'areatext': TypeTextarea,
                    'boolean': TypeBoolean,
                    'column': TypeColumn,
                    'number': TypeNumber,
                    'float': TypeFloat,
                    'select': TypeSelect,
                    'string': TypeString,
                    'text': TypeText,
                    'tab-panel': TypeSlotWrapper,
                    'radio': TypeSlotWrapper,
                    'radio-button': TypeRadioButton,
                    'checkbox': TypeSlotWrapper,
                    'table-column': TypeTableColumn,
                    'option': TypeSlotWrapper,
                    'collapse': TypeCollapse,
                    'remote': TypeRemote,
                    'json': TypeJson,
                    'slot-html': TypeSlot,
                    'free-layout-item': TypeFreeLayoutItem,
                    'bread-crumb': TypeSlotWrapper,
                    'icon': TypeIcon,
                    'color': TypeColor,
                    'step': TypeSlotWrapper,
                    'function': TypeFunction,
                    'el-step': TypeSlotWrapper,
                    'timeline': TypeSlotWrapper,
                    'carousel': TypeSlotWrapper,
                    'el-radio': TypeSlotWrapper,
                    'el-checkbox': TypeSlotWrapper,
                    'el-props': TypleElProps
                }

                let realType = config.type

                const typeMap = {
                    'array': 'json',
                    'boolean': 'boolean',
                    'column': 'column',
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
                // 属性type支持配置数组，内部逻辑全部按数组处理
                if (typeof config.type === 'string') {
                    realType = [config.type]
                }

                return realType.reduce((res, propType) => {
                    if (typeMap.hasOwnProperty(propType)) {
                        const renderType = Array.isArray(config.options) ? 'select' : typeMap[propType]
                        res.push({
                            typeName: propType,
                            typeCom: comMap[renderType],
                            valueType: valueMap[propType] || propType
                        })
                    }
                    return res
                }, [])
            },
            defaultValue () {
                const typeVal = this.mutlTypeVal[this.mutlTypeSelected] || {}
                return typeVal.hasOwnProperty('val') ? typeVal.val : ''
            },
            defaultPayload () {
                return this.mutlTypeVal[this.mutlTypeSelected].payload || this.lastValue.payload || {}
            },
            defaultVariable () {
                let data
                if (this.name === 'slots') {
                    const payload = this.defaultPayload || {}
                    data = payload.variableData
                } else {
                    data = (this.lastDirectives || []).find((item) => {
                        return (item.type + item.prop) === ('v-bind' + this.name)
                    })
                }
                return data || { val: '', valType: 'value' }
            },
            defaultName () {
                const { 0: { typeName, typeCom }, length } = this.formCom
                const showDisplayType = length < 2
                const displayType = showDisplayType ? `(${typeName.substring(0, 1).toUpperCase()}${typeName.substring(1).toLowerCase()})` : ''
                const displayName = typeCom === TypeText ? '文本配置' : this.name
                return displayName + displayType
            },
            classes () {
                return {
                    slots: this.name === 'slots',
                    'modifier-prop': true
                }
            },
            namedStrategy () {
                return ['steps', 'slots'].includes(this.name) && ![TypeSlot, TypeText].includes(this.formCom[0].typeCom)
            },
            remoteStrategy () {
                return this.formCom.some(com => com.typeName === 'remote')
            }
        },
        created () {
            if (Array.isArray(this.describe.type)) {
                this.mutlTypeSelected = this.describe.type[0]
            } else {
                this.mutlTypeSelected = this.describe.type
            }
            this.$set(this.mutlTypeVal, this.mutlTypeSelected, JSON.parse(safeStringify(this.describe)))
            if (!this.lastValue || !this.lastValue.type) {
                return
            }
            if (Array.isArray(this.lastValue.type)) {
                this.mutlTypeSelected = this.lastValue.type[0]
            } else {
                this.mutlTypeSelected = this.lastValue.type
            }
            this.$set(this.mutlTypeVal, this.mutlTypeSelected, JSON.parse(safeStringify(this.lastValue)))
        },
        methods: {
            handleUpdate (name, value, type, payload = {}) {
                try {
                    const val = getRealValue(type, value)
                    const args = {
                        type,
                        val,
                        payload,
                        attrs: this.describe.attrs || []
                    }
                    if (name === 'slots') {
                        // args.name = type
                        args.name = this.describe.name
                    }
                    this.$emit('on-change', name, args)
                    this.mutlTypeVal[type] = {
                        val,
                        payload: {
                            ...payload
                        }
                    }
                } catch {
                    this.$bkMessage({
                        theme: 'error',
                        message: `属性【${name}】的值设置不正确`
                    })
                }
            },
            batchUpdate (renderData) {
                this.$emit('batch-update', renderData)
            },
            changePropType (type) {
                if (!this.mutlTypeVal.hasOwnProperty(type)) {
                    const typeDefaultValueMap = {
                        'string': '',
                        'array': [],
                        'object': {},
                        'boolean': false,
                        'number': 0,
                        'json': {},
                        'remote': this.mutlTypeVal[this.mutlTypeSelected].val
                    }
                    this.mutlTypeVal[type] = {
                        val: typeDefaultValueMap[type]
                    }
                }
                this.mutlTypeSelected = type
                this.handleUpdate(this.name, this.defaultValue, type, this.defaultPayload)
            },
            changeVariable (variableData) {
                const value = variableData.defaultVal === undefined ? this.describe.val : variableData.defaultVal
                const com = this.formCom.find((com) => (variableData.valueType === com.typeName)) || {}
                const type = com.typeName || this.mutlTypeSelected
                const payload = {}
                if (this.name === 'slots') {
                    payload.variableData = { val: variableData.val, valType: variableData.valType }
                } else {
                    this.updateDirectives(variableData)
                }
                this.handleUpdate(this.name, value, type, payload)
            },
            updateDirectives (variableData) {
                const renderDirectives = JSON.parse(safeStringify(this.lastDirectives || []))
                const index = renderDirectives.findIndex((item) => (item.type + item.prop) === ('v-bind' + this.name))
                const curDirective = renderDirectives[index] || {}
                if (index <= -1) {
                    renderDirectives.push(curDirective)
                }
                const data = { type: 'v-bind', prop: this.name, val: variableData.val, valType: variableData.valType, modifiers: this.describe.modifiers }
                Object.assign(curDirective, data)
                this.batchUpdate({ renderDirectives })
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
