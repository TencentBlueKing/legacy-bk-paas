<template>
    <variable-select
        :value="computedSlotVariable.val"
        :val-type="computedSlotVariable.valType"
        :available-types="computedAvailableTypes"
        @change="changeVariable"
    >
        <template v-slot:title>
            <section class="slot-title-wrapper">
                <span
                    :class="['slot-name', { 'slot-tips': slotConfig.tips }]"
                    v-bk-tooltips="computedSlotTip"
                >{{ slotName }}<span v-if="slotConfig.type && slotConfig.type.length <= 1"> ({{ computedSlotVal.type | capFirstLetter }})</span>
                </span>
                <template v-if="slotConfig.name && slotConfig.name.length > 1">
                    <span class="slot-label">组件标签</span>
                    <bk-radio-group :value="computedSlotVal.name" @change="changeSlot('name', ...arguments)" class="mb10">
                        <bk-radio-button :value="name" v-for="name in slotConfig.name" :key="name" class="mr10">
                            {{ name | capFirstLetter }}
                        </bk-radio-button>
                    </bk-radio-group>
                </template>
            </section>
        </template>
        <template v-if="slotConfig.type && slotConfig.type.length > 1">
            <span class="slot-label">数据类型</span>
            <bk-radio-group :value="computedSlotVal.type" @change="changeSlot('type', ...arguments)" class="mb10">
                <bk-radio-button :value="type" v-for="type in slotConfig.type" :key="type">
                    {{ type | capFirstLetter }}
                </bk-radio-button>
            </bk-radio-group>
        </template>
        <component
            :is="computedSlotType"
            :slot-val="computedSlotVal"
            :slot-config="slotConfig"
            :render-props="renderProps"
            :change="change"
            @batchUpdate="batchUpdate"
        ></component>
    </variable-select>
</template>

<script>
    import { transformTipsWidth } from '@/common/util'
    import safeStringify from '@/common/json-safe-stringify'
    import variableSelect from '@/components/variable/variable-select'

    import slotList from './components/list'
    import slotColumn from './components/column'
    import slotRemote from './components/remote'
    import slotFormItem from './components/form-item'
    import slotTable from './components/table'
    import slotHtml from './components/slot-html'
    import slotText from './components/text'
    import slotTextArea from './components/textarea'

    const comMap = {
        list: slotList,
        column: slotColumn,
        remote: slotRemote,
        html: slotHtml,
        text: slotText,
        textarea: slotTextArea,
        'form-item': slotFormItem,
        'table-column': slotTable
    }

    export default {
        components: {
            variableSelect
        },

        filters: {
            capFirstLetter (val) {
                return `${val.substring(0, 1).toUpperCase()}${val.substring(1).toLowerCase()}`
            }
        },

        props: {
            slotName: {
                type: String
            },
            slotVal: {
                type: Object
            },
            slotConfig: {
                type: Object
            },
            renderProps: {
                type: Object
            }
        },

        data () {
            return {
                mutlTypeVal: {}
            }
        },

        computed: {
            computedSlotTip () {
                const transformTips = transformTipsWidth(this.slotConfig.tips)
                const tips = typeof transformTips === 'string' ? { content: transformTips } : transformTips
                const disabled = !this.slotConfig.tips
                return {
                    ...(tips || {}),
                    disabled
                }
            },

            computedSlotType () {
                const type = this.slotVal.type
                return comMap[type]
            },

            // val 值类型
            computedAvailableTypes () {
                const val = this.slotVal.val
                const type = Object.prototype.toString.apply(val)
                const typeMap = {
                    '[object Array]': 'array',
                    '[object Object]': 'object',
                    '[object Number]': 'number',
                    '[object Boolean]': 'boolean',
                    '[object String]': 'string'
                }
                return [typeMap[type]]
            },

            computedSlotVariable () {
                const slotPayload = this.slotVal.payload || {}
                return slotPayload.variableData || { val: '', valType: 'value' }
            },

            computedCombinType () {
                return this.slotVal.type + this.slotVal.name
            },

            computedSlotVal () {
                return this.mutlTypeVal[this.computedCombinType]
            }
        },

        watch: {
            slotVal: {
                handler (val) {
                    this.mutlTypeVal[this.computedCombinType] = JSON.parse(safeStringify(val))
                },
                deep: true,
                immediate: true
            }
        },

        methods: {
            changeSlot (key, name) {
                let slotVal = {
                    ...this.computedSlotVal,
                    [key]: name
                }

                const type = slotVal.type + slotVal.name
                const slot = this.mutlTypeVal.hasOwnProperty(type) ? this.mutlTypeVal[type] : this.slotConfig

                slotVal = {
                    ...slotVal,
                    val: slot.val,
                    payload: slot.payload
                }

                this.change(slotVal)
            },

            changeVariable (variableData) {
                const val = variableData.defaultVal === undefined ? this.slotConfig.val : variableData.defaultVal
                const payload = {
                    variableData: { val: variableData.val, valType: variableData.valType }
                }
                const slotVal = {
                    ...this.computedSlotVal,
                    payload,
                    val
                }
                this.change(slotVal)
            },

            change (slotVal) {
                this.$emit('change', this.slotName, slotVal)
            },

            batchUpdate () {
                this.$emit('batchUpdate', ...arguments)
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
