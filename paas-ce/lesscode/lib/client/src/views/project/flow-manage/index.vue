<template>
    <div class="flow-manage-home">
        <div class="operation-area">
            <bk-button theme="primary" @click="isCreateDialogShow = true">新建</bk-button>
            <bk-input placeholder="流程名称" style="width: 400px;" right-icon="bk-icon icon-search" />
        </div>
        <bk-table
            :data="flowList"
            :pagination="pagination"
            :outer-border="false"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange">
            <bk-table-column label="ID" property="id"></bk-table-column>
            <bk-table-column label="流程名称" property="name"></bk-table-column>
            <bk-table-column label="流程描述"></bk-table-column>
            <bk-table-column label="流程表单"></bk-table-column>
            <bk-table-column label="流程数据管理页"></bk-table-column>
            <bk-table-column label="引用页面"></bk-table-column>
            <bk-table-column label="创建人"></bk-table-column>
            <bk-table-column label="创建时间"></bk-table-column>
            <bk-table-column label="操作">
                <template>
                    <bk-button
                        style="margin-right: 17px;"
                        theme="primary"
                        :text="true"
                        @click="handleEditClick">
                        编辑
                    </bk-button>
                    <bk-button
                        theme="primary"
                        :text="true"
                        @click="handleArchiveClick">
                        归档
                    </bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <bk-dialog
            title="新建流程"
            header-position="left"
            render-directive="if"
            :value="isCreateDialogShow"
            :width="750"
            :position="{ top: 80 }"
            :mask-close="false"
            :auto-close="false"
            @confirm="handleCreateConfirm"
            @cancel="isCreateDialogShow = false">
            <bk-form
                ref="createForm"
                style="padding: 16px 100px 16px 0"
                :model="newFlowData"
                :rules="flowDataRule">
                <bk-form-item label="流程名称" property="name" :required="true">
                    <bk-input v-model="newFlowData.name" />
                </bk-form-item>
                <bk-form-item label="流程描述" property="desc">
                    <bk-input v-model="newFlowData.desc" type="textarea" :row="4" />
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    export default {
        name: 'flowManage',
        data () {
            return {
                flowList: [],
                listLoading: false,
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 15
                },
                newFlowData: {
                    name: '',
                    desc: ''
                },
                flowDataRule: {
                    name: [{
                        required: true,
                        trigger: 'blur',
                        message: '必填项'
                    }]
                },
                isCreateDialogShow: false,
                createPending: false
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        created () {
            // this.getFlowList()
        },
        methods: {
            async getFlowList () {
                this.listLoading = true
                try {
                    const res = await this.$store.dispatch('nocode/flow/getFlowList', { project: this.projectId })
                    this.flowList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.listLoading = false
                }
            },
            handleCreateConfirm () {
                this.$refs.createForm.validate().then(async () => {
                    this.createPending = true
                    try {
                        await this.$store.dispatch('nocode/flow/createFlow', this.newFlowData)
                    } catch (e) {
                        console.error(e)
                    } finally {
                        this.createPending = false
                    }
                })
            },
            handleEditClick () {
                this.$router.push({ name: 'FlowEdit', params: { id: this.projectId } })
            },
            handleArchiveClick () {},
            handlePageChange () {},
            handlePageLimitChange () {}
        }
    }
</script>
<style lang="postcss" scoped>
    .flow-manage-home {
        padding: 16px 24px;
        height: 100%;
    }
    .operation-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }
</style>
