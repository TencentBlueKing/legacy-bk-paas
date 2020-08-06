<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <section class="x-table-wrapper">
        <bk-container :col="12" class="operate-box">
            <bk-row>
                <bk-col :span="3">
                    <bk-button :theme="'primary'" @click="addDataSource" style="width: 120px;height: 32px">新建</bk-button>
                </bk-col>
                <bk-col :span="9" class="table-search-box">
                    <bk-input
                        placeholder="搜索ID、名称、创建人"
                        :clearable="true"
                        :right-icon="'bk-icon icon-search'"
                        v-model="keyword">
                    </bk-input>
                </bk-col>
            </bk-row>
        </bk-container>
        <bk-table
            empty-text="暂无数据"
            :data="filterTableData"
            :size="size"
            v-bkloading="{ isLoading: reloadTable }"
            :pagination="pagination"
            @page-change="handlePageChange"
            @page-limit-change="handlelimitChange">
            <bk-table-column label="ID" align="center" prop="cluster_config.cluster_id" width="60"></bk-table-column>
            <bk-table-column label="名称" width="250">
                <template slot-scope="props">
                    <div class="name-colour">{{props.row.cluster_config.cluster_name}}</div>
                </template>
            </bk-table-column>
            <bk-table-column label="地址" width="150">
                <template slot-scope="props">
                    {{ props.row.cluster_config.domain_name || '--'}}
                </template>
            </bk-table-column>
            <bk-table-column label="端口" width="120">
                <template slot-scope="props">
                    {{ props.row.cluster_config.port }}
                </template>
            </bk-table-column>
            <bk-table-column label="连接状态">
                <template slot-scope="props">
                    <span class="bk-badge bk-danger" v-if="props.row.cluster_config.state"></span>
                    <span class="bk-badge bk-warning" v-else></span>
                    <span>{{ props.row.cluster_config.state ? '成功' : '失败'}}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="创建人" prop="cluster_config.creator" width="120"></bk-table-column>
            <bk-table-column label="创建时间" prop="cluster_config.create_time" width="220"></bk-table-column>
            <bk-table-column label="操作" width="220">
                <template slot-scope="props">
                    <bk-button theme="primary" text :disabled="!props.row.is_editable" @click="editDataSource(props.row)">编辑</bk-button>
                    <bk-button theme="primary" text :disabled="!props.row.cluster_config.is_editable" @click="remove(props.row)">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <div v-if="isResetDialog">
            <bk-dialog
                v-model="dialog.show"
                class="dialog-sty"
                :title="dialog.title"
                :header-position="dialog.headerPosition"
                :width="dialog.width"
                :mask-close="dialog.maskClose"
                :show-footer="dialog.showFooter"
                @after-leave="resetDialog">
                <bk-form :model="properties" :label-width="120" ref="validateForm">
                    <bk-form-item label="名称" required :rules="rules.source_name" :property="'source_name'" style="width: 80%;">
                        <bk-input v-model="properties.source_name" placeholder="请输入" maxlength="50" :disabled="eidtDisabled"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="地址" required :rules="rules.es_host" :property="'es_host'" style="width: 80%;">
                        <bk-input v-model="properties.es_host" placeholder="请输入" :disabled="eidtDisabled"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="端口" required :rules="rules.es_port" :property="'es_port'" style="width: 80%;">
                        <bk-input type="number" :min="minNumber" :max="maxNumber" v-model="properties.es_port" placeholder="请输入" :disabled="eidtDisabled" @change="numberChange"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="用户名" style="width: 80%;">
                        <bk-input v-model="properties.es_user" placeholder="请输入"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="密码" style="width: 80%;">
                        <bk-input type="password" v-model="properties.es_password" placeholder="请输入"></bk-input>
                    </bk-form-item>
                </bk-form>
                <div class="bk-form-footer">
                    <bk-button theme="primary" :loading="submitStatus" @click.stop.prevent="addDataSourceHandler" class="mr10">确定</bk-button>
                    <bk-button theme="default" @click="cancelHandler">取消</bk-button>
                </div>
            </bk-dialog>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'x-table',
        components: {},
        props: {
            getTableListAjaxUrl: {
                type: String,
                default: '/data/getXTableData'
            },
            postEditTableListAjaxUrl: {
                type: String,
                default: '/data/getXTableData'
            },
            delTableListAjaxUrl: {
                type: String,
                default: '/data/getXTableData'
            }
        },
        data () {
            return {
                loader: '',
                number: '',
                maxNumber: 0,
                minNumber: 0,
                eidtDisabled: false,
                concatenate: {},
                states: {
                    key: '',
                    value: ''
                },
                keyword: '',
                tableData: [
                ],
                count: 0,
                size: 'small',
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                dialog: {
                    title: '',
                    showFooter: false,
                    show: false,
                    isEdit: false,
                    width: 680,
                    maskClose: false,
                    headerPosition: 'left'
                },
                reloadTable: true,
                editSourceId: '',
                doConnectivity: false,
                isDisabled: true,
                connectivity: {
                    result: '',
                    message: ''
                },
                submitStatus: false,
                formData: {
                    cluster_name: '',
                    domain_name: 'es',
                    port: '用户ES',
                    auth_info: {
                        username: '',
                        password: {}
                    }
                },
                properties: {
                    source_name: '',
                    es_host: '',
                    es_port: '',
                    es_user: '',
                    es_password: ''
                },
                cluster_config: {
                    cluster_name: '',
                    port: '',
                    username: '',
                    password: '',
                    cluster_id: ''
                },
                rules: {
                    source_name: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    es_host: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    es_port: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                },
                isResetDialog: true // 用于关闭弹窗后重置弹窗内表单验证状态
            }
        },
        computed: {
            filterTableData () {
                const keywordFilter = this.keyword ? (this.tableData.filter(item => {
                    if (item.cluster_config.cluster_name) {
                        return (item.cluster_config.cluster_name + item.cluster_config.creator + item.cluster_config.es_host).indexOf(this.keyword) > -1
                    } else {
                        return (item.source_name + item.updated_by).indexOf(this.keyword) > -1
                    }
                }) || []) : this.tableData
                this.pagination.count = keywordFilter.length
                const start = (this.pagination.current - 1) * this.pagination.limit
                const end = Math.min(keywordFilter.length, this.pagination.current * this.pagination.limit)
                const pageFilter = keywordFilter.slice(start, end)
                return pageFilter
            }
        },
        watch: {
            keyword (val) {
                this.pagination.current = 1
            },
            properties: {
                handler (val) {
                    this.isDisabled = true
                    this.connectivity.result = ''
                    this.connectivity.message = ''
                },
                deep: true
            }
        },
        created () {
            this.getTableData()
        },
        methods: {
            /**
             * 获取列表
             */
            async getTableData () {
                if (this.getTableListAjaxUrl) {
                    await this.$http.get(this.getTableListAjaxUrl, { ...this.systemInfo }).then(res => {
                        this.tableData = res.data.msg
                        this.reloadTable = false
                    })
                } else {
                    try {
                        const res = await this.$store.dispatch('getTable', { btn: 'btn1', delay: 1000 })
                        console.error(res)
                        this.tableData = res.data.msg
                        this.reloadTable = false
                    } catch (e) {
                        console.error(e)
                    }
                }
            },
            handlePageChange (page) {
                this.pagination.current = page
                // this.getTableData()
            },
            handlelimitChange (page) {
                if (this.pagination.limit !== page) {
                    this.pagination.limit = page
                    this.getTableData()
                }
            },
            /**
             * 新增弹窗
             */
            addDataSource () {
                this.dialog.title = '新建数据'
                this.eidtDisabled = false
                this.resetConnectivity() // 重置，防止上次编辑操作遗留数据
                this.dialog.show = true
            },
            numberChange (value, event) {
                if (this.dialog.isEdit) {
                    this.maxNumber = this.minNumber = this.properties.es_port = this.number
                } else {
                    this.minNumber = 0
                    this.maxNumber = 65535
                }
            },
            /**
             * 编辑
             */
            async editDataSource (obj) {
                this.eidtDisabled = true
                this.editSourceId = obj.cluster_config.cluster_id
                this.dialog.isEdit = true
                this.dialog.title = '编辑数据'
                this.dialog.show = true
                if (this.postEditTableListAjaxUrl) {
                    await this.$http.post(this.postEditTableListAjaxUrl, { ...this.editSourceId }).then(res => {
                        this.tableData = res.data.msg
                        this.reloadTable = false
                        if (res.data.msg[this.editSourceId - 1]) {
                            this.properties.source_name = res.data.msg[this.editSourceId - 1].cluster_config.cluster_name
                            this.properties.es_host = res.data.msg[this.editSourceId - 1].cluster_config.domain_name
                            this.number = this.properties.es_port = res.data.msg[this.editSourceId - 1].cluster_config.port
                            this.properties.es_user = res.data.msg[this.editSourceId - 1].cluster_config.username
                            this.properties.es_password = '******'
                            this.cluster_config.cluster_id = this.editSourceId
                        }
                    })
                } else {
                    try {
                        const res = await this.$store.dispatch('getTable', { btn: 'btn1', delay: 200 })
                        this.tableData = res.data.msg
                        this.reloadTable = false
                        console.log(res.data.msg[this.editSourceId])
                        if (res.data.msg[this.editSourceId - 1]) {
                            this.properties.source_name = res.data.msg[this.editSourceId - 1].cluster_config.cluster_name
                            this.properties.es_host = res.data.msg[this.editSourceId - 1].cluster_config.domain_name
                            this.number = this.properties.es_port = res.data.msg[this.editSourceId - 1].cluster_config.port
                            this.properties.es_user = res.data.msg[this.editSourceId - 1].cluster_config.username
                            this.properties.es_password = '******'
                            this.cluster_config.cluster_id = this.editSourceId
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            },
            /**
             * 删除
             */
            async remove (obj) {
                this.$bkInfo({
                    title: '是否删除',
                    maskClose: true,
                    confirmFn: () => {
                        this.$bkLoading({
                            opacity: 0.6
                        })
                        if (this.delTableListAjaxUrl) {
                            this.$http.get(this.delTableListAjaxUrl, { ...obj }).then(res => {
                                this.$bkLoading.hide()
                                this.reloadTable = true
                                this.getTableData()
                            })
                        } else {
                            try {
                                const data = this.$store.dispatch('example/remove', { btn: 'btn1', delay: 2000 })
                                this.$bkLoading.hide()
                                this.reloadTable = true
                                this.getTableData()
                                return data
                            } catch (e) {
                                console.error(e)
                            }
                        }
                    }
                })
            },
            addDataSourceHandler () {
                this.$refs.validateForm.validate().then(validator => {
                    this.cancelHandler()
                    this.reloadTable = true
                    this.getTableData()
                }, validator => {
                    console.log(validator)
                })
            },
            /**
             * 关闭弹窗
             */
            cancelHandler () {
                this.eidtDisabled = false
                this.dialog.show = false
                this.dialog.isEdit = false
                this.resetConnectivity()
            },
            resetDialog () {
                this.isResetDialog = false
                const vm = this
                setTimeout(function () {
                    vm.isResetDialog = true
                }, 200)
                this.resetConnectivity()
            },
            resetConnectivity () {
                for (const key in this.connectivity) {
                    this.connectivity[key] = ''
                }
                for (const key in this.properties) {
                    this.properties[key] = ''
                }
            }
        }
    }
</script>

<style scoped>
     @import './index.css';
</style>
