<template>
    <article class="function-manage-home">
        <section class="function-main">
            <h3 class="function-head">
                <section>
                    <bk-button theme="primary" @click="handleCreateFunction">新建</bk-button>
                    <bk-button @click="showImport = true" class="ml5" :loading="isUploading">导入</bk-button>
                    <bk-button @click="exportFunction" class="ml5" :disabled="selectionData.length <= 0">导出</bk-button>
                </section>

                <bk-input
                    class="head-input"
                    placeholder="请输入"
                    right-icon="bk-icon icon-search"
                    clearable
                    v-model="searchFunStr"
                ></bk-input>
            </h3>

            <bk-table
                class="function-table"
                :data="functionList"
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                v-bkloading="{ isLoading: isLoadingFunc }"
                @selection-change="selectionChange"
            >
                <bk-table-column type="selection" width="60"></bk-table-column>
                <bk-table-column label="函数名称" prop="funcName" show-overflow-tooltip>
                    <template slot-scope="props">
                        <span>{{ props.row.funcName || '--' }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="函数标识" prop="funcCode" show-overflow-tooltip>
                    <template slot-scope="props">
                        <span>{{ props.row.funcCode || '--' }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="所属分类" show-overflow-tooltip>
                    {{ groupName }}
                </bk-table-column>
                <bk-table-column label="简介" prop="funcSummary" show-overflow-tooltip>
                    <template slot-scope="props">
                        <span>{{ props.row.funcSummary || '--' }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="更新人" prop="updateUser"></bk-table-column>
                <bk-table-column label="更新时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip sortable></bk-table-column>
                <bk-table-column label="引用" show-overflow-tooltip>
                    <template slot-scope="props">
                        <span
                            v-bk-tooltips.light="{
                                content: getUseInfoTips(props.row.useInfo).join('<br>'),
                                disabled: !getUseInfoTips(props.row.useInfo).length
                            }"
                            class="use-info"
                        >
                            {{ getUseInfoTips(props.row.useInfo).length }}
                        </span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作" width="180">
                    <template slot-scope="props">
                        <span class="table-btn" @click="handleEditFunction(props.row)">编辑</span>
                        <span class="table-btn" @click="handleCopyFunction(props.row)">复制</span>
                        <span @click="handleDeleteFunction(props.row)"
                            v-bk-tooltips="{ content: getDeleteStatus(props.row), disabled: !getDeleteStatus(props.row) }"
                            :class="{ 'table-btn': true, disable: getDeleteStatus(props.row) }"
                        >删除</span>
                    </template>
                </bk-table-column>
            </bk-table>
        </section>

        <edit-func-sideslider
            :is-show="funcObj.show"
            :func-data="funcObj.form"
            :is-edit="funcObj.isEdit"
            :title="funcObj.title"
            @close="handleClose"
            @success-submit="freshList"
        />

        <bk-dialog v-model="delObj.show"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="确定删除？"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
        >
            <p class="delete-content">{{ delObj.nameTips }}</p>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="delObj.loading"
                    @click="requestDelete">删除</bk-button>
                <bk-button @click="delObj.show = false" :disabled="delObj.loading">取消</bk-button>
            </div>
        </bk-dialog>

        <import-function-dialog
            :show.sync="showImport"
            :loading="isUploading"
            @import="handleImport"
        >
            <bk-button @click="exportDemoFunction">示例</bk-button>
        </import-function-dialog>
    </article>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import dayjs from 'dayjs'
    import EditFuncSideslider from '@/components/methods/forms/edit-func-sideslider.vue'
    import ImportFunctionDialog from '@/components/methods/import-function-dialog.vue'
    import { getExportFunction } from 'shared/function'
    import { downloadFile } from '@/common/util.js'

    export default {
        components: {
            EditFuncSideslider,
            ImportFunctionDialog
        },

        props: {
            groupId: [String, Number],
            groupName: String
        },

        data () {
            return {
                searchFunStr: '',
                isLoadingFunc: false,
                delObj: {
                    id: '',
                    loading: false,
                    show: false
                },
                funcObj: {
                    show: false,
                    isEdit: false,
                    form: {}
                },
                functionList: [],
                selectionData: [],
                isUploading: false,
                showImport: false
            }
        },

        computed: {
            ...mapGetters(['user']),
            ...mapGetters('member', ['userPerm']),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId', versionName: 'currentVersionName' }),

            projectId () {
                return parseInt(this.$route.params.projectId)
            },

            computedFunctionList () {
                const searchReg = new RegExp(this.searchFunStr, 'i')
                return this.functionList.filter((func) => searchReg.test(func.funcName))
            }
        },

        watch: {
            groupId: {
                handler (val) {
                    if (![undefined, ''].includes(val)) {
                        this.initData()
                    }
                },
                immediate: true
            }
        },

        methods: {
            ...mapActions('functions', [
                'getFunctionList',
                'bulkCreateFunction',
                'deleteFunction'
            ]),

            initData () {
                this.isLoadingFunc = true
                this.getFunctionList({
                    funcGroupId: this.groupId,
                    projectId: this.projectId,
                    versionId: this.versionId
                }).then((res) => {
                    this.functionList = res
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoadingFunc = false
                })
            },

            handleCreateFunction () {
                this.funcObj.show = true
                this.funcObj.isEdit = false
                this.funcObj.title = '新增函数'
                this.funcObj.form = {
                    funcGroupId: this.groupId,
                    projectId: this.projectId
                }
            },

            handleEditFunction (row) {
                this.funcObj.show = true
                this.funcObj.isEdit = true
                this.funcObj.title = '编辑函数'
                this.funcObj.form = row
            },

            handleClose () {
                this.funcObj.show = false
                this.funcObj.form = {}
            },

            freshList () {
                this.$emit('freshList')
                this.initData()
            },

            handleCopyFunction (row) {
                this.funcObj.show = true
                this.funcObj.isEdit = false
                this.funcObj.title = '复制函数'
                const date = new Date()
                let funcName = row.funcName
                const functionList = this.functionList
                let repeatFun = functionList.find(x => x.funcName === funcName)
                while (repeatFun) {
                    funcName = `${funcName}Copy`
                    repeatFun = functionList.find(x => x.funcName === funcName)
                }
                let funcCode = row.funcCode
                let repeatFunCode = functionList.find(x => x.funcCode === funcCode)
                while (repeatFunCode) {
                    funcCode = `${funcCode}Copy`
                    repeatFunCode = functionList.find(x => x.funcCode === funcCode)
                }
                this.funcObj.form = Object.assign({}, row, {
                    id: undefined,
                    funcName,
                    updateUser: '',
                    createUser: '',
                    updateTime: '',
                    funcCode,
                    createTime: date
                })
            },

            handleDeleteFunction (row) {
                const isDisable = this.getDeleteStatus(row)
                if (isDisable) return

                this.delObj.show = true
                this.delObj.id = row.id
                this.delObj.nameTips = `删除函数【${row.funcName}】`
            },

            requestDelete () {
                this.delObj.loading = true
                this.deleteFunction(this.delObj.id).then(() => {
                    this.delObj.show = false
                    this.freshList()
                    this.messageSuccess('删除成功')
                }).finally(() => {
                    this.delObj.loading = false
                })
            },

            timeFormatter (obj, con, val) {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            },

            getUseInfoTips ({ funcCodes, pageNames, variableCodes }) {
                const tips = []
                funcCodes?.forEach((funcCode) => {
                    tips.push(`函数标识【${funcCode}】`)
                })
                pageNames?.forEach((pageName) => {
                    tips.push(`页面名称【${pageName}】`)
                })
                variableCodes?.forEach((variableCode) => {
                    tips.push(`变量标识【${variableCode}】`)
                })
                return tips
            },

            getDeleteStatus (row) {
                const user = this.user || {}
                const username = user.bk_username || user.username
                let tip = ''
                if (this.userPerm.roleId !== 1 && username !== row.createUser) tip = '只有管理员或自己创建的才有删除权限'
                if (row.useInfo?.funcCodes?.length > 0) tip = '该函数被函数引用，无法删除'
                if (row.useInfo?.pageNames?.length > 0) tip = '该函数被页面引用，无法删除'
                if (row.useInfo?.variableCodes?.length > 0) tip = '该函数被变量引用，无法删除'
                return tip
            },

            selectionChange (selection) {
                this.selectionData = selection
            },

            exportFunction () {
                const versionName = this.versionId ? `-${this.versionName}` : ''
                downloadFile(getExportFunction(this.selectionData), `lesscode-${this.projectId}${versionName}-func.json`)
            },

            exportDemoFunction () {
                const demoExportFunc = {
                    'funcName': 'getApiData',
                    'funcCode': 'getApiData',
                    'funcParams': [],
                    'funcBody': 'const data = res.data || []\r\nreturn data\r\n',
                    'funcSummary': '远程函数，获取数据',
                    'funcType': 1,
                    'funcMethod': 'get',
                    'withToken': 0,
                    'funcApiData': null,
                    'funcApiUrl': `${location.origin}/api/data/getMockData`,
                    'remoteParams': [
                        'res'
                    ]
                }
                downloadFile(getExportFunction(demoExportFunc), 'lesscode-export-demo-func.json')
            },

            handleImport (funcList) {
                try {
                    if (funcList.length <= 0) {
                        throw new Error('JSON文件为空，暂无导入数据')
                    }
                    const functionList = funcList.map((fun) => ({
                        ...fun,
                        funcGroupId: this.groupId,
                        versionId: this.versionId,
                        projectId: this.projectId
                    }))
                    this.isUploading = true
                    this.bulkCreateFunction({
                        functionList,
                        projectId: this.projectId,
                        versionId: this.versionId
                    }).then(() => {
                        this.freshList()
                        this.showImport = false
                    }).catch((err) => {
                        if (err?.code === 499) {
                            this.messageHtmlError(err.message)
                        } else {
                            this.messageError(err.message || err)
                        }
                    }).finally(() => {
                        this.isUploading = false
                    })
                } catch (err) {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }

    .use-info {
        color: #3a84ff;
        cursor: pointer;
    }

    .function-main {
        width: 100%;
        height: 100%;
        padding: 16px 24px 16px 14px;
        .function-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 14px;
            padding: 0;
            font-weight: normal;
            .head-input {
                width: 400px;
            }
        }
        .function-table {
            height: calc(100% - 46px);
            /deep/ .bk-table-body-wrapper {
                height: calc(100% - 43px);
                overflow-y: auto;
            }
            th.is-leaf {
                border: none;
            }
            &:before {
                height: 0;
            }
            .max-tabel-prop {
                display: block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
            }
        }
        .table-btn {
            color: #3a84ff;
            margin-right: 17px;
            display: inline-block;
            cursor: pointer;
            &.disable {
                color: #b9bbc1;
                cursor: not-allowed;
            }
        }
    }

    /deep/ .delete-dialog-wrapper {
        .delete-content {
            text-align: center;
            font-size: 14px;
            color: #63656e;
            margin: 0;
            word-break: break-all;
        }
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 30px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
                &:first-child {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
