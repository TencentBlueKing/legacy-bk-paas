<template>
    <article class="member-manage-main">
        <section class="member-manage-head">
            <bk-button theme="primary" @click="handleCreate" :disabled="userPerm.roleId === 2" :title="userPerm.roleId === 1 ? '' : '仅管理员可操作'">添加</bk-button>
            <bk-input class="member-manage-head-input" placeholder="请输入" :clearable="true" right-icon="bk-icon icon-search" v-model="name"></bk-input>
        </section>

        <bk-table :data="memberList"
            :outer-border="false"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
            v-bkloading="{ isLoading }"
            class="member-table"
        >
            <bk-table-column label="姓名" prop="username" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="角色" prop="roleId" show-overflow-tooltip :formatter="roleFormatter"></bk-table-column>
            <bk-table-column label="添加人" prop="createUser" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="添加时间" prop="updateTime" show-overflow-tooltip :formatter="timeFormatter"></bk-table-column>
            <bk-table-column label="操作" width="180">
                <template slot-scope="props">
                    <bk-button class="table-bth" text @click="editMember(props.row)" :disabled="!!operateTip(props.row)" :title="operateTip(props.row)">编辑</bk-button>
                    <bk-button class="table-bth" text @click="deleteMember(props.row)" :disabled="!!operateTip(props.row)" :title="operateTip(props.row)">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table>

        <bk-sideslider :is-show.sync="sideObj.isShow" :title="sideObj.title" quick-close :width="796" @hidden="clearForm">
            <bk-form :label-width="80" :model="sideObj.form" class="member-form" slot="content">
                <bk-form-item label="成员" :required="true" property="users">
                    <bk-input :value="sideObj.form.users.join('')" disabled v-if="sideObj.isEdit" class="member-form-input"></bk-input>
                    <member-selector v-model="sideObj.form.users" :user-list.sync="filterUserList" v-else></member-selector>
                </bk-form-item>
                <bk-form-item label="角色" :required="true" property="roleId">
                    <bk-radio-group v-model="sideObj.form.roleId">
                        <bk-radio-button :value="2">
                            <span :class="['check-radio', { choose: sideObj.form.roleId === 2 }]"></span>
                            <span class="check-radio-title">开发者</span><br>
                            拥有项目的页面、函数、组件开发权限及部署权限
                        </bk-radio-button>
                        <bk-radio-button :value="1">
                            <span :class="['check-radio', { choose: sideObj.form.roleId === 1 }]"></span>
                            <span class="check-radio-title">管理员</span><br>
                            拥有项目的所有权限
                        </bk-radio-button>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item>
                    <bk-button ext-cls="mr5" theme="primary" title="提交" @click="submitMember" :loading="sideObj.isLoading">提交</bk-button>
                    <bk-button ext-cls="mr5" theme="default" title="取消" @click="cancleMember" :disabled="sideObj.isLoading ">取消</bk-button>
                </bk-form-item>
            </bk-form>
        </bk-sideslider>

        <bk-dialog v-model="deleteObj.visible"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="删除成员"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
        >
            确定删除成员{{ deleteObj.name }}？删除后该成员将失去项目【{{ deleteObj.roleId === 1 ? '管理员' : '开发者' }}】角色权限
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="deleteObj.loading"
                    @click="requestDeleteMember(deleteObj.id)"
                    :disabled="userPerm.roleId === 2"
                >删除</bk-button>
                <bk-button @click="handleDeleteCancel" :disabled="deleteObj.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </article>
</template>

<script>
    import dayjs from 'dayjs'
    import memberSelector from '@/components/member-selector'

    export default {
        components: {
            memberSelector
        },

        data () {
            return {
                isLoading: false,
                searchGroupStr: '',
                memberList: [],
                deleteObj: {
                    visible: false,
                    loading: false,
                    name: '',
                    id: ''
                },
                sideObj: {
                    isShow: false,
                    isLoading: false,
                    title: '',
                    form: {
                        users: [],
                        roleId: 2,
                        isEdit: false
                    }
                },
                name: '',
                userList: []
            }
        },

        computed: {
            projectId () {
                return this.$route.params.projectId
            },

            userPerm () {
                return this.$store.getters['member/userPerm'] || { roleId: 2 }
            },

            filterUserList: {
                get () {
                    const memberNameList = this.memberList.map(member => member.username)
                    return this.userList.filter(user => !memberNameList.includes(user.name))
                },
                set (list) {
                    this.userList = list
                }
            }
        },

        watch: {
            name () {
                this.getMember()
            }
        },

        created () {
            this.getMember()
        },

        methods: {
            operateTip (row) {
                const hasPerm = this.userPerm.roleId === 1
                const manageMemberList = this.memberList.filter(member => member.roleId === 1)
                const isManage = row.roleId === 1
                let tip = ''
                if (!hasPerm) tip = '仅管理员可操作'
                else if (manageMemberList.length <= 1 && isManage) tip = '不允许对最后一个管理员进行操作'
                return tip
            },

            roleFormatter (row, column, cellValue, index) {
                return cellValue === 1 ? '管理员' : '开发者'
            },

            timeFormatter (obj, con, val) {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            },

            getMember () {
                this.isLoading = true
                const queryObj = {
                    projectId: this.projectId,
                    name: this.name
                }
                this.$store.dispatch('member/getMember', queryObj).then((res) => {
                    this.memberList = res || []
                }).catch((err) => {
                    this.$bkMessage({ message: err.message || err, theme: 'error' })
                }).finally(() => {
                    this.isLoading = false
                })
            },

            submitMember () {
                const payload = {
                    roleId: this.sideObj.form.roleId,
                    users: this.sideObj.form.users,
                    projectId: this.projectId
                }
                this.sideObj.isLoading = true
                this.$store.dispatch('member/addMembers', payload).then(() => {
                    this.$bkMessage({ message: '操作成功', theme: 'success' })
                    this.sideObj.isShow = false
                    this.getMember()
                    this.$store.dispatch('member/setCurUserPermInfo', { id: this.projectId })
                }).catch((err) => {
                    this.$bkMessage({ message: err.message || err, theme: 'error' })
                }).finally(() => {
                    this.sideObj.isLoading = false
                })
            },

            clearForm () {
                this.sideObj.form.users = []
                this.sideObj.form.roleId = 2
                this.sideObj.isEdit = false
            },

            cancleMember () {
                this.sideObj.isShow = false
            },

            handleCreate () {
                this.sideObj.isShow = true
                this.sideObj.title = '添加成员'
            },

            editMember (row) {
                this.sideObj.isShow = true
                this.sideObj.title = '编辑成员'
                this.sideObj.isEdit = true
                this.sideObj.form.users = [row.username]
                this.sideObj.form.roleId = row.roleId
            },

            requestDeleteMember () {
                this.deleteObj.loading = true
                this.$store.dispatch('member/deleteMember', this.deleteObj.id).then(() => {
                    this.$bkMessage({ message: '删除成员成功', theme: 'success' })
                    this.deleteObj.visible = false
                    this.getMember()
                }).catch((err) => {
                    this.$bkMessage({ message: err.message || err, theme: 'error' })
                }).finally(() => {
                    this.deleteObj.loading = false
                })
            },

            handleDeleteCancel () {
                this.deleteObj.visible = false
            },

            deleteMember (row) {
                this.deleteObj.id = row.id
                this.deleteObj.visible = true
                this.deleteObj.name = row.username
                this.deleteObj.roleId = row.roleId
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .member-form {
        padding: 20px 0;
        height: calc(100vh - 100px);
        .member-form-input {
            width: 684px;
        }
    }
    /deep/ .bk-radio-button-text {
        height: 56px;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        width: 342px;
        padding: 11px 51px 9px;
        font-weight: normal;
        position: relative;
        .check-radio {
            position: absolute;
            height: 16px;
            width: 16px;
            border: 1px solid;
            border-radius: 100px;
            background: #fff;
            left: 16px;
            top: 20px;
            &.choose:after {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                height: 6px;
                width: 6px;
                border: 1px solid;
                border-radius: 100px;
                background: currentColor;
            }
        }
        .check-radio-title {
            font-weight: 700;
            margin-bottom: 4px;
        }
    }
    .member-manage-main {
        padding: 16px 24px;
    }
    .member-manage-head {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        .member-manage-head-input {
            width: 400px;
        }
    }
    .member-table {
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
        .table-bth {
            margin-right: 17px;
            display: inline-block;
            cursor: pointer;
        }
    }
    /deep/ .delete-dialog-wrapper {
        .bk-form-item{
            .bk-label {
                padding: 0;
            }
        }
        p {
            margin-bottom: 15px;
            text-align: left;
        }
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 40px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
            }
        }
    }
</style>
