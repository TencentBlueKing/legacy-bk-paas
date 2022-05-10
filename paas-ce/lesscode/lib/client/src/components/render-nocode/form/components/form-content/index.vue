<template>
    <div class="form-panel">
        <draggable
            filter=".actions-area"
            :class="['fields-container', activeCls]"
            :value="fields"
            :group="{ name: 'form', pull: true, put: ['menu', 'half-row-field'] }"
            @add="add"
            @end="end">
            <field-element
                v-for="(item, index) in fields"
                :key="`${item.type}_${index}`"
                :class="{ actived: selectedIndex === index }"
                :field="item"
                @action="handleFormAction($event, index)">
            </field-element>
            <bk-exception v-if="fields.length === 0" class="fields-empty" type="empty" scene="part">
                暂无内容，请在左侧选择需要添加的控件
            </bk-exception>
        </draggable>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import cloneDeep from 'lodash.clonedeep'
    import { FIELDS_TYPES } from '../../constant/forms'
    import FieldElement from '../form-edit/fieldElement.vue'
    import pinyin from 'pinyin'

    export default {
        components: {
            draggable,
            FieldElement
        },
        props: {
            fields: {
                type: Array,
                default: () => []
            },
            formId: [String, Number],
            hover: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                selectedIndex: -1
            }
        },
        computed: {
            activeCls () {
                if (this.hover) {
                    return `hover ${this.fields.length === 0 ? 'add-first-field' : ''}`
                }
                return ''
            }
        },
        methods: {
            // 拖拽添加字段
            add (e) {
                const { type } = e.item.dataset
                const field = FIELDS_TYPES.find(item => item.type === type)
                const defaultVal = ['MULTISELECT', 'CHECKBOX', 'MEMBER', 'MEMBERS', 'TABLE'].includes(type)
                    ? ''
                    : cloneDeep(field.default)
                const key = pinyin(field.name, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: false
                })
                    .join('_')
                    .toUpperCase()
                const config = {
                    type, // 类型
                    name: field.name, // 名称
                    desc: '', // 描述
                    regex: 'EMPTY', // 校验规则
                    layout: 'COL_12', // 布局：半行、整行
                    key,
                    unique: false, // 是否唯一
                    validate_type: 'OPTION', // 是否必填
                    source_type: 'CUSTOM', // 数据来源类型 [CUSTOM, API, DATADICT, RPC, WORKSHEET]
                    api_instance_id: null, // 源数据的kv关系配置
                    kv_relation: {}, // 源数据的kv关系配置
                    default: defaultVal, // 默认值
                    choice: this.getDefaultChoice(type), // 选项
                    worksheet_id: this.formId, // 表单id
                    meta: {}, // 复杂描述信息
                    show_conditions: {}, // 显隐藏条件
                    read_only_conditions: {}, // 只读条件
                    mandatory_conditions: {}, // 必填条件
                    is_readonly: false, // 只读
                    show_type: 0, // 显隐
                    fileTemplate: []// 存储文件类型组件的值
                }
                const index = this.fields.length === 0 ? 0 : e.newIndex
                this.$emit('add', config, index)
                this.selectedIndex = index
            },
            end (e) {
                this.$emit('move', e.newIndex, e.oldIndex)
                this.selectedIndex = e.newIndex
            },
            // 选择、复制、删除操作
            handleFormAction (type, index) {
                const field = cloneDeep(this.fields[index])
                if (type === 'edit') {
                    this.$emit('select', field, index)
                    this.selectedIndex = index
                } else if (type === 'copy') {
                    delete field.key
                    delete field.id
                    this.$emit('copy', field, index)
                    this.selectedIndex = index + 1
                } else if (type === 'delete') {
                    this.$emit('delete', index)
                    if (this.selectedIndex === index) {
                        this.selectedIndex = -1
                    }
                }
            },
            getDefaultChoice (type) {
                if (['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(type)) {
                    return [
                        { key: 'XUANXIANG1', name: '选项1', color: '#FF8C00', isDefaultVal: true },
                        { key: 'XUANXIANG2', name: '选项2', color: '#3A84FF', isDefaultVal: false }
                    ]
                }
                if (['TABLE'].includes(type)) {
                    return [
                        { key: '', name: '' },
                        { key: '', name: '' }
                    ]
                }
                return []
            }

        }
    }
</script>

<style lang="postcss" scoped>
@import "@/css/mixins/scroller";
.form-panel {
  margin: 24px;
  height: calc(100% - 48px);
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
  border-radius: 2px;
}

.fields-container {
  @mixin scroller;
  padding: 35px 0;
  height: 100%;
  overflow: auto;
  &.hover {
    outline: 2px dashed #1768ef;
    border-radius: 4px;
  }

  &.add-first-field {
    background: rgba(23, 104, 239, 0.1);
  }
}

.field-element {
  &.actived {
    border: 1px dashed #3a84ff;
  }
}

/deep/ .fields-empty {
  padding-top: 100px;

  .bk-exception-img {
    width: 300px;
    height: auto;
  }

  .bk-exception-text {
    font-size: 20px;
    color: #63656e;
  }
}
</style>
<style lang="postcss">
.fields-container {
  & > li.drag-entry {
    position: relative;
    width: 100%;
    height: 0;
    font-size: 0;
    border-top: 2px solid #1768ef;
  }

  .field-item.sortable-ghost {
    border-top: 2px solid #1768ef;
  }
}
</style>
