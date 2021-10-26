<template>
    <div class="page-content">
        <div class="page-head version-head">
            <div class="buttons">
                <bk-button theme="primary" @click="handleCreate">新建</bk-button>
            </div>
            <div class="search-bar">
                <bk-input placeholder="版本号"
                    style="width: 400px"
                    :clearable="true"
                    right-icon="bk-icon icon-search"
                    v-model="keyword"
                    @clear="handleSearch(true)"
                    @enter="handleSearch(false)">
                </bk-input>
            </div>
        </div>
        <div class="page-body version-body" v-bkloading="{ isLoading: loading.list }">
            <bk-table
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                :data="displayList"
                v-show="!loading.list">
                <bk-table-column label="版本号" prop="version" min-width="150" show-overflow-tooltip></bk-table-column>
                <bk-table-column label="版本日志" prop="versionLog" min-width="120">
                    <template slot-scope="{ row }">
                        <div class="version-detail">
                            <span class="version-log">
                                {{row.versionLog}}
                            </span>
                            <bk-link theme="primary" @click="handleVersionDetail(row)">详情</bk-link>
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="更新人" prop="updateUser" min-width="120" show-overflow-tooltip></bk-table-column>
                <bk-table-column label="更新日期" prop="updateTime" min-width="220" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{ row.updateTime | time }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="创建人" prop="createUser" min-width="120" show-overflow-tooltip />
                <bk-table-column label="创建日期 " prop="operateDesc" min-width="300" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{ row.createTime | time }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作" prop="statusText" align="left" width="200">
                    <template slot-scope="{ row }">
                        <bk-button text @click="handleEdit(row)">编辑</bk-button>
                        <bk-button text @click="handleGoPageList(row)">进入页面</bk-button>
                    </template>
                </bk-table-column>
                <bk-exception slot="empty" class="component-list-empty" type="empty">
                    <div style="font-size: 12px">
                        暂无版本
                        <span>
                            ，<bk-button text theme="primary" @click="handleCreate">立即创建</bk-button>
                        </span>
                    </div>
                </bk-exception>
            </bk-table>
        </div>

        <form-sideslider :is-show.sync="sideslider.show" :data="versionData" @updated="handleUpdated" />

        <version-log :is-show.sync="versionDialog.show" :data="versionDialog.data" :title="versionDialog.title" />
    </div>
</template>

<script>
    // import { mapState } from 'vuex'
    import dayjs from 'dayjs'
    import VersionLog from '@/components/version-log'
    import FormSideslider from './children/form-sideslider.vue'

    export default {
        components: {
            FormSideslider,
            VersionLog
        },
        filters: {
            time: function (value) {
                if (!value) return '--'
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        data () {
            return {
                loading: {
                    list: false
                },
                list: [],
                displayList: [],
                sideslider: {
                    show: false
                },
                versionDialog: {
                    show: false,
                    title: '',
                    data: {}
                },
                versionData: {},
                keyword: ''
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        watch: {
            keyword (val) {
                if (!val) {
                    this.handleSearch(false)
                }
            }
        },
        created () {
            this.getList()
        },
        methods: {
            async getList () {
                this.loading.list = true
                try {
                    const data = await this.$store.dispatch('projectVersion/getList', { projectId: this.projectId })
                    this.list = this.displayList = data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loading.list = false
                }
            },
            handleCreate () {
                this.versionData = {}
                this.sideslider.show = true
            },
            handleEdit (data) {
                this.versionData = data
                this.sideslider.show = true
            },
            handleGoPageList () {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId: this.projectId
                    }
                })
            },
            handleSearch (clear = false) {
                if (clear) {
                    this.keyword = ''
                    this.displayList = this.list
                } else {
                    this.displayList = this.list.filter(item => new RegExp(this.keyword, 'i').test(item.version))
                }
            },
            handleUpdated () {
                this.getList()
            },
            handleVersionDetail (row) {
                this.versionDialog.show = true
                this.versionDialog.data = row
                this.versionDialog.title = `${row.version} 版本日志`
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .version-head {
        justify-content: space-between;
    }
    .bk-table-row {
        .bk-button-text + .bk-button-text {
            margin-left: 10px;
        }
    }
    .version-detail {
        display: flex;
        align-items: center;
        .version-log {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .bk-link {
            flex: none;
            margin-left: 2px;
            ::v-deep .bk-link-text {
                font-size: 12px;
            }
        }
    }
</style>
