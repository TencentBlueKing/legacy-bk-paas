<template>
    <div v-bkloading="{ bkLoading: relatedFormFieldsLoading }" style="height: 100%">
        <bk-form
            ref="fieldPanelForm"
            form-type="vertical"
            class="field-slider-form-content"
            :model="formData"
            :rules="rules">
            <bk-form-item label="表单选择" property="forms">
                <bk-select
                    v-model="formData.forms"
                    :multiple="true"
                    :clearable="false"
                    :display-tag="true"
                    :loading="relatedFormFieldsLoading"
                    @change="handleSelectForms">
                    <bk-option v-for="option in relatedForm" :key="option.id" :id="option.id" :name="option.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="字段选择" style="margin-top: 24px">
                <table class="form-fields-table">
                    <thead>
                        <tr>
                            <th class="checkbox">
                                <bk-checkbox
                                    :value="checkedRows.length > 0 && checkedRows.length === formsFieldTableData.length"
                                    :indeterminate="checkedRows.length > 0 && checkedRows.length < formsFieldTableData.length"
                                    @change="handleCheckAll">
                                </bk-checkbox>
                            </th>
                            <th class="name">名称</th>
                            <th class="key">唯一标识</th>
                            <th class="type">类型</th>
                            <th class="desc">描述</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="formsFieldTableData.length > 0">
                            <template v-for="(item, index) in formsFieldTableData">
                                <tr v-if="item.isHead || item.showInTable" :key="index" :class="{ 'form-title': item.isHead }">
                                    <td class="checkbox">
                                        <i
                                            v-if="item.isHead"
                                            :class="['bk-icon', 'icon-down-shape', { folded: !item.expand }]"
                                            @click="handleFieldsExpand(item)">
                                        </i>
                                        <bk-checkbox
                                            v-model="item.checked"
                                            :indeterminate="item.halfChecked"
                                            :disabled="fieldHasInNode(item)"
                                            @change="handleCheckRow(item)">
                                        </bk-checkbox>
                                    </td>
                                    <td v-bk-overflow-tips class="name" :colspan="item.isHead ? 4 : 1">
                                        {{ item.name }}
                                    </td>
                                    <template v-if="!item.isHead">
                                        <td v-bk-overflow-tips class="key">{{ item.key }}</td>
                                        <td v-bk-overflow-tips class="type">{{ fieldsTypes.find(t => t.type === item.type).name }}</td>
                                        <td v-bk-overflow-tips class="desc">{{ item.desc || '--' }}</td>
                                    </template>
                                </tr>
                            </template>
                        </template>
                        <tr v-else>
                            <td colspan="5">
                                <bk-exception type="empty" scene="part" style="padding: 30px 0">暂无数据</bk-exception>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </bk-form-item>
        </bk-form>
        <div class="slider-actions-area" slot="footer">
            <bk-button
                theme="primary"
                style="margin-right: 4px; min-width: 88px; text-align: center"
                :loading="savePending"
                @click="handleConfirm">
                确定
            </bk-button>
            <bk-button style="min-width: 88px; text-align: center" @click="$emit('close')">取消</bk-button>
        </div>
    </div>
</template>
<script>
// 选择他表字段导入组件
    import { FIELDS_TYPES } from '@/components/nocode-form/constants/forms.js'

    export default {
        name: 'FormFieldSelectPanel',
        props: {
            relatedForm: {
                type: Array,
                default: () => []
            },
            node: {
                type: Object,
                default: () => ({})
            },
            nodeFields: {
                type: Array,
                defult: () => []
            },
            funcId: Number,
            nodeId: Number
        },
        data () {
            return {
                fieldsTypes: FIELDS_TYPES,
                relatedFormFieldsLoading: false,
                formsFieldList: [],
                formsFieldTableData: [],
                savePending: false,
                formData: { forms: [] },
                rules: {
                    forms: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        computed: {
            checkedRows () {
                return this.formsFieldTableData.filter(item => item.checked)
            }
        },
        created () {
            this.getRelatedFormFields()
        },
        methods: {
            async getRelatedFormFields () {
                if (this.relatedForm.length === 0) {
                    return
                }
                try {
                    this.relatedFormFieldsLoading = true
                    const res = await Promise.all(
                        this.relatedForm.map(item => this.$store.dispatch('setting/getFormFields', item.id))
                    )
                    this.formsFieldList = res.map((item, index) => {
                        const form = this.relatedForm[index]
                        const fields = item.data.map(field => Object.assign(field, { formKey: form.key }))
                        return { id: form.id, name: form.name, fields }
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.relatedFormFieldsLoading = false
                }
            },
            fieldHasInNode (field) {
                return this.nodeFields.some(item => {
                    if (item.meta && item.meta.worksheet) {
                        const { key, field_key } = item.meta.worksheet
                        return key === field.formKey && field_key === field.key
                    }
                    return false
                })
            },
            handleSelectForms (val, oldVal) {
                const formsFieldTableData = []
                val.forEach(id => {
                    const formData = this.formsFieldList.find(item => item.id === id)
                    const { name, fields } = formData
                    if (oldVal.includes(id)) {
                        const rowItem = this.formsFieldTableData.find(item => item.id === id)
                        formsFieldTableData.push(rowItem)
                    } else {
                        formsFieldTableData.push({
                            id,
                            name,
                            checked: false,
                            halfChecked: false,
                            isHead: true,
                            expand: true
                        })
                    }
                    fields.forEach(field => {
                        if (oldVal.includes(id)) {
                            const rowItem = this.formsFieldTableData.find(item => item.id === field.id)
                            formsFieldTableData.push(rowItem)
                        } else {
                            const hasInNode = this.fieldHasInNode(field)
                            formsFieldTableData.push(
                                Object.assign({}, field, {
                                    checked: hasInNode,
                                    disabled: hasInNode,
                                    showInTable: true
                                })
                            )
                        }
                    })
                })
                this.formsFieldTableData = formsFieldTableData
            },
            handleFieldsExpand (form) {
                const val = !form.expand
                this.$set(form, 'expand', val)
                this.formsFieldTableData.forEach(item => {
                    if (item.worksheet_id === form.id) {
                        item.showInTable = val
                    }
                })
            },
            handleCheckRow (val) {
                if (val.isHead) {
                    const fields = this.formsFieldTableData.filter(item => item.worksheet_id === val.id)
                    if (val.checked) {
                        fields.forEach(item => {
                            if (!item.disabled) {
                                item.checked = true
                            }
                        })
                    } else {
                        fields.forEach(item => {
                            if (!item.disabled) {
                                item.checked = false
                            }
                        })
                    }
                } else {
                    const fields = this.formsFieldTableData.filter(item => item.worksheet_id === val.worksheet_id)
                    const form = this.formsFieldTableData.find(item => item.id === val.worksheet_id)
                    const checkedFieldsLength = fields.filter(item => item.checked).length
                    if (val.checked) {
                        if (checkedFieldsLength === fields.length) {
                            form.checked = true
                            form.halfChecked = false
                        } else {
                            form.checked = false
                            form.halfChecked = true
                        }
                    } else {
                        if (checkedFieldsLength === 0) {
                            form.checked = false
                            form.halfChecked = false
                        } else {
                            form.checked = false
                            form.halfChecked = true
                        }
                    }
                }
            },
            handleCheckAll (val) {
                this.formsFieldTableData.forEach(item => {
                    if (item.disabled) {
                        return
                    }
                    item.checked = val
                    if (item.halfChecked) {
                        item.halfChecked = false
                    }
                })
            },
            handleConfirm () {
                this.$refs.fieldPanelForm.validate().then(async () => {
                    const fields = this.formsFieldTableData
                        .filter(item => !item.isHead && item.checked && !item.disabled)
                        .map(item => item.id)
                    if (fields.length === 0) {
                        this.$emit('close')
                    } else {
                        try {
                            this.savePending = true
                            const params = {
                                field_ids: fields,
                                service_id: this.funcId,
                                state_id: this.nodeId
                            }
                            const res = await this.$store.dispatch('setting/importNodeFields', params)
                            this.$bkMessage({
                                theme: 'success',
                                message: '保存成功'
                            })
                            this.$emit('save', 'add', res.data)
                        } catch (e) {
                            console.error(e)
                        } finally {
                            this.savePending = false
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
@import '@/css/mixins/scroller.css';

.field-slider-form-content {
  padding: 18px 40px;
  height: calc(100vh - 108px);
  overflow: auto;
  @mixin scroller;
}
.form-fields-table {
  width: 100%;
  border: 1px solid #dcdee5;
  border-radius: 2px;
  border-collapse: collapse;
  table-layout: fixed;
  tr {
    border-bottom: 1px solid #dcdee5;
  }
  td {
    padding: 0 16px;
    height: 42px;
    line-height: 42px;
    color: #63656e;
    text-align: left;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  th {
    padding: 0 16px;
    height: 42px;
    line-height: 42px;
    text-align: left;
    font-size: 12px;
    color: #313238;
    background: #fafbfd;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .checkbox {
    padding: 0;
    width: 60px;
    text-align: right;
    user-select: none;
    i {
      display: inline-block;
      margin-right: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.1s ease-in-out;
      &:hover {
        color: #3a84ff;
      }
      &.folded {
        transform: rotate(-90deg);
      }
    }
  }
  .name {
    width: 140px;
  }
  .key {
    width: 140px;
  }
  .type {
    width: 100px;
  }
  .form-title {
    background: #f5f7fa;
    td {
      height: 32px;
      line-height: 32px;
      color: #979ba5;
    }
  }
}
.slider-actions-area {
  padding: 0 24px;
  height: 48px;
  line-height: 48px;
  background: #fafbfd;
}
</style>
