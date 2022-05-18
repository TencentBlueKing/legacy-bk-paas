<template>
    <div class="sign-node-form">
        <bk-form form-type="vertical">
            <bk-form-item label="处理方式" :required="true">
                <bk-radio-group v-model="formData.isSequential">
                    <bk-radio :value="false">
                        多人随机会签
                        <i class="bk-icon bk-info" v-bk-tooltips="'要求所有处理人全部处理完成，多人处理没有先后顺序要求。'"></i>
                    </bk-radio>
                    <bk-radio :value="true">
                        多人依次会签
                        <i class="bk-icon bk-info" v-bk-tooltips="'要求所有处理人按照名单顺序，依次全部处理完成。'"></i>
                    </bk-radio>
                </bk-radio-group>
            </bk-form-item>
            <bk-form-item
                style="margin-top: 18px"
                label="提前结束条件"
                desc="默认结束条件：所有处理人处理完成，会签自动结束；若配置了会签提前结束条件，满足条件，将提前结束"
                desc-type="icon">
                <bk-switcher v-model="formData.earlyTermination" theme="primary" size="small"></bk-switcher>
                <template v-if="formData.earlyTermination">
                    <div
                        v-for="(group, index) in formData.finishCondition.expressions"
                        class="condition-group-wrapper"
                        :key="index">
                        <p class="group-title">或-条件组{{ index + 1 }}</p>
                        <div class="condition-content">
                            <div v-for="(expression, i) in group.expressions" class="expression-item" :key="i">
                                <bk-select
                                    style="width: 172px; margin-right: 8px; background: #fff"
                                    :clearable="false"
                                    :loading="conditionListLoading"
                                    :value="expression.key"
                                    @selected="handleSelectCondition($event, expression)">
                                    <bk-option v-for="item in conditionList" :key="item.key" :id="item.key" :name="item.name"></bk-option>
                                </bk-select>
                                <bk-select
                                    v-model="expression.condition"
                                    style="width: 128px; margin-right: 8px; background: #fff"
                                    :clearable="false">
                                    <bk-option v-for="item in relationList" :key="item.key" :id="item.key" :name="item.name"></bk-option>
                                </bk-select>
                                <div class="value-wrapper" style="width: 178px; margin-right: 8px; position: relative">
                                    <bk-input
                                        v-model="expression.value"
                                        v-bk-tooltips="{
                                            disabled: processorLength > 0,
                                            content: '请选择处理人',
                                            placements: ['top']
                                        }"
                                        type="number"
                                        :clearable="false"
                                        :disabled="!expression.key || processorLength === 0"
                                        :max="expression.meta.unit === 'INT' ? processorLength : 100"
                                        :min="0"
                                        :precision="0">
                                    </bk-input>
                                    <span v-if="expression.meta.unit === 'PERCENT'" class="percent-icon">%</span>
                                </div>
                                <div class="opt-btns">
                                    <i class="custom-icon-font icon-add-circle" @click="handleAddCondition(i, index)"></i>
                                    <i
                                        :class="[
                                            'custom-icon-font',
                                            'icon-reduce-circle',
                                            'delete-condition-icon',
                                            { disabled: group.expressions.length === 1 }
                                        ]"
                                        @click="handleDeleteCondition(i, index)"></i>
                                </div>
                            </div>
                        </div>
                        <i class="bk-icon icon-close delete-icon" @click="handleDeleteGroup(index)"></i>
                    </div>
                    <div class="create-group-btn">
                        <span @click="handleAddGroup">
                            <i class="bk-icon icon-plus-circle" style="margin-right: 4px"></i>添加“或”条件组
                        </span>
                    </div>
                </template>
            </bk-form-item>
            <node-fields-table
                style="margin-top: 16px"
                :node="node"
                :app-id="appId"
                :func-id="funcId"
                :flow-id="flowId"
                :related-form="relatedForm"
                @updateFieldIds="$emit('updateFieldIds', $event)">
            </node-fields-table>
        </bk-form>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import NodeFieldsTable from './components/nodeFieldsTable.vue'

    export default {
        name: 'SignNode',
        components: {
            NodeFieldsTable
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
            funcId: [String, Number],
            flowId: Number,
            relatedForm: {
                type: Array,
                default: () => []
            },
            processors: String
        },
        data () {
            return {
                formData: this.getInitialFormData(this.node),
                conditionListLoading: false,
                conditionList: [],
                relationList: [
                    { name: '>=', key: '>=' },
                    { name: '>', key: '>' },
                    { name: '=', key: '==' },
                    { name: '<=', key: '<=' },
                    { name: '<', key: '<' }
                ]
            }
        },
        computed: {
            processorLength () {
                return this.processors.length > 0 ? this.processors.split(',').length : 0
            }
        },
        watch: {
            node (val) {
                this.formData = this.getInitialFormData(val.finish_condition)
            }
        },
        created () {
            this.getConditionList()
        },
        methods: {
            getInitialFormData (node) {
                let earlyTermination = false
                const { is_sequential, finish_condition } = node
                let expressions
                if (finish_condition.expressions && finish_condition.expressions.length > 0) {
                    expressions = finish_condition.expressions
                    earlyTermination = true
                } else {
                    expressions = [{ type: 'and', expressions: [this.getEmptyExp()] }]
                }
                return {
                    isSequential: is_sequential,
                    earlyTermination,
                    finishCondition: { expressions, type: 'or' }
                }
            },
            getEmptyExp () {
                return {
                    key: '',
                    condition: '>=',
                    value: '',
                    source: 'global',
                    type: 'INT',
                    meta: {
                        code: '',
                        unit: 'INT'
                    }
                }
            },
            // 获取提前结束可选条件
            async getConditionList () {
                try {
                    this.conditionListLoading = true
                    const res = await this.$store.dispatch('setting/getSignNodeConditions', this.node.id)
                    this.conditionList = res.data.filter(item => item.meta.code !== 'NODE_APPROVE_RESULT')
                } catch (e) {
                    console.error(e)
                } finally {
                    this.conditionListLoading = false
                }
            },
            handleAddGroup () {
                this.formData.finishCondition.expressions.push({ type: 'and', expressions: [this.getEmptyExp()] })
            },
            handleDeleteGroup (index) {
                if (this.formData.finishCondition.expressions.length === 1) {
                    this.$bkInfo({
                        type: 'warning',
                        title: '确定删除唯一的条件组？',
                        subTitle: '若删除，则必须所有人处理完成才结束',
                        confirmFn: () => {
                            this.formData.finishCondition.expressions.splice(index, 1)
                        }
                    })
                } else {
                    this.formData.finishCondition.expressions.splice(index, 1)
                }
            },
            handleAddCondition (index, groupIndex) {
                this.formData.finishCondition.expressions[groupIndex].expressions.splice(index + 1, 0, this.getEmptyExp())
            },
            handleDeleteCondition (index, groupIndex) {
                if (this.formData.finishCondition.expressions[groupIndex].expressions.length === 1) {
                    return
                }
                this.formData.finishCondition.expressions[groupIndex].expressions.splice(index, 1)
            },
            handleSelectCondition (val, exp) {
                const condition = this.conditionList.find(item => item.key === val)
                const { code, unit } = condition.meta
                exp.key = val
                exp.meta.code = code
                exp.meta.unit = unit || 'INT'
            },
            getData () {
                const { isSequential, finishCondition } = this.formData
                let conditions
                if (!this.formData.earlyTermination) {
                    conditions = { type: 'or', expressions: [] }
                } else {
                    const expressions = []
                    finishCondition.expressions.forEach(group => {
                        const groupCondition = cloneDeep(group)
                        groupCondition.expressions = group.expressions.filter(item => item.key && item.condition && item.value)
                        if (groupCondition.expressions.length > 0) {
                            expressions.push(groupCondition)
                        }
                    })
                    conditions = { type: 'or', expressions }
                }
                return { isSequential, finishCondition: conditions }
            }
        }
    }
</script>
<style lang="postcss" scoped>
.sign-node-form {
  margin-top: 24px;
}
.condition-group-wrapper {
  position: relative;
  margin-top: 10px;
  .group-title {
    margin-bottom: 6px;
    color: #63656e;
    font-weight: 700;
    font-size: 14px;
  }
  .condition-content {
    padding: 24px;
    background: #fafbfd;
    border: 1px solid #dcdee5;
    .expression-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:first-of-type) {
        margin-top: 16px;
      }
    }
    .percent-icon {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 30px;
      top: 2px;
      right: 1px;
      color: #63656e;
      font-size: 12px;
      border-left: 1px solid #c4c6cc;
      background: #f2f4f8;
    }
    .opt-btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 40px;
      i {
        color: #c4c6cc;
        cursor: pointer;
        &:not(.disabled):hover {
          color: #979ba5;
        }
        &.disabled {
          cursor: not-allowed;
        }
      }
    }
  }
  .delete-icon {
    position: absolute;
    top: 40px;
    right: 6px;
    font-size: 18px;
    color: #c4c6cc;
    cursor: pointer;
    &:hover {
      color: #3a84ff;
    }
  }
}
.create-group-btn {
  & > span {
    display: inline-flex;
    align-items: center;
    margin-top: 15px;
    font-size: 14px;
    line-height: 1;
    color: #3a84ff;
    cursor: pointer;
  }
}
</style>
