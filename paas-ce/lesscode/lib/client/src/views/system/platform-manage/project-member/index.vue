<template>
    <div class="page-content">
        <div class="member-list">
            <div class="filter">
                <bk-input
                    class="filter-item search-input"
                    clearable
                    placeholder="按项目名/ID搜索"
                    right-icon="bk-icon icon-search"
                    @clear="handleKeywordClear"
                    @enter="handleKeywordEnter"
                    v-model="filters.keyword">
                </bk-input>
            </div>
            <div class="data-list" v-bkloading="{ isLoading: fetching.base }">
                <bk-table
                    v-show="!fetching.base"
                    :data="list"
                    :pagination="pagination"
                    @page-change="handlePageChange"
                    @page-limit-change="handlePageLimitChange"
                    @sort-change="handleSortChange">
                    <bk-table-column
                        v-for="column in columns"
                        :key="column.id"
                        :label="column.name"
                        :prop="column.id"
                        :width="column.width"
                        :sortable="column.sortable"
                        :show-overflow-tooltip="column.tooltip">
                        <template slot-scope="{ row }">
                            <loading v-if="column.dynamic" :loading="fetching[column.id]">
                                <span v-if="column.type === 'number'">{{row[column.id] | formatCount}}</span>
                                <span v-else>{{row[column.id]}}</span>
                            </loading>
                            <template v-else>{{row[column.id]}}</template>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="操作">
                        <template slot-scope="{ row }">
                            <bk-button
                                text
                                class="mr5"
                                theme="primary"
                                @click="editManager(row.id)"
                            >编辑项目管理员</bk-button>
                        </template>
                        
                    </bk-table-column>
                </bk-table>
            </div>
        </div>
        <bk-sideslider :is-show.sync="sideObj.isShow" :title="sideObj.title" quick-close :width="796" @hidden="clearForm">
            <bk-form :label-width="130" :model="sideObj.form" class="member-form" slot="content">
                <bk-form-item label="项目管理员" :required="true" property="users">
                    <member-selector class="member-form-select" @clear="clearForm" v-model="sideObj.form.users" :user-list.sync="filterUserList"></member-selector>
                </bk-form-item>
                <bk-form-item>
                    <bk-button ext-cls="mr5" theme="primary" title="提交" @click="submitMember" :loading="sideObj.isLoading">提交</bk-button>
                    <bk-button ext-cls="mr5" theme="default" title="取消" @click="cancleMember" :disabled="sideObj.isLoading ">取消</bk-button>
                </bk-form-item>
            </bk-form>
        </bk-sideslider>
    </div>
</template>

<script>
    import http from '@/api'
    import Loading from '@/components/ui/loading.vue'
    import sharedMixin from '../shared-mixin.js'
    import tableListMixin from '../table-list-mixin.js'
    import memberSelector from '@/components/member-selector'
    import _ from 'lodash'

    export default {
        components: {
            Loading,
            memberSelector
        },
        mixins: [sharedMixin, tableListMixin],
        data () {
            return {
                list: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                columns: [
                    { id: 'projectName', name: '项目名' },
                    { id: 'projectCode', name: '项目ID' }
                ],
                filters: {
                    keyword: ''
                },
                fetching: {
                    base: false
                },
                contact: [],
                sideObj: {
                    isShow: false,
                    isLoading: false,
                    title: '编辑项目管理员',
                    form: {
                        users: []
                    }
                },
                memberList: [],
                memberUserNameList: [],
                userList: [],
                name: ''
            }
        },
        computed: {
            params () {
                const params = {
                    q: this.filters.keyword,
                    pageSize: this.pagination.limit,
                    pageNum: this.pagination.current,
                    excludeDemo: false
                }
                return params
            },
            filterUserList: {
                get () {
                    return this.userList.sort((a, b) => (a.name || '').localeCompare(b.name))
                },
                set (list) {
                    this.userList = list
                }
            }
        },
        async created () {
            this.getProjectBase()
        },
        methods: {
            async getProjectBase () {
                this.fetching.base = true
                try {
                    const { data: [list, total] } = await http.post('/operation/stats/project/base', this.params)
                    this.list = list.map((item) => ({
                        ...item,
                        ...this.getDynamicValues()
                    }))
                    this.pagination.count = total

                    if (this.list && this.list.length) {
                        this.getMoreData()
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.base = false
                }
            },
            getMoreData () {
                this.getProjectPageCount()
            },
            async getProjectPageCount () {
                const projectIds = this.list.map(item => item.id)
                this.fetching.pageCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/project/pageCount', { projectIds })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(project => project.id === item.projectId)
                        updateItem.pageCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.pageCount = false
                }
            },

            async editManager (projectId) {
                this.projectId = projectId
                this.sideObj.isShow = true
                await this.$store.dispatch('member/setCurUserPermInfo', { id: this.projectId, needCheckAdmin: true })
                this.getMember()
            },

            getMember () {
                this.isLoading = true
                const queryObj = {
                    projectId: this.projectId,
                    name: this.name
                }
                this.$store.dispatch('member/getMember', queryObj).then((res) => {
                    this.memberList = (res || []).filter(e => e.roleId === 1)
                    this.sideObj.form.users = this.memberList.reduce((p, v) => {
                        p.push(v.username)
                        return p
                    }, [])
                    this.memberUserNameList = _.cloneDeep(this.sideObj.form.users)
                }).catch((err) => {
                    this.$bkMessage({ message: err.message || err, theme: 'error' })
                }).finally(() => {
                    this.isLoading = false
                })
            },

            // 提交
            async submitMember () {
                const needDeleteMembersIds = this.memberList.filter(user => !this.sideObj.form.users.includes(user.username)).map(e => e.id)
                const needAddMembersData = this.sideObj.form.users.filter(userName => !this.memberUserNameList.includes(userName))
                try {
                    if (needDeleteMembersIds.length) {
                        await this.$store.dispatch('member/deleteMultipleMember', needDeleteMembersIds)
                    }
                    if (needAddMembersData.length) {
                        const payload = {
                            roleId: 1, // 项目管理员
                            users: needAddMembersData,
                            projectId: this.projectId
                        }
                        await this.$store.dispatch('member/addMembers', payload)
                    }
                    this.$bkMessage({ message: '操作成功', theme: 'success' })
                    this.sideObj.isShow = false
                } catch (err) {
                    this.$bkMessage({ message: err.message || err, theme: 'error' })
                } finally {
                    this.sideObj.isLoading = false
                }
            },

            clearForm () {
                this.sideObj.form.users = []
            },

            cancleMember () {
                this.sideObj.isShow = false
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .member-form {
        padding: 20px 0;
        height: calc(100vh - 100px);
        .member-form-select {
            width: 624px;
        }
    }
</style>
