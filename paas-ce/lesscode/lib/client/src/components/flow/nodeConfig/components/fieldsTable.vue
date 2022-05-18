<template>
    <div class="fields-table-wrapper">
        <div class="preview-btn" :style="{ top: node.type === 'APPROVAL' ? '-32px' : 0 }" @click="showPreviewDialog = true">
            <i class="bk-icon icon-eye"></i>
            <span>字段预览</span>
        </div>
        <div v-if="node.type !== 'APPROVAL'" class="btns-area">
            <bk-button :disabled="!editable" @click="showSelectFieldPanel = true"> 选取已有字段</bk-button>
            <bk-button
                :disabled="!editable || disableCreateField"
                @click="onAddFieldClick"
                style="margin-left: 8px"> 新增字段
            </bk-button>
        </div>
        <table class="field-table">
            <thead>
                <tr>
                    <th class="name">
                        <div class="cell">名称</div>
                    </th>
                    <th class="key">
                        <div class="cell">唯一标识</div>
                    </th>
                    <th class="type">
                        <div class="cell">类型</div>
                    </th>
                    <th class="source">
                        <div class="cell">字段来源</div>
                    </th>
                    <th class="required">
                        <div class="cell">必填</div>
                    </th>
                    <th class="editable">
                        <div class="cell">可编辑</div>
                    </th>
                    <th class="operation">
                        <div class="cell">操作</div>
                    </th>
                </tr>
            </thead>
            <draggable tag="tbody" handle=".drag-icon" :list="fieldsList" @end="$emit('change', fieldsList)">
                <tr v-for="field in fieldsList" :key="field.id">
                    <td class="name">
                        <i class="bk-icon icon-grag-fill drag-icon"></i>
                        <div v-bk-overflow-tips class="cell">
                            {{ field.name }}
                        </div>
                    </td>
                    <td class="key">
                        <div v-bk-overflow-tips class="cell">{{ field.key }}</div>
                    </td>
                    <td>
                        <div v-bk-overflow-tips class="cell">{{ getTypeName(field.type) }}</div>
                    </td>
                    <td>
                        <div class="cell">{{ getSourceType(field) }}</div>
                    </td>
                    <td>
                        <div class="cell">{{ field.validate_type === 'REQUIRE' ? '是' : '否' }}</div>
                    </td>
                    <td>
                        <div class="cell">{{ field.is_readonly || funcType === 'DETAIL' ? '否' : '是' }}</div>
                    </td>
                    <td>
                        <div class="cell">
                            <div class="button-area">
                                <bk-button
                                    text
                                    style="margin-right: 8px"
                                    :disabled="node.type === 'APPROVAL' || funcType === 'DETAIL' || !editable"
                                    @click="onEditFieldClick(field)">
                                    编辑
                                </bk-button>
                                <bk-button text :disabled="!editable || isFieldDelDisabled(field)" @click="onDeleteFieldClick(field)">
                                    删除
                                </bk-button>
                            </div>
                        </div>
                    </td>
                </tr>
                <bk-exception
                    v-if="fieldsList.length === 0"
                    class="exception-part"
                    type="empty"
                    scene="part">
                    暂无表单字段数据
                </bk-exception>
            </draggable>
        </table>
        <bk-dialog
            title="字段预览"
            header-position="left"
            ext-cls="preview-field-dialog"
            :width="800"
            :show-footer="false"
            :mask-close="false"
            :auto-close="false"
            :value="showPreviewDialog"
            @cancel="showPreviewDialog = false">
            <div class="fields-preview-container">
                <form-fields v-if="fieldsList.length > 0" :use-fixed-data-source="true" :fields="fieldsList"></form-fields>
                <bk-exception v-else type="empty" scene="part">暂无表单字段数据</bk-exception>
            </div>
        </bk-dialog>
        <bk-sideslider
            :is-show="showFieldEditPanel"
            :quick-close="false"
            :transfer="true"
            :title="fieldData.id ? '编辑字段' : '新增字段'"
            :width="960"
            :before-close="handleEditFieldPanelClose">
            <form-field-edit
                slot="content"
                class="field-slider-container"
                :app-id="appId"
                :flow-id="flowId"
                :node-id="node.id"
                :field="fieldData"
                @close="handleEditFieldPanelClose"
                @save="handleFieldsUpdate">
            </form-field-edit>
        </bk-sideslider>
        <bk-sideslider
            title="选取已有字段"
            :is-show="showSelectFieldPanel"
            :transfer="true"
            :quick-close="false"
            :width="640"
            :before-close="handleSelectFieldPanelClose">
            <form-field-select-panel
                slot="content"
                :related-form="relatedForm"
                :func-id="funcId"
                :node-id="node.id"
                :node-fields="list"
                @save="handleFieldsUpdate"
                @close="handleSelectFieldPanelClose">
            </form-field-select-panel>
        </bk-sideslider>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import cloneDeep from 'lodash.clonedeep'
    import FormFieldEdit from '@/components/render-nocode/form/components/form-edit/fieldEdit.vue'
    import FormFields from '@/components/nocode-form/index.vue'
    import FormFieldSelectPanel from './selectFieldPanel.vue'
    import { FIELDS_TYPES, FIELDS_SOURCE_TYPE } from '@/components/nocode-form/constants/forms.js'

    export default {
        name: 'FieldsTable',
        components: {
            draggable,
            FormFieldEdit,
            FormFields,
            FormFieldSelectPanel
        },
        props: {
            list: {
                type: Array,
                default: () => []
            },
            appId: String,
            funcId: [Number, String],
            funcType: String,
            flowId: Number,
            node: {
                type: Object,
                default: () => ({})
            },
            relatedForm: {
                type: Array,
                default: () => []
            },
            disableCreateField: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                fieldsSourceType: FIELDS_SOURCE_TYPE,
                fieldsList: cloneDeep(this.list),
                fieldData: {},
                formsFieldList: [],
                showPreviewDialog: false,
                showSelectFieldPanel: false,
                showFieldEditPanel: false,
                deleteFieldPending: false
            }
        },
        watch: {
            list (val) {
                this.fieldsList = cloneDeep(val)
            }
        },
        methods: {
            getTypeName (type) {
                const form = FIELDS_TYPES.find(item => item.type === type)
                return form ? form.name : '--'
            },
            getSourceType (field) {
                if (field.source_type === 'CUSTOM' && field.meta.worksheet) {
                    return field.meta.worksheet.name || '--'
                }
                const typeItem = this.fieldsSourceType.find(item => item.id === field.source_type)
                return typeItem ? typeItem.name : '--'
            },
            // 字段删除按钮禁用
            isFieldDelDisabled (field) {
                return (
                    field.meta.code === 'APPROVE_RESULT'
                    || (field.is_builtin && this.node.is_first_state)
                    || this.node.type === 'APPROVAL'
                )
            },
            onAddFieldClick () {
                this.fieldData = {
                    type: '', // 类型
                    name: '', // 名称
                    desc: '', // 描述
                    regex: 'EMPTY', // 校验规则
                    layout: 'COL_12', // 布局：半行、整行
                    unique: false, // 是否唯一
                    validate_type: 'OPTION', // 是否必填
                    source_type: 'CUSTOM', // 数据来源类型 [CUSTOM, API, WORKSHEET]
                    is_readonly: false,
                    api_instance_id: null, // 源数据的kv关系配置
                    kv_relation: {}, // 源数据的kv关系配置
                    default: '', // 默认值
                    choice: [], // 选项
                    meta: {}, // 复杂描述信息
                    mandatory_conditions: {},
                    read_only_conditions: {},
                    show_conditions: {}, // 设置隐藏条件
                    state: this.node.id,
                    workflow: this.flowId, // 表单id
                    num_range: []
                }
                this.showFieldEditPanel = true
            },
            onEditFieldClick (field) {
                this.fieldData = field
                this.showFieldEditPanel = true
            },
            // 删除字段
            onDeleteFieldClick (field) {
                this.$bkInfo({
                    type: 'warning',
                    subTitle: `确认删除字段：${field.name}？`,
                    confirmLoading: true,
                    confirmFn: async () => {
                        this.deleteFieldPending = true
                        try {
                            await this.$store.dispatch('setting/deleteNodeField', field.id)
                            this.handleFieldsUpdate('delete', field)
                        } catch (e) {
                            console.error(e)
                        } finally {
                            this.deleteFieldPending = false
                        }
                    }
                })
            },
            handleSelectFieldPanelClose () {
                this.$bkInfo({
                    title: '此操作会导致您的编辑没有保存，确认吗？',
                    type: 'warning',
                    width: 500,
                    confirmFn: () => {
                        this.showSelectFieldPanel = false
                    }
                })
            },
            handleFieldsUpdate (type, data) {
                const list = cloneDeep(this.fieldsList)
                if (type === 'add') {
                    Array.isArray(data) ? list.push(...data) : list.push(data)
                } else {
                    const index = list.findIndex(item => item.id === data.id)
                    if (type === 'update') {
                        list.splice(index, 1, data)
                    } else if (type === 'delete') {
                        list.splice(index, 1)
                    }
                }
                this.showSelectFieldPanel = false
                this.showFieldEditPanel = false
                this.$emit('change', list)
            },
            handleEditFieldPanelClose () {
                this.$bkInfo({
                    title: '此操作会导致您的编辑没有保存，确认吗？',
                    type: 'warning',
                    width: 500,
                    confirmFn: () => {
                        this.showFieldEditPanel = false
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
@import '@/css/mixins/scroller.css';

.preview-btn {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #3a84ff;
  cursor: pointer;
  z-index: 1;

  i {
    margin-right: 4px;
  }
}

.btns-area {
  position: relative;
  margin-bottom: 8px;
  height: 32px;
}

.fields-preview-container {
  padding: 3px 24px 26px;
  min-height: 300px;
  max-height: 460px;
  overflow: auto;
  @mixin scroller;
}

.field-slider-container {
  height: calc(100vh - 60px);
}

.field-table {
  width: 100%;
  border: 1px solid #dfe0e5;
  border-collapse: collapse;
  table-layout: fixed;

  tr {
    background: #ffffff;

    &:hover {
      .drag-icon {
        display: inline-block;
      }
    }
  }

  th,
  td {
    position: relative;
    padding: 0;
    height: 42px;
    min-width: 0;
    vertical-align: middle;
    text-align: left;
    border-bottom: 1px solid #dfe0e5;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .cell {
    padding: 0 15px;
    text-align: left;
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    font-weight: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    /deep/ .bk-button-text {
      font-size: 12px;
    }
  }

  th {
    color: #313238;
    background: #fafbfd;
    font-weight: normal;
  }

  td {
    color: #63656e;
  }

  .name {
    padding-left: 10px;
  }

  .drag-icon {
    display: none;
    position: absolute;
    top: 14px;
    left: 6px;
    font-size: 12px;
    color: #979ba5;
    cursor: move;
    z-index: 1;

    &:hover {
      color: #3a84ff;
    }
  }

  .key {
    width: 110px;
  }

  .operation {
    width: 100px;
  }

  .editable {
    width: 70px;
  }

  .required {
    width: 60px;
  }
}

.exception-part {
  width: 600px;
}
</style>
<style lang="postcss">
.preview-field-dialog {
  .bk-dialog-body {
    padding: 0;
  }
}
</style>
