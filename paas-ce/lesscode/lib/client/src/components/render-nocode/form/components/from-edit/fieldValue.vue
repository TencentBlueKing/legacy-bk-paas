<template>
    <div class="field-value">
        <bk-input v-if="field.type === 'STRING'" v-model="localVal" :disabled="!editable" @change="change"></bk-input>
        <bk-input v-else-if="field.type === 'INT'" v-model="localVal" type="number" :disabled="!editable" @change="change">
        </bk-input>
        <bk-input
            v-else-if="field.type === 'TEXT'"
            v-model="localVal"
            type="textarea"
            :disabled="!editable"
            @change="change">
        </bk-input>
        <bk-date-picker
            v-else-if="['DATE', 'DATETIME'].includes(field.type)"
            v-model="localVal"
            :disabled="!editable"
            @change="change">
        </bk-date-picker>
        <bk-select
            v-else-if="['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(field.type)"
            v-model="localVal"
            :multiple="['MULTISELECT', 'CHECKBOX'].includes(field.type)"
            :disabled="!editable"
            @change="change">
            <bk-option v-for="option in sourceData" :key="option.key" :id="option.key" :name="option.name"></bk-option>
        </bk-select>
        <!--        <member-select-->
        <!--            v-else-if="['MEMBER', 'MEMBERS'].includes(field.type)"-->
        <!--            :value="localVal ? localVal.split(',') : []"-->
        <!--            :multiple="field.type === 'MEMBERS'"-->
        <!--            :disabled="!editable"-->
        <!--            @change="handleMemberChange">-->
        <!--        </member-select>-->
        <bk-input v-else v-model="localVal" :disabled="!editable" @change="change"></bk-input>
    </div>
</template>
<script>
// 表单值填写组件，根据传入的field.type来渲染对应类型的表单，用在数据处理节点以及连线的条件配置等地方。
    import dataSourceMixins from '../mixins/dataSourceMixins'
    import { DATA_SOURCE_FIELD } from '../../constant/forms'

    export default {
        name: 'FieldValue',
        mixins: [dataSourceMixins],
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: [String, Number, Array, Boolean],
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                localVal: this.value
            }
        },
        watch: {
            value (val) {
                this.localVal = val
            },
            field (val) {
                if (DATA_SOURCE_FIELD.includes(val.type)) {
                    this.setSourceData()
                }
            }
        },
        methods: {
            handleMemberChange (val) {
                const value = val.join(',')
                this.localVal = value
                this.change(value)
            },
            change (val) {
                this.$emit('change', val)
            }
        }
    }
</script>
<style lang="postcss" scoped>
/* 组件库的部分表单类组件（如input、datepicker等）最外层为元素display属性设置为inline-block，
导致外层容器的高度不等于实际表单组件的高度 */
.field-value > div {
  display: block;
}
.bk-date-picker {
  width: 100%;
}
</style>
