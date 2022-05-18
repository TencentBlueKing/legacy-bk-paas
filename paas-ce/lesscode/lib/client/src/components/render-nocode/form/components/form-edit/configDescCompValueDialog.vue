<template>
    <bk-dialog
        title="内容配置"
        header-position="left"
        ext-cls="formula-config-dialog"
        :mask-close="false"
        :auto-close="false"
        :close-icon="false"
        width="960"
        :value="show"
        @confirm="onConfirm"
        @cancel="$emit('update:show', false)">
        <field-item :field="field" @change="handleChangeValue"></field-item>
    </bk-dialog>
</template>

<script>
    import FieldItem from '@/components/nocode-form/fieldItem.vue'
    import { RICHTEXT_FIELD } from '../../../common/field'

    export default {
        name: 'configDescCompValue',
        components: {
            FieldItem
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            value: String
        },
        data () {
            return {
                field: RICHTEXT_FIELD
            }
        },
        created () {
            this.field.value = this.value
        },
        methods: {
            onConfirm () {
                this.$emit('confirm', this.field.value)
            },
            handleChangeValue (val) {
                this.field.value = val
            }
        }
    }
</script>

<style scoped lang="postcss">
/deep/ .field-form-item {
  margin: 0;

  .field-label {
    display: none
  }
}

</style>
