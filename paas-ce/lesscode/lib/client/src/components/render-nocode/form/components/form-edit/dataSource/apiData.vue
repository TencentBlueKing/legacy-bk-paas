<template>
    <div class="api-wrapper">
        <bk-form ref="sourceForm" class="select-api" form-type="vertical" :rules="sourceRules" :model="localVal.api_info">
            <bk-form-item v-if="changeSource" label="数据源" :required="true">
                <bk-select value="API" :clearable="false" @change="$emit('sourceTypeChange', $event)">
                    <bk-option v-for="item in sourceTypeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="接入系统" property="remote_system_id" :required="true">
                <bk-select
                    v-model="localVal.api_info.remote_system_id"
                    placeholder="请选择系统"
                    :clearable="false"
                    :disabled="systemListLoading"
                    :loading="systemListLoading"
                    @selected="handleSelectSystem">
                    <bk-option v-for="item in systemList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="接口" property="remote_api_id" :required="true">
                <bk-select
                    v-model="localVal.api_info.remote_api_id"
                    placeholder="请选择接口"
                    :clearable="false"
                    :disabled="systemApisLoading"
                    :loading="systemApisLoading"
                    @selected="handleSelectApi">
                    <bk-option v-for="item in apiList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                </bk-select>
            </bk-form-item>
        </bk-form>
        <div class="api-data">
            <h4 class="section-title"><span v-bk-tooltips.top="'调用该API需要传递的参数信息'">请求参数</span></h4>
            <template v-if="apiDetail">
                <get-request-params
                    v-if="apiDetail.method === 'GET'"
                    :flow-id="flowId"
                    :node-id="nodeId"
                    :use-variable="useVariable"
                    :params="apiDetail.req_params"
                    :value="localVal.api_info.req_params"
                    @change="handleReqValChange">
                </get-request-params>
                <post-request-params
                    v-if="apiDetail.method === 'POST'"
                    :flow-id="flowId"
                    :node-id="nodeId"
                    :use-variable="useVariable"
                    :params="apiDetail.req_body"
                    :value="localVal.api_info.req_body"
                    @change="handleReqValChange">
                </post-request-params>
            </template>
            <bk-exception v-else type="empty" scene="part">请选择接入系统和接口</bk-exception>
        </div>
        <div class="response-data">
            <h4 class="section-title"><span v-bk-tooltips.top="'调用成功后API将会返回的参数信息'">返回数据</span></h4>
            <bk-form ref="resForm" class="response-select" form-type="vertical" :rules="resRules" :model="resFieldData">
                <bk-form-item label="选取数组类型字段" property="source" :required="true">
                    <bk-select placeholder="请选择字段" v-model="localVal.api_info.rsp_data" :clearable="false">
                        <bk-big-tree
                            :data="resArrayTreeData"
                            :selectable="true"
                            :default-selected-node="localVal.api_info.rsp_data"
                            @node-click="handleSelectResArray">
                        </bk-big-tree>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="选项key" property="key" :required="true">
                    <bk-select v-model="localVal.kv_relation.key" :clearable="false">
                        <bk-big-tree
                            :data="resFieldList"
                            :selectable="true"
                            :default-selected-node="localVal.kv_relation.key"
                            @node-click="handleResFieldChange($event, 'key')">
                        </bk-big-tree>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="选项name" property="name" :required="true">
                    <bk-select v-model="localVal.kv_relation.name" :clearable="false">
                        <bk-big-tree
                            :data="resFieldList"
                            :selectable="true"
                            :default-selected-node="localVal.kv_relation.name"
                            @node-click="handleResFieldChange($event, 'name')">
                        </bk-big-tree>
                    </bk-select>
                </bk-form-item>
            </bk-form>
        </div>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import GetRequestParams from './getRequestParams.vue'
    import PostRequestParams from './postRequestParams.vue'
    import { getSchemeDefaultValue, transSchemeToArrayTypeTree } from '../../../../common/apiScheme'

    export default {
        name: 'ApiData',
        components: {
            GetRequestParams,
            PostRequestParams
        },
        props: {
            changeSource: {
                type: Boolean,
                default: false
            },
            useVariable: {
                // 参数值是否支持引用变量
                type: Boolean,
                default: true
            },
            sourceTypeList: {
                type: Array,
                default: () => []
            },
            flowId: Number,
            nodeId: Number,
            value: Object
        },
        data () {
            return {
                localVal: cloneDeep(this.value),
                systemListLoading: false,
                systemList: [],
                systemApisLoading: false,
                apiList: [],
                apiDetail: null,
                resFieldData: { source: this.value.api_info.rsp_data, ...this.value.kv_relation },
                resArrayTreeData: [], // 返回数据中可选择的数组类型字段
                resFieldList: [], // 返回数据中可选择的关键字字段
                fieldList: [],
                sourceRules: {
                    remote_system_id: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '必填项'
                        }
                    ],
                    remote_api_id: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '必填项'
                        }
                    ]
                },
                resRules: {
                    source: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '必填项'
                        }
                    ],
                    key: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '必填项'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '必填项'
                        }
                    ]
                }
            }
        },
        watch: {
            value (val) {
                this.localVal = cloneDeep(val)
            }
        },
        created () {
            const { api_info: apiInfo } = this.value
            this.getSystems()
            if (apiInfo.remote_system_id !== '') {
                this.getSystemApis(apiInfo.remote_system_id, true)
            }
        },
        methods: {
            // 获取Api系统列表
            async getSystems () {
                try {
                    this.systemListLoading = true
                    const res = await this.$store.dispatch('formSetting/getRemoteSystem')
                    this.systemList = res.data.filter(item => item.is_activated)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.systemListLoading = false
                }
            },
            // 切换接入系统
            async handleSelectSystem (val) {
                this.localVal.api_info.remote_api_id = ''
                this.resetData()
                this.getSystemApis(val)
            },
            // 获取接入系统接口列表
            async getSystemApis (val, init = false) {
                try {
                    this.systemApisLoading = true
                    this.apiList = []
                    const res = await this.$store.dispatch('formSetting/getSystemApis', { remote_system: val })
                    this.apiList = res.data.filter(item => item.is_activated)
                    if (init) {
                        this.setFormData(this.localVal.api_info.remote_api_id)
                        this.resFieldList = this.getResFieldList(this.localVal.api_info.rsp_data.split('.'))
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.systemApisLoading = false
                }
            },
            setFormData (apiId) {
                this.apiDetail = this.apiList.find(item => item.id === apiId)
                this.resArrayTreeData = transSchemeToArrayTypeTree(this.apiDetail.rsp_data)
            },
            // 选择接口
            handleSelectApi (val) {
                this.resetData()
                this.setFormData(val)
                // 请求参数表单value
                if (this.apiDetail.method === 'GET') {
                    this.apiDetail.req_params.forEach(item => {
                        this.$set(this.localVal.api_info.req_params, item.name, item.value)
                    })
                } else {
                    this.localVal.api_info.req_body = getSchemeDefaultValue(this.apiDetail.req_body)
                }
            },
            // 请求参数修改
            handleReqValChange (val) {
                if (this.apiDetail.method === 'GET') {
                    this.localVal.api_info.req_params = val
                } else {
                    this.localVal.api_info.req_body = val
                }
                this.update()
            },
            // 选择返回数据的数组类型字段
            handleSelectArrayField (val) {
                this.resFieldData.source = val
                this.localVal.api_info.rsp_data = val.join('.')
                this.localVal.kv_relation = { key: '', name: '' }
                this.resFieldList = this.getResFieldList(val)
            },
            // 选择字段数组类型字段
            handleSelectResArray (node) {
                if (node.data.type === 'array') {
                    this.resFieldData.source = node.id.split('.')
                    this.localVal.api_info.rsp_data = node.id
                    this.localVal.kv_relation = { key: '', name: '' }
                    this.resFieldList = this.getResFieldList(node.id.split('.'))
                }
            },
            handleResFieldChange (node, key) {
                if (node.data.type !== 'object') {
                    this.resFieldData[key] = node.id
                    this.localVal.kv_relation[key] = node.id
                    this.update()
                }
            },
            getResFieldList (path) {
                const len = path.length
                return path.reduce((acc, crt, index) => {
                    const data = acc.properties[crt]
                    if (index === len - 1) {
                        const list = []
                        Object.keys(data.items.properties).forEach(key => {
                            const prop = data.items.properties[key]
                            if (['string', 'number', 'boolean'].includes(prop.type)) {
                                const field = { id: key, name: key, type: prop.type }
                                list.push(field)
                            } else if (prop.type === 'object') {
                                const field = { id: key, name: key, type: 'object', disabled: true, children: [] }
                                Object.keys(prop.properties).forEach(subKey => {
                                    const subProp = prop.properties[subKey]
                                    if (['string', 'number', 'boolean'].includes(subProp.type)) {
                                        field.children.push({ id: `${key}.${subKey}`, name: subKey, type: subProp.type })
                                    }
                                })
                                list.push(field)
                            }
                        })
                        return list
                    }
                    return data
                }, this.apiDetail.rsp_data)
            },
            update () {
                this.$emit('update', cloneDeep(this.localVal))
            },
            resetData () {
                this.localVal.api_info.req_params = {}
                this.localVal.api_info.req_body = {}
                this.localVal.api_info.rsp_data = ''
                this.localVal.kv_relation = { key: '', name: '' }
                this.resFieldData = { source: '', key: '', name: '' }
                this.resArrayTreeData = []
                this.apiDetail = null
            },
            validate () {
                this.$refs.resForm.validate()
                this.$refs.sourceForm.validate()
                const { remote_system_id: remoteSystemId, remote_api_id: remoteApiID, rsp_data: rspData } = this.localVal.api_info
                const { key, name } = this.localVal.kv_relation
                return [remoteSystemId, remoteApiID, rspData, key, name].every(item => item !== '')
            }
        }
    }
</script>
<style lang="postcss" scoped>
.api-wrapper {
  .select-api {
    display: flex;
    align-items: center;

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

    & > span {
      line-height: 20px;
      font-size: 14px;
      font-weight: normal;
      color: #63656e;
      border-bottom: 1px dashed #979ba5;
    }
  }

  .response-data {
    .response-select {
      display: flex;
      align-items: center;

      .bk-form-item {
        margin-top: 0;
        flex: 1;

        &:not(:last-of-type) {
          margin-right: 10px;
        }
      }
    }
  }

  .bk-form-item.is-error .bk-cascade {
    border-color: #ff5656;
  }
}
</style>
