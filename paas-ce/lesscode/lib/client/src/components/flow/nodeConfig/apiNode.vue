<template>
    <div class="api-node-form">
        <bk-form form-type="vertical">
            <div class="select-api">
                <bk-form-item label="接入系统" :required="true">
                    <bk-select
                        v-model="formData.remote_system_id"
                        placeholder="请选择系统"
                        :clearable="false"
                        :searchable="true"
                        :disabled="systemListLoading || !editable"
                        :loading="systemListLoading"
                        @selected="handleSelectSystem">
                        <bk-option v-for="item in systemList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="接口" :required="true">
                    <bk-select
                        v-model="formData.remote_api_id"
                        placeholder="请选择接口"
                        :clearable="false"
                        :searchable="true"
                        :disabled="systemApisLoading || !editable"
                        :loading="systemApisLoading"
                        @selected="handleSelectApi">
                        <bk-option v-for="item in apiList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                    </bk-select>
                </bk-form-item>
            </div>
            <div class="api-data">
                <h4 class="section-title">
                    请求参数
                    <i class="bk-icon icon-question-circle" v-bk-tooltips.top="'调用该API需要传递的参数信息'"></i>
                </h4>
                <template v-if="apiDetail">
                    <get-request-params
                        v-if="apiDetail.method === 'GET'"
                        :node-id="node.id"
                        :flow-id="node.workflow"
                        :params="apiDetail.req_params"
                        :value="formData.getReqData"
                        @change="formData.getReqData = $event">
                    </get-request-params>
                    <post-request-params
                        v-if="apiDetail.method === 'POST'"
                        :node-id="node.id"
                        :flow-id="node.workflow"
                        :params="apiDetail.req_body"
                        :value="formData.postReqData"
                        @change="formData.postReqData = $event">
                    </post-request-params>
                </template>
                <bk-exception
                    v-else
                    type="empty"
                    scene="part"
                    style="padding-bottom: 30px; border: 1px solid #dfe0e5; border-radius: 2px">
                    请选择接入系统和接口
                </bk-exception>
            </div>
            <!-- 返回数据 -->
            <div class="response-data">
                <h4 class="section-title">
                    返回数据
                    <i class="bk-icon icon-question-circle" v-bk-tooltips.top="'调用成功后API将会返回的参数信息'"></i>
                </h4>
                <div class="form-area">
                    <bk-table :data="resParamsTable">
                        <bk-table-column label="名称" class-name="key-col">
                            <template slot-scope="props">
                                <div class="key" :style="{ marginLeft: `${props.row.level * 28}px` }">
                                    <i
                                        v-if="'extend' in props.row"
                                        :class="['bk-icon', 'icon-right-shape', 'fold-icon', { extend: props.row.extend }]"
                                        @click="handleResParamExtend(props.row)">
                                    </i>
                                    {{ props.row.key }}
                                </div>
                            </template>
                        </bk-table-column>
                        <bk-table-column label="类型" property="type" width="80"></bk-table-column>
                        <bk-table-column label="必须" width="60">
                            <template slot-scope="props">{{ props.row.required ? '是' : '否' }}</template>
                        </bk-table-column>
                        <bk-table-column show-overflow-tooltip label="备注">
                            <template slot-scope="props">{{ props.row.description || '--' }}</template>
                        </bk-table-column>
                        <bk-table-column label="引用为全局变量" width="180" fixed="right">
                            <template slot-scope="props">
                                <div v-if="props.row.canSetOutput" class="set-global-var">
                                    <bk-checkbox :value="props.row.setOutput" @change="handleChangeSetOutput($event, props.row)">
                                    </bk-checkbox>
                                    <bk-input
                                        v-model="props.row.value"
                                        behavior="simplicity"
                                        style="width: 120px; margin-left: 4px"
                                        placeholder="请输入变量名称"
                                        :clearable="true"
                                        :disabled="!props.row.setOutput"
                                        @change="handleOutputValChange($event, props.row)">
                                    </bk-input>
                                </div>
                                <span v-else>--</span>
                            </template>
                        </bk-table-column>
                    </bk-table>
                </div>
            </div>
            <!-- 轮询配置 -->
            <div class="poll-config">
                <h4 class="section-title">
                    轮询配置
                    <i class="bk-icon icon-question-circle" v-bk-tooltips.top="'当出现异常时，设置重试及结束的条件'"></i>
                </h4>
                <bk-form-item>
                    <bk-switcher
                        v-model="formData.need_poll"
                        theme="primary"
                        size="small"
                        :disable="!editable"
                        @change="handleTogglePoll">
                    </bk-switcher>
                </bk-form-item>
                <div v-show="formData.need_poll" class="poll-form-area">
                    <bk-radio-group v-model="formData.succeed_conditions.type">
                        <bk-radio value="and" :disable="!editable">且</bk-radio>
                        <bk-radio value="or" :disable="!editable">或</bk-radio>
                    </bk-radio-group>
                    <div
                        v-for="(group, index) in formData.succeed_conditions.expressions"
                        class="condition-group-wrapper"
                        :key="index">
                        <div class="group-title">
                            {{ formData.succeed_conditions.type === 'and' ? '且' : '或' }}-条件组{{ index + 1 }}
                        </div>
                        <div class="condition-content">
                            <div class="field-relation">
                                <span>字段间关系</span>
                                <bk-radio-group v-model="group.type">
                                    <bk-radio value="and" :disable="!editable">且</bk-radio>
                                    <bk-radio value="or" :disable="!editable">或</bk-radio>
                                </bk-radio-group>
                            </div>
                            <i
                                :class="[
                                    'bk-icon',
                                    'icon-close',
                                    'delete-icon',
                                    {
                                        disabled: group.expressions.length === 1 || !editable
                                    }
                                ]"
                                @click="handleDeleteGroup(index)"></i>
                            <div v-for="(item, i) in group.expressions" class="expression-item" :key="i">
                                <bk-cascade
                                    style="width: 178px; margin-right: 8px; background: #fff"
                                    placeholder="请选择字段"
                                    :value="item.key ? item.key.split('.') : []"
                                    :list="resParamsTree"
                                    :clearable="false"
                                    :disable="!editable"
                                    @change="handleConditionFieldChange(arguments, item)">
                                </bk-cascade>
                                <bk-select
                                    v-model="item.condition"
                                    style="width: 126px; margin-right: 8px; background: #fff"
                                    placeholder="请选择逻辑关系"
                                    :clearable="false"
                                    :disable="!editable">
                                    <bk-option
                                        v-for="relation in relationList"
                                        :id="relation.key"
                                        :key="relation.key"
                                        :name="relation.name">
                                    </bk-option>
                                </bk-select>
                                <bk-select
                                    v-if="item.type === 'boolean'"
                                    v-model="item.value"
                                    style="width: 178px; margin-right: 8px; background: #fff"
                                    :clearable="false"
                                    :disable="!editable">
                                    <bk-option :id="true" name="true"></bk-option>
                                    <bk-option :id="false" name="false"></bk-option>
                                </bk-select>
                                <bk-input
                                    v-else
                                    v-model="item.value"
                                    style="width: 178px; margin-right: 8px"
                                    :type="item.type === 'number' ? 'number' : 'text'"
                                    placeholder="请输入比较值"
                                    :disable="!editable">
                                </bk-input>
                                <div class="opt-btns">
                                    <i class="custom-icon-font icon-add-circle" @click="handleAddCondition(i, index)"></i>
                                    <i
                                        :class="[
                                            'custom-icon-font',
                                            'icon-reduce-circle',
                                            'delete-condition-icon',
                                            { disabled: group.expressions.length === 1 || !editable }
                                        ]"
                                        @click="handleDeleteCondition(i, index)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="create-group-btn">
                        <span @click="handleAddGroup">
                            <i class="bk-icon icon-plus-circle" style="margin-right: 4px"></i>添加条件组
                        </span>
                    </div>
                    <div class="poll-setting">
                        <bk-form-item class="time-interval-form" label="轮询间隔">
                            <bk-input v-model="formData.end_conditions.poll_interval" type="number" :min="1" :disable="!editable">
                            </bk-input>
                            <span class="time-unit">秒</span>
                        </bk-form-item>
                        <bk-form-item label="轮询次数">
                            <bk-input v-model="formData.end_conditions.poll_time" type="number" :min="1" :disable="!editable">
                            </bk-input>
                        </bk-form-item>
                    </div>
                </div>
            </div>
        </bk-form>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { transSchemeToList, transSchemeToFieldTree, getSchemeDefaultValue } from '@/components/render-nocode/common/apiScheme.js'
    import GetRequestParams from '@/components/render-nocode/form/components/form-edit/dataSource/getRequestParams.vue'
    import PostRequestParams from '@/components/render-nocode/form/components/form-edit/dataSource/postRequestParams.vue'

    export default {
        name: 'ApiNode',
        components: {
            GetRequestParams,
            PostRequestParams
        },
        props: {
            node: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                systemListLoading: false,
                systemList: [],
                systemApisLoading: false,
                apiList: [],
                apiDetail: null,
                resParams: [], // 返回数据字段列表
                resParamsTable: [], // 表格中显示的字段
                resParamsTree: [], // 轮询配置需要使用的字段，返回数据去掉array类型
                formData: this.getInitialFormData(),
                variables: this.getInitialVar(),
                relationList: [
                    { name: '>=', key: '>=' },
                    { name: '>', key: '>' },
                    { name: '=', key: '==' },
                    { name: '<=', key: '<=' },
                    { name: '<', key: '<' }
                ]
            }
        },
        created () {
            this.getSystems()
            if (this.node.api_info && 'remote_system_id' in this.node.api_info) {
                this.getSystemApis(this.node.api_info.remote_system_id)
                this.apiDetail = this.node.api_info.remote_api_info
                this.setResParamsData()
            }
        },
        methods: {
            getInitialFormData () {
                if (this.node.api_info) {
                    const {
                        remote_system_id,
                        remote_api_id,
                        end_conditions,
                        need_poll,
                        req_body,
                        req_params,
                        rsp_data,
                        succeed_conditions
                    } = cloneDeep(this.node.api_info)
                    return {
                        remote_system_id,
                        remote_api_id,
                        end_conditions,
                        need_poll,
                        postReqData: req_body,
                        getReqData: req_params,
                        resData: rsp_data ? rsp_data.split(',') : [],
                        succeed_conditions
                    }
                }
                return {
                    remote_system_id: '',
                    remote_api_id: '',
                    end_conditions: { poll_interval: 1, poll_time: 3 },
                    need_poll: false,
                    getReqData: {},
                    postReqData: {},
                    resData: [],
                    succeed_conditions: { expressions: [], type: 'and' }
                }
            },
            getInitialVar () {
                const { inputs, outputs } = this.node.variables
                return { inputs: [...inputs], outputs: [...outputs] }
            },
            // 获取Api系统列表
            async getSystems () {
                try {
                    this.systemListLoading = true
                    const res = await this.$store.dispatch('setting/getRmoteSystem')
                    this.systemList = res.data.filter(item => item.is_activated)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.systemListLoading = false
                }
            },
            // 获取接入系统接口列表
            async getSystemApis (val) {
                try {
                    this.systemApisLoading = true
                    this.apiList = []
                    const res = await this.$store.dispatch('setting/getSystemApis', { remote_system: val })
                    this.apiList = res.data.filter(item => item.is_activated)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.systemApisLoading = false
                }
            },
            // 切换接入系统
            handleSelectSystem (val) {
                this.formData.remote_api_id = null
                this.apiDetail = null
                this.resParams = []
                this.resParamsTable = []
                this.resetData()
                this.getSystemApis(val)
            },
            // 选择接口
            handleSelectApi (val) {
                this.resetData()
                this.apiDetail = this.apiList.find(item => item.id === val)
                // 请求参数表单value
                if (this.apiDetail.method === 'GET') {
                    this.apiDetail.req_params.forEach(item => {
                        this.$set(this.formData.getReqData, item.name, item.value)
                    })
                } else {
                    this.formData.postReqData = getSchemeDefaultValue(this.apiDetail.req_body)
                }
                this.setResParamsData()
            },
            // 引用或取消引用全局变量
            handleChangeSetOutput (val, param) {
                console.log(val, param)
                param.setOutput = val
                const pathStr = this.getParamPath(param, this.resParamsTable).join('.')
                console.log(pathStr)
                if (val) {
                    this.formData.resData.push(pathStr)
                    this.variables.outputs.push({
                        name: param.key,
                        ref_path: pathStr,
                        source: 'global',
                        type: 'STRING'
                    })
                    param.value = param.key
                } else {
                    this.formData.resData = this.formData.resData.filter(item => item !== pathStr)
                    this.variables.outputs = this.variables.outputs.filter(item => item.ref_path !== pathStr)
                    param.value = ''
                }
            },
            handleOutputValChange (val, param) {
                const pathStr = this.getParamPath(param, this.resParamsTable).join('.')
                const index = this.variables.outputs.findIndex(item => item.ref_path === pathStr)
                if (index > -1) {
                    const varItem = this.variables.outputs[index]
                    this.variables.outputs.splice(index, 1, { ...varItem, name: val })
                }
            },
            // 返回数据参数展开、收起
            handleResParamExtend (prop) {
                prop.extend = !prop.extend
                if (prop.extend) {
                    // 展开
                    const index = this.resParams.findIndex(item => item.id === prop.id)
                    const list = []
                    this.resParams.slice(index + 1).some(item => {
                        if (item.level > prop.level) {
                            const parentParam = this.resParams.find(p => p.id === item.parentId)
                            if (parentParam.extend) {
                                list.push(item)
                            }
                            return false
                        }
                        return true
                    })
                    this.resParamsTable.splice(index + 1, 0, ...list)
                } else {
                    // 收起
                    let num = 0
                    const index = this.resParamsTable.findIndex(item => item.id === prop.id)
                    this.resParamsTable.slice(index + 1).some(item => {
                        if (item.level > prop.level) {
                            num += 1
                            return false
                        }
                        return true
                    })
                    this.resParamsTable.splice(index + 1, num)
                }
            },
            setResParamsData () {
                // 返回数据
                const resParams = []
                transSchemeToList(this.apiDetail.rsp_data, resParams)
                this.resParams = resParams.map(param => {
                    let parentType
                    let value = ''
                    let setOutput = false
                    if (param.parentId) {
                        const parentParam = resParams.find(item => item.id === param.parentId)
                        parentType = parentParam.type
                    }
                    const canSetOutput = parentType !== 'array' && !['array', 'object'].includes(param.type)
                    const paramPath = this.getParamPath(param, resParams)
                    const outputVar = this.variables.outputs.find(item => item.ref_path === paramPath.join('.'))
                    if (outputVar) {
                        setOutput = true
                        value = outputVar.name
                    }
                    return { ...param, canSetOutput, setOutput, value }
                })
                this.resParamsTable = this.resParams.slice(0)
                this.resParamsTree = transSchemeToFieldTree(this.apiDetail.rsp_data, ['array'])
            },
            // 获取字段路径
            getParamPath (param, list) {
                let path = [param.key]
                if (param.parentId) {
                    const parentParam = list.find(item => item.id === param.parentId)
                    const parentPath = this.getParamPath(parentParam, list)
                    path = [...parentPath, ...path]
                }
                return path
            },
            // 打开轮询配置，若为空则默认添加一组
            handleTogglePoll (val) {
                if (val && this.formData.succeed_conditions.expressions.length === 0) {
                    this.handleAddGroup()
                }
            },
            // 新增轮询分组条件
            handleAddGroup () {
                this.formData.succeed_conditions.expressions.push({
                    type: 'and',
                    expressions: [
                        {
                            condition: '',
                            key: '',
                            source: 'global',
                            type: '',
                            value: ''
                        }
                    ]
                })
            },
            // 删除轮询分组条件
            handleDeleteGroup (index) {
                if (this.formData.succeed_conditions.expressions.length === 1) {
                    return
                }
                this.formData.succeed_conditions.expressions.splice(index, 1)
            },
            // 增加单条条件
            handleAddCondition (index, groupIndex) {
                console.log(index)
                this.formData.succeed_conditions.expressions[groupIndex].expressions.splice(index + 1, 0, {
                    condition: '',
                    key: '',
                    source: 'global',
                    type: '',
                    value: ''
                })
            },
            // 删除单条条件
            handleDeleteCondition (index, groupIndex) {
                if (this.formData.succeed_conditions.expressions[groupIndex].expressions.length === 1) {
                    return
                }
                this.formData.succeed_conditions.expressions[groupIndex].expressions.splice(index, 1)
            },
            // 选择条件字段
            handleConditionFieldChange (args, exp) {
                const key = args[0].join('.')
                const type = args[2][args[2].length - 1].type
                exp.key = key
                exp.type = type
            },
            resetData () {
                this.formData.getReqData = {}
                this.formData.postReqData = {}
                this.formData.resData = []
                this.formData.succeed_conditions = { type: 'or', expressions: [] }
                this.formData.need_poll = false
                this.variables = { inputs: [], outputs: [] }
                this.resParamsTree = []
            },
            getData () {
                const {
                    remote_system_id,
                    remote_api_id,
                    end_conditions,
                    need_poll,
                    postReqData,
                    getReqData,
                    resData,
                    succeed_conditions
                } = this.formData
                let succeedConditions
                if (!need_poll) {
                    succeedConditions = { type: 'or', expressions: [] }
                } else {
                    const expressions = []
                    succeed_conditions.expressions.forEach(group => {
                        const groupCondition = cloneDeep(group)
                        groupCondition.expressions = group.expressions.filter(item => item.key && item.condition && item.value)
                        if (groupCondition.expressions.length > 0) {
                            expressions.push(groupCondition)
                        }
                    })
                    succeedConditions = { type: 'or', expressions }
                }
                return {
                    api_info: {
                        remote_system_id,
                        remote_api_id,
                        end_conditions,
                        need_poll,
                        req_body: postReqData,
                        req_params: getReqData,
                        rsp_data: resData.join(','),
                        succeed_conditions: succeedConditions
                    },
                    variables: this.variables
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
.api-node-form {
  margin-top: 24px;
  .select-api {
    display: flex;
    align-items: center;
    justify-content: space-betweent;
    .bk-form-item {
      margin-top: 0;
      flex: 1;
      &:not(:last-of-type) {
        margin-right: 10px;
      }
    }
  }
  .section-title {
    margin: 24px 0 8px;
    line-height: 20px;
    font-size: 14px;
    font-weight: normal;
    color: #63656e;
    i {
      color: #979ba5;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .response-data {
    /deep/ .key-col {
      font-size: 12px;
      .cell {
        -webkit-line-clamp: initial;
        text-overflow: initial;
        white-space: nowrap;
      }
    }
    .key {
      position: relative;
      .fold-icon {
        position: absolute;
        top: 2px;
        left: -15px;
        display: inline-block;
        color: #c0c4cc;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        &:hover {
          color: #3a84ff;
        }
        &.extend {
          transform: rotate(90deg);
        }
      }
    }
    .set-global-var {
      display: flex;
      align-items: center;
    }
  }
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
    .field-relation {
      display: flex;
      align-items: center;
      & > span {
        margin-right: 30px;
        font-size: 14px;
        color: #63656e;
        white-space: nowrap;
      }
    }
    .expression-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:first-of-type) {
        margin-top: 16px;
      }
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
    &:not(.disabled):hover {
      color: #3a84ff;
    }
    &.disabled {
      cursor: not-allowed;
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
.poll-form-area {
  margin-top: 10px;
  .poll-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .bk-form-item {
      flex: 1;
      margin-top: 0;
      &.time-interval-form {
        margin-right: 24px;
        /deep/.bk-form-control {
          position: relative;
          padding-right: 42px;
        }
      }
      .time-unit {
        position: absolute;
        top: 1px;
        right: 1px;
        display: inline-block;
        width: 42px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        text-align: center;
        color: #63656e;
        border: 1px solid #c4c6cc;
        border-left: none;
        border-radius: 0 2px 2px 0;
      }
    }
  }
}
</style>
