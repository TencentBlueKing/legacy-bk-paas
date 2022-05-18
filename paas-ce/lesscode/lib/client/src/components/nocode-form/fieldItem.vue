<template>
    <div :class="['field-form-item', { 'half-row': field.layout === 'COL_6' }]" v-if="isShow">
        <div
            v-if="showLabel && field.type !== 'DESC'"
            :class="['field-label', { required: field.validate_type === 'REQUIRE' }]">
            <span v-if="field.desc" v-bk-tooltips="field.desc" class="label-text has-desc">{{ field.name }}</span>
            <span v-else class="label-text">{{ field.name }}</span>
            <i v-if="field.tips" v-bk-tooltips="field.tips" class="bk-icon icon-question-circle tips-icon"></i>
        </div>
        <div class="field-form-content">
            <component
                :is="fieldComp"
                :field="field"
                :disabled="isDisabled"
                :use-fixed-data-source="useFixedDataSource"
                :value="value"
                @change="$emit('change', $event)">
            </component>
        </div>
    </div>
</template>
<script>
    import { deepClone } from './util/index.js'
    import { FIELDS_TYPES } from './constants/forms.js'
    import AutoNumber from './fields/autoNumber.vue'
    import Checkbox from './fields/checkbox.vue'
    import CustomForm from './fields/customForm.vue'
    import CustomTable from './fields/customTable.vue'
    import Date from './fields/date.vue'
    import Datetime from './fields/datetime.vue'
    import Description from './fields/description.vue'
    import Formula from './fields/formula.vue'
    import ImageFile from './fields/imageFile.vue'
    import Input from './fields/input.vue'
    import InputSelect from './fields/inputSelect.vue'
    import Int from './fields/int.vue'
    import Link from './fields/link.vue'
    import Member from './fields/member.vue'
    import Members from './fields/members.vue'
    import MultiSelect from './fields/multiSelect.vue'
    import Radio from './fields/radio.vue'
    import RichText from './fields/richText.vue'
    import Select from './fields/select.vue'
    import Table from './fields/table.vue'
    import Textarea from './fields/textarea.vue'
    import Tree from './fields/tree.vue'
    import Upload from './fields/upload.vue'

    // 注册fields文件夹下所有字段类型组件
    // function registerField() {
    //   const fields = require.context('./fields/', false, /\w+\.(vue)$/);
    //   const components = {};
    //   fields.keys().forEach((fileName) => {
    //     const componentConfig = fields(fileName);
    //     const comp = componentConfig.default;
    //     components[comp.name] = comp;
    //   });

    //   return components;
    // }
    export default {
        name: 'FieldFormItem',
        components: {
            AutoNumber: AutoNumber,
            Checkbox: Checkbox,
            CustomForm: CustomForm,
            CustomTable: CustomTable,
            Date: Date,
            Datetime: Datetime,
            Description: Description,
            Formula: Formula,
            ImageFile: ImageFile,
            Input: Input,
            InputSelect: InputSelect,
            Int: Int,
            Link: Link,
            Member: Member,
            Members: Members,
            MultiSelect: MultiSelect,
            Radio: Radio,
            RichText: RichText,
            Select: Select,
            Table: Table,
            Textarea: Textarea,
            Tree: Tree,
            Upload: Upload
        },
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: [String, Number, Boolean, Array],
                default () {
                    return deepClone(FIELDS_TYPES.find(item => item.type === this.field.type).default)
                }
            },
            showLabel: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            useFixedDataSource: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            fieldComp () {
                return FIELDS_TYPES.find(item => item.type === this.field.type).comp
            },
            // 默认规则设置为禁止填写 和 字段设置为禁止编辑的时候禁止编辑
            isDisabled () {
                return this.field.is_readonly
            },
            isShow () {
                if (this.field.show_conditions && this.field.show_conditions.connector) {
                    return false
                }
                return true
            }
        }
        // beforeCreate() {
        //   const fields = registerField();
        //   Object.keys(fields).forEach((item) => {
        //     this.$options.components[item] = fields[item];
        //   });
        // },
    }
</script>
<style lang="postcss" scoped>
.field-form-item {
  margin-top: 24px;
  width: 100%;
  &.half-row {
    width: calc(50% - 16px);
    margin-right: 16px;
  }
}
.field-label {
  position: relative;
  margin-bottom: 6px;
  line-height: 22px;
  font-size: 14px;
  color: #63656e;
  &.required:after {
    content: '*';
    display: inline-block;
    position: absolute;
    top: 50%;
    height: 8px;
    line-height: 1;
    font-size: 12px;
    color: #ea3636;
    transform: translate(3px, -50%);
  }
  .label-text {
    &.has-desc {
      border-bottom: 1px dashed #979ba5;
      cursor: pointer;
    }
  }
  .tips-icon {
    color: #979ba5;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
