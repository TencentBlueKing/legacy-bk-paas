<template>
    <div class="line-condition">
        <bk-radio-group v-model="conditionData.type">
            <bk-radio value="and">且</bk-radio>
            <bk-radio value="or">或</bk-radio>
        </bk-radio-group>
        <div v-for="(exp, index) in conditionData.expressions" class="line-condition-item" :key="index">
            <div class="expression-label">{{ conditionData.type === 'and' ? '且' : '或' }}-条件组{{ index + 1 }}</div>
            <div class="condition-content-wrapper">
                <i
                    v-if="conditionData.expressions.length > 1"
                    class="bk-icon icon-close delete-icon"
                    @click="handleDelCondition(index)">
                </i>
                <div class="condition-type">
                    <label>字段间关系</label>
                    <bk-radio-group v-model="exp.type">
                        <bk-radio value="and">且</bk-radio>
                        <bk-radio value="or">或</bk-radio>
                    </bk-radio-group>
                </div>
                <div v-for="(expression, i) in exp.expressions" class="expression-item" :key="i">
                    <bk-select
                        v-model="expression.key"
                        style="width: 200px"
                        class="field-select"
                        placeholder="选择字段"
                        :clearable="false"
                        :searchable="true"
                        :loading="fieldListLoading"
                        :disabled="fieldListLoading"
                        @selected="handleSelectField(exp, expression)">
                        <bk-option v-for="field in fieldList" :key="field.key" :id="field.key" :name="field.name"></bk-option>
                    </bk-select>
                    <bk-select
                        v-model="expression.condition"
                        style="width: 100px"
                        class="relation-select"
                        :clearable="false"
                        @selected="handleSelectRelation(exp)">
                        <bk-option
                            v-for="item in getConditionOptions(expression.key)"
                            :key="item.id"
                            :id="item.id"
                            :name="item.name">
                        </bk-option>
                    </bk-select>
                    <field-value
                        style="width: 240px"
                        :field="getField(expression.key)"
                        :use-fixed-data-source="getField(expression.key).source === 'global'"
                        :value="expression.value"
                        @change="fieldValueChange(index, i, $event)">
                    </field-value>
                    <div class="action-area">
                        <i class="custom-icon-font icon-add-circle" @click="handleAddExpression(index, i)"></i>
                        <i
                            :class="['custom-icon-font', 'icon-reduce-circle', { disabled: exp.expressions.length < 2 }]"
                            @click="handleDelExpression(index, i)">
                        </i>
                    </div>
                </div>
            </div>
            <div v-if="exp.error" class="common-error-tips">关系组内的数据不能为空</div>
        </div>
        <div class="add-condition">
            <span @click="handleAddCondition">
                <i class="bk-icon icon-plus-circle add-icon"></i>
                添加条件组
            </span>
        </div>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { CONDITION_RELATIONS } from '@/components/nocode-form/constants/forms.js'
    import { getFieldConditions } from '@/components/render-nocode/common/form.js'
    import FieldValue from '@/components/render-nocode/form/components/form-edit/fieldValue.vue'

    const HIDDEN_ARR = [
        'ticket_service_type',
        'ticket_current_status',
        'ticket_current_status_display',
        'ticket_bk_biz_id',
        'ticket_sops_task_summary',
        'ticket_title',
        'ticket_sn',
        'ticket_ticket_url',
        'ticket_all_task_processors'
    ]

    export default {
        name: 'LineCondition',
        components: {
            FieldValue
        },
        props: {
            condition: {
                type: Object,
                default: () => ({})
            },
            lineId: Number,
            deletable: {
                type: Boolean,
                dafault: true
            }
        },
        data () {
            return {
                conditionData: cloneDeep(this.condition),
                conditionRelations: CONDITION_RELATIONS,
                fieldListLoading: false,
                fieldList: [],
                selectedField: {}
            }
        },
        watch: {
            condition (val) {
                this.conditionData = cloneDeep(val)
            }
        },
        created () {
            this.getLineVars()
        },
        methods: {
            // 获取变量
            async getLineVars () {
                try {
                    this.fieldListLoading = true
                    const res = await this.$store.dispatch('setting/getLineVars', this.lineId)
                    this.fieldList = res.data.filter(item => !HIDDEN_ARR.includes(item.key))
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fieldListLoading = false
                }
            },
            getField (key) {
                if (key) {
                    return this.fieldList.find(item => item.key === key)
                }
                return {}
            },
            getConditionOptions (key) {
                if (key) {
                    const field = this.fieldList.find(i => i.key === key)
                    return field ? getFieldConditions(field.type) : []
                }
                return []
            },
            handleAddCondition () {
                this.conditionData.expressions.push({
                    type: 'and',
                    expressions: [
                        {
                            key: '',
                            condition: '',
                            value: '',
                            source: 'field',
                            type: 'STRING'
                        }
                    ]
                })
            },
            handleDelCondition (index) {
                this.conditionData.expressions.splice(index, 1)
            },
            handleAddExpression (conIndex, expIndex) {
                this.conditionData.expressions[conIndex].expressions.splice(expIndex + 1, 0, {
                    key: '',
                    condition: '',
                    value: ''
                })
            },
            handleDelExpression (conIndex, expIndex) {
                if (this.conditionData.expressions[conIndex].expressions.length < 2) {
                    return
                }
                this.conditionData.expressions[conIndex].expressions.splice(expIndex, 1)
                this.validateItem(this.conditionData.expressions[conIndex])
            },
            handleSelectField (exp, expression) {
                const field = this.fieldList.find(item => item.key === expression.key)
                expression.type = field.type
                expression.condition = ''
                if (exp.error) {
                    this.validateItem(exp)
                }
            },
            handleSelectRelation (exp) {
                if (exp.error) {
                    this.validateItem(exp)
                }
            },
            fieldValueChange (conIndex, expIndex, val) {
                this.conditionData.expressions[conIndex].expressions[expIndex].value = val
                this.validateItem(this.conditionData.expressions[conIndex])
            },
            validateItem (exp) {
                const invalid = exp.expressions.some((item) => {
                    const { key, condition, value } = item
                    return key === '' || condition === '' || (Array.isArray(value) ? value.length === 0 : value === '')
                })
                this.$set(exp, 'error', invalid)
                return !invalid
            },
            validate () {
                return this.conditionData.expressions.every(item => this.validateItem(item))
            },
            getData () {
                const data = {}
                const { expressions, type } = this.conditionData
                data.type = type
                data.expressions = expressions.map((exp) => {
                    const { type, expressions } = exp
                    return { type, expressions }
                })
                return data
            }
        }
    }
</script>
<style lang="postcss" scoped>
.expression-label {
  margin: 10px 0;
  font-size: 14px;
  color: #666666;
}
.add-condition > span {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  color: #3a84ff;
  font-size: 14px;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.condition-content-wrapper {
  position: relative;
  padding: 16px 22px;
  background: #fafbfd;
  border: 1px solid #dcdee5;
}
.delete-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  color: #c4c6cc;
  cursor: pointer;
  &:hover {
    background: #dcdee5;
    color: #ffffff;
    border-radius: 50%;
  }
}
.condition-type {
  display: flex;
  align-items: center;
  height: 30px;
  & > label {
    margin-right: 30px;
    white-space: nowrap;
    color: #63656e;
    font-size: 14px;
  }
}
.expression-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  height: 32px;
  .action-area {
    & > i {
      color: #c4c6cc;
      font-size: 18px;
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
}
.bk-select {
  background: #ffffff;
}
</style>
