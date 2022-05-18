<template>
    <div class="line-config">
        <div class="config-content-container">
            <div class="node-wrapper">
                <node-template :node="line.sNode" :single="true" :editable="false"></node-template>
                <div class="node-connector">
                    <span class="label-name"> {{ formData.name || '--' }} </span>
                </div>
                <node-template :node="line.tNode" :single="true" :editable="false"></node-template>
            </div>
            <bk-form ref="lineForm" form-type="vertical" :label-width="200" :model="formData" :rules="rules">
                <bk-form-item label="关系名称" error-display-type="normal" :property="'name'" :required="true">
                    <bk-input v-model.trim="formData.name" maxlength="120" placeholder="请输入关系名称"> </bk-input>
                </bk-form-item>
                <template v-if="line.canSetCondition">
                    <bk-form-item label="流转条件" :required="true">
                        <bk-select
                            v-model="formData.condition_type"
                            :clearable="false"
                            :searchable="false"
                            @selected="handleSelectConditionType">
                            <bk-option id="default" name="默认"> </bk-option>
                            <bk-option id="by_field" name="字段判断"> </bk-option>
                        </bk-select>
                    </bk-form-item>
                    <bk-form-item
                        v-if="formData.condition_type === 'by_field'"
                        label="条件组件关系"
                        desc="当所有条件组都满足且/或的条件时，节点才会流转"
                        desc-type="icon">
                        <line-condition ref="lineCondition" :condition="formData.condition" :line-id="line.id"></line-condition>
                    </bk-form-item>
                </template>
            </bk-form>
        </div>
        <div class="btns-wrapper">
            <bk-button theme="primary" :loading="savePending" :disabled="savePending" @click="onSaveClick">确认</bk-button>
            <bk-button :loading="deletePending" :disabled="savePending" @click="$emit('delete')">删除</bk-button>
            <bk-button :disabled="savePending || deletePending" @click="$emit('close')">取消</bk-button>
        </div>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import NodeTemplate from './nodeTemplate.vue'
    import LineCondition from './lineCondition.vue'

    export default {
        name: 'LineConfig',
        components: {
            NodeTemplate,
            LineCondition
        },
        props: {
            line: {
                type: Object,
                default: () => ({})
            },
            savePending: {
                type: Boolean,
                default: false
            },
            deletePending: {
                type: Boolean,
                default: false
            }
        },
        data () {
            const { name, condition_type, condition } = this.line
            return {
                formData: {
                    name,
                    condition_type,
                    condition: cloneDeep(condition)
                },
                templateListLoading: false,
                templateList: [],
                rules: {
                    name: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        watch: {
            line (val) {
                const { name, condition_type, condition } = val
                this.formData = {
                    name,
                    condition_type,
                    condition: cloneDeep(condition)
                }
            }
        },
        methods: {
            handleSelectConditionType (val) {
                if (val === 'default') {
                    this.formData.condition = {}
                } else {
                    this.formData.condition = {
                        type: 'and',
                        expressions: [
                            {
                                type: 'and',
                                expressions: [
                                    {
                                        key: '',
                                        condition: '',
                                        value: '',
                                        type: 'STRING',
                                        source: 'field'
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            onSaveClick () {
                let conditionValid = true
                if (this.formData.condition_type === 'by_field') {
                    conditionValid = this.$refs.lineCondition.validate()
                }
                this.$refs.lineForm.validate().then(() => {
                    if (conditionValid) {
                        if (this.$refs.lineCondition) {
                            const condition = this.$refs.lineCondition.getData()
                            this.formData.condition = condition
                        }
                        const { workflow, from_state, to_state, id } = this.line
                        const { name, condition_type, condition } = this.formData
                        const params = {
                            id,
                            data: { workflow, from_state, to_state, name, condition_type, condition }
                        }
                        this.$emit('save', params)
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
.line-config {
  height: calc(100vh - 60px);
}
.config-content-container {
  padding: 24px;
  height: calc(100% - 48px);
  overflow: auto;
}
.node-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  height: 70px;
  background: #f0f1f5;
  text-align: center;
}
.node-connector {
  position: relative;
  width: 230px;
  height: 20px;
  &:before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background: #c4c6cc;
  }
  &:after {
    content: '';
    position: absolute;
    top: 3px;
    right: 0px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent #c4c6cc;
  }
  .label-name {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    padding: 0 15px;
    height: 20px;
    max-width: 150px;
    line-height: 18px;
    color: #979ba5;
    font-size: 12px;
    background: #fff;
    border: 1px solid #c4c6cc;
    border-radius: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    z-index: 2;
  }
}
.btns-wrapper {
  padding: 0 24px;
  height: 48px;
  line-height: 48px;
  background: #fafbfd;
}
</style>
