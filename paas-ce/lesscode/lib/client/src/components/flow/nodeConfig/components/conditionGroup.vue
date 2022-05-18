<template>
    <div class="condition-group">
        <i v-if="showDeleteIcon" class="bk-icon icon-close close-btn" @click="$emit('delete')"></i>
        <div class="connector-rule">
            <label>字段间关系</label>
            <bk-radio-group v-model="localVal.connector" @change="change">
                <bk-radio value="and">且</bk-radio>
                <bk-radio value="or">或</bk-radio>
            </bk-radio-group>
        </div>
        <div class="condition-list">
            <div v-for="(conditionItem, index) in localVal.expressions" class="condition-item" :key="index">
                <div class="condition-content">
                    <!-- 选择字段 -->
                    <bk-select
                        v-model="conditionItem.key"
                        style="width: 30%; margin-right: 8px"
                        :clearable="false"
                        :loading="fieldsLoading"
                        @selected="handleSelectField(conditionItem)">
                        <bk-option v-for="field in fields" :key="field.key" :id="field.key" :name="field.name"></bk-option>
                    </bk-select>
                    <!-- 选择逻辑关系 -->
                    <bk-select
                        v-model="conditionItem.condition"
                        style="width: 30%; margin-right: 8px"
                        :clearable="false"
                        @selected="change">
                        <bk-option
                            v-for="field in getConditionOptions(conditionItem.key)"
                            :key="field.id"
                            :id="field.id"
                            :name="field.name">
                        </bk-option>
                    </bk-select>
                    <!-- 条件值 -->
                    <field-value
                        style="width: 40%"
                        :field="getField(conditionItem.key)"
                        :value="conditionItem.value"
                        @change="handleValChange(conditionItem, $event)">
                    </field-value>
                </div>
                <div class="operate-btns">
                    <i class="custom-icon-font icon-add-circle" @click="handleAddExpression(index)"></i>
                    <i
                        :class="['custom-icon-font', 'icon-reduce-circle', { disabled: localVal.expressions.length < 2 }]"
                        @click="handleDeleteExpression(index)">
                    </i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import FieldValue from '@/components/form/fieldValue.vue'
    import { getFieldConditions } from '@/utils/form.js'

    export default {
        name: 'ConditionGroup',
        components: {
            FieldValue
        },
        props: {
            fields: {
                type: Array,
                default: () => []
            },
            fieldsLoading: {
                type: Boolean,
                default: false
            },
            showDeleteIcon: {
                type: Boolean,
                default: true
            },
            type: [String],
            value: {
                type: Object,
                default () {
                    return {
                        connector: 'and',
                        expressions: [
                            {
                                key: '',
                                condition: '',
                                value: ''
                            }
                        ]
                    }
                }
            }
        },
        data () {
            return {
                localVal: this.getLocalVal(this.value)
            }
        },
        watch: {
            value (val) {
                this.localVal = this.getLocalVal(val)
            }
        },
        methods: {
            // 确保至少有一个字段条件
            getLocalVal (val) {
                const expressions = [{ key: '', condition: '', value: '' }]
                let defaultVal
                this.type === 'show_conditions' ? defaultVal = { type: 'and', expressions } : defaultVal = { connector: 'and', expressions }
                return Object.assign({}, defaultVal, cloneDeep(val))
            },
            // 筛选条件字段
            getField (key) {
                if (key) {
                    return this.fields.find(item => item.key === key)
                }
                return {}
            },
            getConditionOptions (key) {
                if (key) {
                    const field = this.fields.find(i => i.key === key)
                    return field ? getFieldConditions(field.type) : []
                }
                return []
            },
            // 选择表单字段，修改对应值的数据类型
            handleSelectField (data) {
                const field = this.fields.find(item => item.key === data.key)
                data.condition = ''
                data.type = field.type
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
                this.change()
            },
            handleValChange (data, val) {
                data.value = val
                this.change()
            },
            handleAddExpression (index) {
                this.localVal.expressions.splice(index + 1, 0, {
                    key: '',
                    condition: '',
                    value: ''
                })
                this.change()
            },
            handleDeleteExpression (index) {
                if (this.localVal.expressions.length > 1) {
                    this.localVal.expressions.splice(index, 1)
                    this.change()
                }
            },
            change () {
                this.$emit('change', this.localVal)
            }
        }
    }
</script>
<style lang="postcss" scoped>
.condition-group {
  position: relative;
  padding: 16px;
  background: #fafbfd;
  border: 1px solid #dcdee5;
}
.close-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  color: #c4c6cc;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #3a84ff;
  }
}
.connector-rule {
  display: flex;
  align-items: center;
  height: 20px;
  & > label {
    position: relative;
    margin-right: 30px;
    color: #63656e;
    font-size: 14px;
    white-space: nowrap;
    &:after {
      content: '*';
      position: absolute;
      top: 50%;
      height: 8px;
      line-height: 1;
      color: #ea3636;
      font-size: 12px;
      transform: translate(3px, -50%);
    }
  }
}
.condition-list {
  margin-top: 20px;
}
.condition-item {
  position: relative;
  margin-top: 10px;
  padding-right: 46px;
}
.condition-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.operate-btns {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 38px;
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
.bk-select {
  background: #ffffff;
}
</style>
