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
                >{{ slotName }}</span>
                <template v-if="slotConfig.name && slotConfig.name.length > 1">
                    <span class="slot-label">组件标签</span>
                    <bk-radio-group :value="copySlotVal.name" @change="changeSlot('name', ...arguments)" class="mb10">
                        <bk-radio-button :value="name" v-for="name in slotConfig.name" :key="name" class="mr10">
                            {{ name | capFirstLetter }}
                        </bk-radio-button>
                    </bk-radio-group>
                </template>
            </section>
        </template>
        <template v-if="slotConfig.type && slotConfig.type.length > 1">
            <span class="slot-label">数据类型</span>
            <bk-radio-group :value="copySlotVal.type" @change="changeSlot('type', ...arguments)" class="mb10">
                <bk-radio-button :value="type" v-for="type in slotConfig.type" :key="type">
                    {{ type | capFirstLetter }}
                </bk-radio-button>
            </bk-radio-group>
        </template>
        <component
            :is="computedSlotType"
            :slot-val="copySlotVal"
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
    import slotFree from './components/free-layout-item'
    import slotRemote from './components/remote'
    import slotFormItem from './components/form-item'

    const comMap = {
        list: slotList,
        column: slotColumn,
        'free-layout-item': slotFree,
        remote: slotRemote,
        'form-item': slotFormItem
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
                copySlotVal: {}
            }
        },

        computed: {
            computedSlotTip () {
                const tips = transformTipsWidth(this.slotConfig.tips)
                const disabled = !this.slotConfig.tips
                return {
                    ...(tips || {}),
                    disabled
                }
            },

            computedSlotType () {
                const type = this.copySlotVal.type
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
            }
        },

        watch: {
            slotVal: {
                handler (val) {
                    this.copySlotVal = JSON.parse(safeStringify(val))
                },
                deep: true,
                immediate: true
            }
        },

        methods: {
            changeSlot (key, name) {
                this.copySlotVal[key] = name
                this.change(this.copySlotVal)
            },

            changeVariable (variableData) {
                const value = variableData.defaultVal === undefined ? this.slotConfig.val : variableData.defaultVal
                this.copySlotVal.payload = {
                    variableData: { val: variableData.val, valType: variableData.valType }
                }
                this.copySlotVal.val = value
                this.change(this.copySlotVal)
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
    .slot-title-wrapper {

    }
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
