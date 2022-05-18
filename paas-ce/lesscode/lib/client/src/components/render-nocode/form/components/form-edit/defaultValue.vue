<template>
    <div class="field-default-value">
        <bk-select
            v-if="['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(field.type)"
            :value="field.value"
            :multiple="field.multiple"
            :disabled="disabled"
            @selected="handleSelect">
            <bk-option v-for="choice in field.choice" :key="choice.key" :id="choice.key" :name="choice.name"> </bk-option>
        </bk-select>
        <bk-input
            v-else-if="field.type === 'DESC'"
            type="textarea"
            :value="field.value"
            :disabled="disabled"
            @change="$emit('change', $event)"></bk-input>
        <field-item
            v-else
            :field="field"
            :use-fixed-data-source="true"
            :value="field.value"
            :disabled="disabled"
            :show-label="false"
            @change="$emit('change', $event)">
        </field-item>
    </div>
</template>
<script>
// 表单字段编辑时填写默认值组件
    import cloneDeep from 'lodash.clonedeep'
    import FieldItem from '@/components/nocode-form/fieldItem.vue'

    export default {
        name: 'DefaultValue',
        components: {
            FieldItem
        },
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            selectType () {
                return ['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(this.field.type)
            }
        },
        methods: {
            handleSelect (val) {
                this.$emit('change', cloneDeep(val))
            }
        }
    }
</script>
