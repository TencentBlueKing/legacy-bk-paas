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
        <template v-if="formCom.length < 2">
            <div class="prop-name" :class="classes" v-bk-tooltips="{ disabled: name === 'slots' || !formCom[0].tips, content: formCom[0].tips }">
                {{ name }}（{{ formCom[0].typeName | propTypeFormat }}）
            </div>
            <div class="prop-action">
                <template v-for="(renderCom, index) in formCom">
                    <component
                        :is="renderCom.typeCom"
                        :describe="describe"
                        :type="renderCom.typeName"
                        :name="name"
                        :default-value="defaultValue"
                        :key="renderCom.typeName + index"
                        :change="handleUpdate" />
                </template>
            </div>
        </template>
        <template v-else>
            <div class="prop-name" :class="classes" v-bk-tooltips="{ disabled: name === 'slots' || !formCom[0].tips, content: formCom[0].tips }">
                {{ name }}
            </div>
            <bk-radio-group v-model="mutlTypeSelected" style="margin-bottom: 10px;">
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
    </div>
</template>
<script>
    import tips from './strategy/attrInstructTips'
    import TypeRemote from './strategy/remote'
    import TypeBoolean from './strategy/boolean'
    import TypeColumn from './strategy/column'
    import TypeNumber from './strategy/number'
    import TypeSelect from './strategy/select'
    import TypeString from './strategy/string'
    import TypeTextarea from './strategy/textarea'
    import TypeText from './strategy/text'
    import TypeTabPanel from './strategy/tab-panel'
    import TypeRadio from './strategy/radio'
    import TypeCheckbox from './strategy/checkbox'
    import TypeTableColumn from './strategy/table-column'
    import TypeOption from './strategy/option.vue'
    import TypeCollapse from './strategy/collapse.vue'

    const getRealValue = (type, target) => {
        if (type === 'array' || type === 'object') {
            const FunctionCon = Function
            return (new FunctionCon(`return ${target}`))()
        }
        return target
    }

    export default {
        name: 'render-prop-modifier',
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
            }
        },
        data () {
            return {
                mutlTypeSelected: ''
            }
        },
        computed: {
            formCom () {
                const config = this.describe
                const comMap = {
                    'areatext': TypeTextarea,
                    'boolean': TypeBoolean,
                    'column': TypeColumn,
                    'number': TypeNumber,
                    'select': TypeSelect,
                    'string': TypeString,
                    'text': TypeText,
                    'tab-panel': TypeTabPanel,
                    'radio': TypeRadio,
                    'checkbox': TypeCheckbox,
                    'table-column': TypeTableColumn,
                    'option': TypeOption,
                    'collapse': TypeCollapse,
                    'remote': TypeRemote
                }

                let realType = config.type

                const typeMap = {
                    'array': 'areatext',
                    'boolean': 'boolean',
                    'column': 'column',
                    'number': 'number',
                    'object': 'areatext',
                    'string': 'string',
                    'text': 'text',
                    'tab-panel': 'tab-panel',
                    'radio': 'radio',
                    'checkbox': 'checkbox',
                    'table-column': 'table-column',
                    'option': 'option',
                    'collapse': 'collapse',
                    'remote': 'remote'
                }
                if (typeof config.type === 'string') {
                    realType = [config.type]
                }
                return realType.reduce((res, propType) => {
                    if (typeMap.hasOwnProperty(propType)) {
                        const renderType = Array.isArray(config.options) ? 'select' : typeMap[propType]
                        res.push({
                            typeName: propType,
                            typeCom: comMap[renderType],
                            tips: tips[this.name]
                        })
                    }
                    return res
                }, [])
            },
            defaultValue () {
                const lastValue = this.lastValue.val
                if (lastValue !== undefined && lastValue !== '') {
                    return lastValue
                }
                if (this.describe.hasOwnProperty('val')) {
                    return this.describe.val
                }
                return ''
            },
            defaultPayload () {
                return this.lastValue.payload || {}
            },
            classes () {
                return {
                    slots: this.name === 'slots'
                }
            }
        },
        created () {
            if (Array.isArray(this.describe.type)) {
                this.mutlTypeSelected = this.describe.type[0]
            } else {
                this.mutlTypeSelected = this.describe.type
            }
            if (!this.lastValue || !this.lastValue.type) {
                return
            }
            if (Array.isArray(this.lastValue.type)) {
                this.mutlTypeSelected = this.lastValue.type[0]
            } else {
                this.mutlTypeSelected = this.lastValue.type
            }
        },
        methods: {
            handleUpdate (name, value, type, payload = {}) {
                try {
                    const args = {
                        type,
                        val: getRealValue(type, value),
                        payload
                    }
                    if (name === 'slots') {
                        args.name = type
                    }
                    this.$emit('on-change', name, args)
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
    .modifier-prop {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        margin: 10px 10px 0;
        .prop-name {
            display: flex;
            align-items: center;
            height: 32px;
            font-size: 14px;
            color: #63656E;
            word-break: keep-all;
            &.slots {
                width: 100%;
                height: 1px;
                margin: 10px 0;
                font-size: 0;
                background: #ccc;
            }
        }
        .prop-action {
            width: 100%;
        }
    }
</style>
