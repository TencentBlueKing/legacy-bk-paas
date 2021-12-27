<template>
    <variable-select
        :data="variableSelectData"
        :value="formData"
        :remote-config="remoteConfig"
        @change="handleVariableSelectChange">
        <template v-slot:title>
            <section class="slot-title-wrapper">
                <span
                    class="slot-name"
                    :class="{
                        'slot-tips': describe.tips
                    }"
                    v-bk-tooltips="computedSlotTip">
                    {{ describe.displayName }}
                    <span v-if="describe.type && describe.type.length <= 1">
                        ({{ formData.valueType | capFirstLetter }})
                    </span>
                </span>
                <template v-if="describe.name && describe.name.length > 1">
                    <span class="slot-label">组件标签</span>
                    <bk-radio-group
                        :value="formData.component"
                        @change="handleSlotComponentChange"
                        class="mb10">
                        <bk-radio-button
                            v-for="itemName in describe.name"
                            :value="itemName"
                            :key="itemName"
                            class="mr10">
                            {{ itemName | capFirstLetter }}
                        </bk-radio-button>
                    </bk-radio-group>
                </template>
            </section>
        </template>
        <template v-if="describe.type && describe.type.length > 1">
            <span class="slot-label">数据类型</span>
            <bk-radio-group
                :value="formData.valueType"
                @change="handleValueTypeChange"
                class="mb10">
                <bk-radio-button
                    :value="type"
                    v-for="type in describe.type"
                    :key="type">
                    {{ type | capFirstLetter }}
                </bk-radio-button>
            </bk-radio-group>
        </template>
        <component
            :is="renderValueComponent"
            :slot-val="slotTypeValueMemo[formData.valueType]"
            :slot-config="describe"
            :change="handleValueChange" />
    </variable-select>
</template>

<script>
    import { transformTipsWidth } from '@/common/util'
    import variableSelect from '@/components/variable/variable-select'

    import slotList from './components/list'
    import slotRemote from './components/remote'
    import slotTable from './components/table'
    import slotHtml from './components/slot-html'
    import slotText from './components/text'
    import slotTextArea from './components/textarea'

    const comMap = {
        list: slotList,
        remote: slotRemote,
        html: slotHtml,
        text: slotText,
        textarea: slotTextArea,
        'table-list': slotTable
    }

    export default {
        components: {
            variableSelect
        },

        filters: {
            capFirstLetter (val = '') {
                return `${val.substring(0, 1).toUpperCase()}${val.substring(1).toLowerCase()}`
            }
        },

        props: {
            name: {
                type: String
            },
            lastValue: {
                type: Object,
                default: () => ({})
            },
            describe: {
                type: Object,
                default: () => ({})
            }
        },

        data () {
            return {
                mutlTypeVal: {},
                formData: {}
            }
        },

        computed: {
            renderValueComponent () {
                return comMap[this.formData.valueType]
            },
            computedSlotTip () {
                const transformTips = transformTipsWidth(this.describe.tips)
                const tips = typeof transformTips === 'string' ? { content: transformTips } : transformTips
                const disabled = !this.describe.tips
                return {
                    ...(tips || {}),
                    disabled
                }
            },
            
            remoteConfig () {
                if (this.describe.type.includes('remote')) {
                    return {
                        show: true,
                        name: '',
                        value: this.formData.renderValue
                    }
                }
                return {
                    show: false,
                    value: ''
                }
            }
        },
        created () {
            const {
                val,
                name,
                type
            } = this.describe
            const defaultValue = val
            const component = Array.isArray[name] ? name : [name]

            // 构造 variable-select 的配置
            this.variableSelectData = {
                type: 'slot',
                prop: this.name,
                format: 'value',
                includesFormat: ['value', 'variable', 'expression'],
                code: defaultValue,
                includesValueType: undefined
            }

            // slot 的初始值
            this.formData = Object.freeze({
                format: 'value',
                component: component[0],
                code: defaultValue,
                payload: {},
                valueType: type[0],
                renderValue: defaultValue
            })

            // 编辑状态缓存
            this.slotTypeValueMemo = {
                [this.formData.valueType]: {
                    val: defaultValue,
                    payload: {},
                    component: this.formData.component
                }
            }

            if (this.lastValue && this.lastValue.valueType) {
                this.formData = Object.freeze({
                    ...this.formData,
                    format: this.lastValue.format,
                    component: this.lastValue.component,
                    code: this.lastValue.code,
                    payload: this.lastValue.payload || {},
                    valueType: this.lastValue.valueType
                })
                this.slotTypeValueMemo[this.formData.valueType] = {
                    val: this.formData.code,
                    payload: this.formData.payload,
                    component: this.formData.component
                }
            }
        },
        methods: {
            triggerChange () {
                // 缓存用户本地编辑值
                this.slotTypeValueMemo[this.formData.valueType] = {
                    val: this.formData.code,
                    payload: this.formData.payload,
                    component: this.formData.component
                }

                this.$emit('on-change', this.name, {
                    ...this.formData
                })
            },
            /**
             * @desc format 更新
             * @param { Object } variableSelectData
             */
            handleVariableSelectChange (variableSelectData) {
                this.formData = Object.freeze({
                    ...this.formData,
                    format: variableSelectData.format,
                    code: variableSelectData.code,
                    renderValue: variableSelectData.renderValue
                })
                this.triggerChange()
            },
            /**
             * @desc slot 组件类型切换
             */
            handleSlotComponentChange (component) {
                this.format = Object.freeze({
                    ...this.format,
                    component
                })
                this.triggerChange()
            },
            /**
             * @desc format 等于 value 时，value 的类型切换
             * @param { String } valueType
             */
            handleValueTypeChange (valueType) {
                let code = null
                let payload = {}
                if (this.slotTypeValueMemo.hasOwnProperty(valueType)) {
                    code = this.slotTypeValueMemo[valueType].val
                    payload = this.slotTypeValueMemo[valueType].payload
                } else {
                    code = ''
                }
                this.formData = Object.freeze({
                    ...this.formData,
                    code,
                    valueType,
                    renderValue: code,
                    payload
                })
                this.triggerChange()
            },
            /**
             * @desc format 等于 value 时，编辑 code 的值
             * @param { Object } valueData
             */
            handleValueChange (valueData) {
                this.formData = Object.freeze({
                    ...this.formData,
                    code: valueData.val,
                    payload: valueData.payload,
                    renderValue: valueData.val
                })
                this.triggerChange()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .slot-name {
        line-height: 32px;
    }
    .slot-tips {
        border-bottom: 1px dashed #979ba5;
        cursor: pointer;
    }
    .slot-label {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #63656E;
        display: block;
    }
    /deep/ .slot-title {
        height: 28px;
        font-size: 12px;
        font-weight: bold;
        color: #63656E;
    }
</style>
