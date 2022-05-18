<template>
    <bk-form ref="dataForm" form-type="vertical" class="data-process-node-form" :rules="rules" :model="formData">
        <div class="action-select-area">
            <bk-form-item label="节点动作" property="action" :required="true">
                <bk-select :value="formData.action" :clearable="false" :disabled="!editable" @selected="handleSelectAction">
                    <bk-option v-for="item in actions" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="目标表单" property="worksheet_id" :required="true">
                <bk-select
                    v-model="formData.worksheet_id"
                    :clearable="false"
                    :loading="formListLoading"
                    :disabled="formListLoading || !editable"
                    @selected="handleSelectForm">
                    <bk-option v-for="item in formList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                </bk-select>
            </bk-form-item>
        </div>
        <bk-form-item label="字段映射规则">
            <template v-if="formData.action && formData.worksheet_id !== ''">
                <!-- 满足条件，删除、更新动作存在 -->
                <div v-if="['DELETE', 'EDIT'].includes(formData.action)" class="rules-section">
                    <div class="logic-radio">
                        <label>{{ formData.action === 'DELETE' ? '删除条件' : '满足条件' }}</label>
                        <bk-radio-group v-model="formData.conditions.connector">
                            <bk-radio value="and" :disabled="!editable">且</bk-radio>
                            <bk-radio value="or" :disabled="!editable">或</bk-radio>
                        </bk-radio-group>
                    </div>
                    <div v-if="formData.conditions.expressions.length > 0" class="condition-list">
                        <div class="condition-item" v-for="(expression, index) in formData.conditions.expressions" :key="index">
                            <bk-select
                                v-model="expression.key"
                                placeholder="目标表字段"
                                style="width: 140px; margin-right: 8px"
                                :clearable="false"
                                :searchable="true"
                                :loading="formListLoading"
                                :disabled="formListLoading || !editable"
                                @selected="handleSelectField(expression)">
                                <bk-option
                                    v-for="item in getSelectableField(fieldList, expression.key, 'condition')"
                                    :key="item.key"
                                    :id="item.key"
                                    :name="item.name">
                                </bk-option>
                            </bk-select>
                            <bk-select
                                v-model="expression.condition"
                                placeholder="逻辑"
                                style="width: 100px; margin-right: 8px"
                                :clearable="false"
                                :disabled="!editable">
                                <bk-option
                                    v-for="item in getConditionOptions(expression.key)"
                                    :key="item.id"
                                    :id="item.id"
                                    :name="item.name">
                                </bk-option>
                            </bk-select>
                            <bk-select
                                v-model="expression.type"
                                placeholder="值类型"
                                style="width: 100px; margin-right: 8px"
                                :clearable="false"
                                :disabled="!editable"
                                @selected="expression.value = ''">
                                <bk-option id="const" name="值"></bk-option>
                                <bk-option id="field" name="引用变量"></bk-option>
                                <bk-option id="department" name="组织架构"></bk-option>
                                <template v-if="
                                    fieldList.length > 0 &&
                                        expression.key &&
                                        fieldList.find(i => i.key === expression.key).type === 'INT'
                                ">
                                    <bk-option id="increment" name="增加"></bk-option>
                                    <bk-option id="reduction" name="减少"></bk-option>
                                </template>
                                <template v-if="
                                    fieldList.length > 0 &&
                                        expression.key &&
                                        ['STRING', 'TEXT', 'DATE', 'DATETIME', 'SELECT', 'RADIO'].includes(
                                            fieldList.find(i => i.key === expression.key).type
                                        )
                                ">
                                    <bk-option id="system" name="系统变量"></bk-option>
                                    <bk-option id="approver" name="审批人"></bk-option>
                                    <bk-option id="leader" name="指定上级"></bk-option>
                                </template>
                            </bk-select>
                            <bk-select
                                v-if="expression.type === 'field'"
                                v-model="expression.value"
                                placeholder="选择变量"
                                style="width: 140px"
                                :clearable="false"
                                :searchable="true"
                                :loading="relationListLoading"
                                :disabled="relationListLoading || !editable">
                                <bk-option-group
                                    v-for="(group, gIdx) in getAvailableRelationList(expression)"
                                    :key="gIdx"
                                    :name="group.name"
                                    :show-collapse="true"
                                    :is-collapse="!group.fields.some(fItm => fItm.id === expression.value)">
                                    <bk-option v-for="item in group.fields" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                                </bk-option-group>
                            </bk-select>
                            <bk-select
                                v-else-if="expression.type === 'system'"
                                v-model="expression.value"
                                style="width: 140px"
                                :clearable="false"
                                :disabled="!editable">
                                <bk-option id="date" name="当前日期"></bk-option>
                                <bk-option id="start_time" name="单据创建时间"></bk-option>
                                <bk-option id="creator" name="提单人"></bk-option>
                                <bk-option id="leader" name="提单人上级"></bk-option>
                                <bk-option id="sn" name="单号"></bk-option>
                            </bk-select>
                            <bk-select
                                v-else-if="expression.type === 'approver'"
                                v-model="expression.value"
                                placeholder="选择审批节点"
                                style="width: 140px"
                                :clearable="false"
                                :loading="approvalNodeListLoading"
                                :disabled="approvalNodeListLoading || !editable">
                                <bk-option v-for="item in approvalNodeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                            </bk-select>
                            <bk-select
                                v-else-if="expression.type === 'leader'"
                                v-model="expression.value"
                                placeholder="选择人员类型变量"
                                style="width: 140px"
                                :clearable="false"
                                :loading="relationListLoading"
                                :disabled="relationListLoading || !editable">
                                <bk-option
                                    v-for="item in memberRelationFields"
                                    :key="item.id"
                                    :id="item.id"
                                    :name="item.name">
                                </bk-option>
                            </bk-select>
                            <field-value
                                v-else
                                style="width: 140px"
                                :field="fieldList.length > 0 && fieldList.find(i => i.key === expression.key)"
                                :value="expression.value"
                                :editable="editable"
                                @change="expression.value = $event">
                            </field-value>
                            <div class="operate-btns" style="margin-left: 8px">
                                <i class="custom-icon-font icon-add-circle" @click="handleAddExpression(index)"></i>
                                <i :class="['custom-icon-font', 'icon-reduce-circle']" @click="handleDeleteExpression(index)"> </i>
                            </div>
                        </div>
                    </div>
                    <div v-else :class="['data-empty', { disabled: !editable }]" @click="handleAddExpression(-1)">点击添加</div>
                </div>
                <!-- 映射规则，增加、更新动作存在 -->
                <div v-if="['ADD', 'EDIT'].includes(formData.action)" class="rules-section">
                    <label>{{ formData.action === 'ADD' ? '插入规则' : '则更新' }}</label>
                    <div v-if="formData.mapping.length > 0" class="mapping-list">
                        <div class="condition-item" v-for="(mapping, index) in formData.mapping" :key="index">
                            <bk-select
                                v-model="mapping.key"
                                placeholder="目标表字段"
                                style="width: 180px; margin-right: 8px"
                                :clearable="false"
                                :searchable="true"
                                :loading="formListLoading"
                                :disabled="formListLoading || !editable"
                                @selected="handleSelectField(mapping)">
                                <bk-option
                                    v-for="item in getSelectableField(targetFields, mapping.key, 'mapping')"
                                    :key="item.key"
                                    :id="item.key"
                                    :name="item.name"></bk-option>
                            </bk-select>
                            <bk-select
                                v-model="mapping.type"
                                placeholder="值类型"
                                style="width: 100px; margin-right: 8px"
                                :clearable="false"
                                :disabled="!editable"
                                @selected="(val) => handleSelectMapValue(mapping,val)">
                                <bk-option id="const" name="值"></bk-option>
                                <bk-option id="field" name="引用变量"></bk-option>
                                <bk-option id="department" name="组织架构"></bk-option>
                                <template v-if="
                                    targetFields.length > 0 &&
                                        mapping.key &&
                                        targetFields.find(i => i.key === mapping.key).type === 'INT'
                                ">
                                    <bk-option id="increment" name="增加"></bk-option>
                                    <bk-option id="reduction" name="减少"></bk-option>
                                    <bk-option v-if="formData.action === 'EDIT'" id="field_increment" name="加指定变量"></bk-option>
                                    <bk-option v-if="formData.action === 'EDIT'" id="field_reduction" name="减指定变量"></bk-option>
                                </template>
                                <template v-if="
                                    targetFields.length > 0 &&
                                        mapping.key &&
                                        ['STRING', 'TEXT', 'DATE', 'DATETIME', 'SELECT', 'RADIO'].includes(
                                            fieldList.find(i => i.key === mapping.key).type
                                        )
                                ">
                                    <bk-option id="system" name="系统变量"></bk-option>
                                    <bk-option id="approver" name="审批人"></bk-option>
                                    <bk-option id="leader" name="指定上级"></bk-option>
                                </template>
                            </bk-select>
                            <bk-select
                                v-if="['field', 'field_increment', 'field_reduction'].includes(mapping.type)"
                                v-model="mapping.value"
                                placeholder="选择变量"
                                style="width: 208px"
                                :clearable="false"
                                :searchable="true"
                                :loading="relationListLoading"
                                :disabled="relationListLoading || !editable">
                                <bk-option-group
                                    v-for="(group, gIdx) in getAvailableRelationList(mapping)"
                                    :key="gIdx"
                                    :name="group.name"
                                    :show-collapse="true"
                                    :is-collapse="!group.fields.some(fItm => fItm.id === mapping.value)">
                                    <bk-option v-for="item in group.fields" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                                </bk-option-group>
                            </bk-select>
                            <bk-select
                                v-else-if="mapping.type === 'system'"
                                v-model="mapping.value"
                                style="width: 208px"
                                :clearable="false"
                                :disabled="!editable">
                                <bk-option id="date" name="当前日期"></bk-option>
                                <bk-option id="start_time" name="单据创建时间"></bk-option>
                                <bk-option id="creator" name="提单人"></bk-option>
                                <bk-option id="leader" name="提单人上级"></bk-option>
                                <bk-option id="sn" name="单号"></bk-option>
                            </bk-select>
                            <bk-select
                                v-else-if="mapping.type === 'approver'"
                                v-model="mapping.value"
                                placeholder="选择审批节点"
                                style="width: 208px"
                                :clearable="false"
                                :loading="approvalNodeListLoading"
                                :disabled="approvalNodeListLoading || !editable">
                                <bk-option v-for="item in approvalNodeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                            </bk-select>
                            <bk-select
                                v-else-if="mapping.type === 'leader'"
                                v-model="mapping.value"
                                placeholder="选择人员类型变量"
                                style="width: 208px"
                                :clearable="false"
                                :loading="relationListLoading"
                                :disabled="relationListLoading || !editable">
                                <bk-option
                                    v-for="item in memberRelationFields"
                                    :key="item.id"
                                    :id="item.id"
                                    :name="item.name">
                                </bk-option>
                            </bk-select>
                            <field-value
                                v-else-if="targetFields.length > 0"
                                style="width: 208px"
                                :field=" targetFields.find(i => i.key === mapping.key)"
                                :value="mapping.value"
                                :editable="editable"
                                @change="mapping.value = $event">
                            </field-value>
                            <div class="operate-btns" style="margin-left: 8px">
                                <i class="custom-icon-font icon-add-circle" @click="handleAddMapping(index)"></i>
                                <i :class="['custom-icon-font', 'icon-reduce-circle']" @click="handleDeleteMapping(index)"> </i>
                            </div>
                        </div>
                    </div>
                    <div v-else :class="['data-empty', { disabled: !editable }]" @click="handleAddMapping(-1)">点击添加</div>
                </div>
            </template>
            <bk-exception v-else class="no-data" type="empty" scene="part">请选择节点动作和目标表单</bk-exception>
            <p v-if="errorTips" class="common-error-tips">请检查字段映射规则</p>
        </bk-form-item>
    </bk-form>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { CONDITION_RELATIONS } from '@/components/nocode-form/constants/forms.js'
    import { getFieldConditions } from '@/components/render-nocode/common/form.js'
    import FieldValue from '@/components/render-nocode/form/components/form-edit/fieldValue.vue'

    export default {
        name: 'DataProcessNode',
        components: {
            FieldValue
        },
        props: {
            node: {
                type: Object,
                default: () => ({})
            },
            appId: {
                type: String,
                default: ''
            },
            createTicketNodeId: Number,
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                formData: this.getInitialFormData(this.node),
                actions: [
                    { id: 'ADD', name: '插入' },
                    { id: 'EDIT', name: '更新' },
                    { id: 'DELETE', name: '删除' }
                ],
                isDepartMent: '',
                conditionRelations: CONDITION_RELATIONS,
                formListLoading: false,
                formList: [],
                fieldListLoading: false,
                fieldList: [],
                approvalNodeListLoading: false,
                approvalNodeList: [],
                relationListLoading: false,
                relationList: [],
                errorTips: false,
                rules: {
                    action: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    worksheet_id: [
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
            targetFields () {
                const tempKey = this.formData?.mapping.filter(item => item.type === 'department').map(item => item.key)
                const targetFiled = this.fieldList.filter(item => !['id', 'ids'].includes(item.key)).map((el) => {
                    if (tempKey.includes(el.key)) {
                        return { ...el, type: 'MEMBER' }
                    }
                    return el
                })
                return targetFiled
            },
            // 值类型为指定上级时，可选值为引用变量中的单选人员变量
            memberRelationFields () {
                const list = []
                this.relationList.forEach((group) => {
                    const memberTypeFields = group.fields.filter(item => item.type === 'MEMBER')
                    if (memberTypeFields.length > 0) {
                        list.push({ name: group.name, fields: memberTypeFields })
                    }
                })
                return list
            }
        },
        watch: {
            node (val) {
                this.formData = this.getInitialFormData(val.extras.dataManager)
            }
        },
        created () {
            this.getFormList()
            this.getRelationList()
            this.getApprovalNode()
            if (this.node.extras.dataManager && this.node.extras.dataManager.worksheet_id !== '') {
                this.getFieldList(this.node.extras.dataManager.worksheet_id)
            }
        },
        methods: {
            async getFormList () {
                try {
                    this.formListLoading = true
                    const res = await this.$store.dispatch('setting/getFormList', { project_key: this.appId, page_size: 1000 })
                    this.formList = res.data.items
                } catch (e) {
                    console.error(e)
                } finally {
                    this.formListLoading = false
                }
            },
            async getFieldList (id) {
                try {
                    this.fieldListLoading = true
                    const res = await this.$store.dispatch('setting/getFormFields', id)
                    res.data.unshift({ key: 'id', name: 'id', type: 'INT' })
                    if (this.formData.action === 'DELETE') {
                        res.data.unshift({ key: 'ids', name: 'ids', type: 'INT' })
                    }
                    this.fieldList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fieldListLoading = false
                }
            },
            // 获取节点字段列表
            async getRelationList () {
                try {
                    this.relationListLoading = true
                    const res = await this.$store.dispatch('setting/getGroupedNodeVars', this.node.id)
                    const groupedList = []
                    res.data.forEach((group) => {
                        if (group.fields.length > 0) {
                            groupedList.push({
                                name: group.state_name,
                                fields: group.fields.map((item) => {
                                    const { key, name, type } = item
                                    return {
                                        type,
                                        name,
                                        id: `$\{param_${key}}`
                                    }
                                })
                            })
                        }
                    })
                    this.relationList = groupedList
                } catch (e) {
                    console.error(e)
                } finally {
                    this.relationListLoading = false
                }
            },
            async getApprovalNode () {
                try {
                    this.approvalNodeListLoading = true
                    const res = await this.$store.dispatch('setting/getApprovalNode', this.createTicketNodeId)
                    this.approvalNodeList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.approvalNodeListLoading = false
                }
            },
            // 接口返回的数据可能数据字段不全
            getInitialFormData (node) {
                let data = {}
                if (node.extras.dataManager) {
                    data = cloneDeep(node.extras.dataManager)
                    if (!data.conditions) {
                        data.conditions = { connector: 'and', expressions: [] }
                    }
                    if (!data.conditions.expressions) {
                        data.conditions.expressions = []
                    }
                    if (!data.mapping) {
                        data.mapping = []
                    }
                } else {
                    data = { action: '', conditions: { connector: 'and', expressions: [] }, mapping: [], worksheet_id: '' }
                }
                return data
            },
            getConditionOptions (key) {
                if (key) {
                    const field = this.fieldList.find(i => i.key === key)
                    return field ? getFieldConditions(field.type) : []
                }
                return []
            },
            // 可选择的目标表字段
            getSelectableField (fieldList, crtKey, type) {
                const data = type === 'condition' ? this.formData.conditions.expressions : this.formData.mapping
                const usedKeys = []
                data.forEach((item) => {
                    if (item.key && item.key !== crtKey) {
                        usedKeys.push(item.key)
                    }
                })
                return fieldList.filter(item => !usedKeys.includes(item.key))
            },
            // 切换动作
            handleSelectAction (val) {
                const idsFieldIdx = this.fieldList.findIndex(item => item.key === 'ids')
                this.formData.action = val
                if (val === 'DELETE') {
                    if (idsFieldIdx === -1) {
                        this.fieldList.splice(0, 0, { key: 'ids', name: 'ids' })
                    }
                } else {
                    if (idsFieldIdx > -1) {
                        this.fieldList.splice(idsFieldIdx, 1)
                    }
                }
                this.resetForm()
                this.change()
            },
            // 切换表单
            handleSelectForm (val) {
                this.getFieldList(val)
                this.resetForm()
                this.change()
            },
            handleAddExpression (index) {
                if (!this.editable) {
                    return
                }
                this.formData.conditions.expressions.splice(index + 1, 0, {
                    key: '',
                    type: 'const',
                    condition: '',
                    value: ''
                })
            },
            handleDeleteExpression (index) {
                if (!this.editable) {
                    return
                }
                this.formData.conditions.expressions.splice(index, 1)
            },
            handleAddMapping (index) {
                if (!this.editable) {
                    return
                }
                this.formData.mapping.splice(index + 1, 0, {
                    key: '',
                    type: 'const',
                    value: ''
                })
            },
            handleDeleteMapping (index) {
                if (!this.editable) {
                    return
                }
                this.formData.mapping.splice(index, 1)
            },
            // 数字类型的变量如果指定值类型为减指定变量、加指定变量，可选变量需要过滤
            getAvailableRelationList (exp) {
                if (this.targetFields.length > 0) {
                    const field = this.fieldList.find(i => i.key === exp.key)
                    if (field && field.type === 'INT' && ['field_increment', 'field_reduction'].includes(exp.type)) {
                        const list = []
                        this.relationList.forEach((group) => {
                            const fields = []
                            group.fields.forEach((item) => {
                                if (item.type === 'INT') {
                                    fields.push(item)
                                }
                            })
                            if (fields.length > 0) {
                                list.push({ name: group.name, fields })
                            }
                        })
                        return list
                    }
                }
                return this.relationList
            },
            // 选择表单字段，修改对应值的数据类型
            handleSelectField (data) {
                const field = this.fieldList.find(item => item.key === data.key)
                data.type = 'const'
                if (data.condition) {
                    data.condition = ''
                }
                switch (field.type) {
                    case 'INT':
                        data.value = 0
                        break
                    case 'MULTISELECT':
                    case 'CHECKBOX':
                        data.value = []
                        break
                    default:
                        data.value = ''
                }
            },
            resetForm () {
                this.formData = {
                    ...this.formData,
                    conditions: {
                        connector: 'and',
                        expressions: []
                    },
                    mapping: []
                }
            },
            validate () {
                return this.$refs.dataForm
                    .validate()
                    .then(() => {
                        const { expressions = [] } = this.formData.conditions
                        const expInValid = expressions.some(item => item.key === '' || item.condition === '' || item.value === '')
                        const mapInValid = (this.formData.mapping || []).some(item => item.key === '' || item.value === '')
                        this.errorTips = expInValid || mapInValid
                        if (expInValid || mapInValid) {
                            this.errorTips = true
                            return false
                        }
                        this.errorTips = false
                        return true
                    })
                    .catch(() => false)
            },
            change () {
                this.validate()
            },
            // 提供获取组件表单数据方法
            getData () {
                const data = cloneDeep(this.formData)
                if (this.formData.action === 'ADD') {
                    // 插入类型的动作接口不支持传conditions字段
                    delete data.conditions
                }
                return data
            },
            handleSelectMapValue (mapping, val) {
                mapping.value = ''
                val === 'department' ? this.isDepartMent = true : this.isDepartMent = false
            }
        }
    }
</script>
<style lang="postcss" scoped>
.data-process-node-form {
  .action-select-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    .bk-form-item {
      flex: 1;
      margin-top: 0;
      &:first-child {
        margin-right: 16px;
      }
    }
  }
  & > .bk-form-item {
    margin-top: 24px;
  }
  .bk-select {
    background: #ffffff;
  }
  .logic-radio {
    display: flex;
    align-items: center;
    height: 20px;
    & > label {
      margin-right: 30px;
      white-space: nowrap;
      color: #63656e;
      font-size: 14px;
    }
  }
  .rules-section {
    margin-top: 16px;
    padding: 14px 24px 24px;
    background: #fafbfd;
    border: 1px solid #dcdee5;
    & > label {
      color: #63656e;
      font-size: 14px;
    }
    .condition-item {
      display: flex;
      align-items: center;
      margin-top: 16px;
    }
    .operate-btns {
      user-select: none;
      i {
        color: #c4c6cc;
        cursor: pointer;
        &:hover {
          color: #979ba5;
        }
        &.disabled {
          color: #dcdee5;
          cursor: not-allowed;
        }
      }
    }
    .data-empty {
      margin-top: 16px;
      padding: 24px 0;
      font-size: 12px;
      text-align: center;
      color: #dcdee5;
      border: 1px dashed #dcdee5;
      cursor: pointer;
      &:not(.disabled):hover {
        border-color: #3a84ff;
        color: #3a84ff;
      }
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
