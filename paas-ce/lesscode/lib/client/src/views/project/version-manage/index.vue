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
                <bk-table-column label="版本号" prop="version" min-width="120" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <div class="component-version" @click="handleVersionDetail(row)">
                            <span>{{ row.version }}</span>
                            <i class="bk-drag-icon bk-drag-info-fill" style="margin-left: 8px" />
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="更新人" prop="updateUser" min-width="120" show-overflow-tooltip></bk-table-column>
                <bk-table-column label="更新日期" prop="updateTime" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{ row.updateTime | time }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="创建人" prop="createUser" min-width="120" show-overflow-tooltip />
                <bk-table-column label="创建日期 " prop="operateDesc" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{ row.createTime | time }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="是否归档 " prop="archiveFlag" min-width="110" :render-header="renderArchiveHeader" sortable>
                    <template slot-scope="{ row }">
                        <span>{{ row.archiveFlag ? '是' : '否' }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作" prop="statusText" align="left" min-width="200">
                    <template slot-scope="{ row }">
                        <bk-button v-if="row.archiveFlag === 1" text @click="handleRecover(row)">恢复</bk-button>
                        <bk-popconfirm trigger="click" width="340"
                            confirm-text="归档"
                            @confirm="handleArchive(row)">
                            <div slot="content">
                                <div class="archive-tips">
                                    <i class="bk-icon icon-info-circle-shape pr5 content-icon"></i>
                                    <div class="content-text">归档后版本不会在"页面列表"和"发布部署"页面中展示</div>
                                </div>
                            </div>
                            <bk-button v-if="row.archiveFlag === 0" text>归档</bk-button>
                        </bk-popconfirm>
                        <bk-button class="ml10" text @click="handleEdit(row)">编辑</bk-button>
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
    import { bus } from '@/common/bus'
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
                this.versionData = Object.freeze({ ...data })
                this.sideslider.show = true
            },
            handleGoPageList (row) {
                // 先设置当前版本为选择的版本
                const { id, version } = row
                bus.$emit('update-project-version', { id, version })

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
            },
            async handleRecover (version) {
                await this.$store.dispatch('projectVersion/recover', {
                    id: version.id,
                    projectId: this.projectId
                })
                this.getList()
                this.messageSuccess('操作成功')
            },
            async handleArchive (version) {
                await this.$store.dispatch('projectVersion/archive', {
                    id: version.id,
                    projectId: this.projectId
                })
                this.getList()
                this.messageSuccess('操作成功')
            },
            renderArchiveHeader (h, data) {
                const directive = {
                    name: 'bkTooltips',
                    content: '已归档的版本不会在"页面列表"和"发布部署"页面中展示',
                    placement: 'right'
                }
                return <span class="header-cell-with-tips" v-bk-tooltips={ directive }>{ data.column.label }</span>
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
    .component-version {
        display: flex;
        align-items: center;
        height: 24px;
        padding-left: 3px;
        color: #3A84FF;
        font-weight: bold;
        background: #e1ecff;
        border-radius: 2px;
        cursor: pointer;
        &:hover{
            background: #A2C5FD;
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
    .archive-tips {
        font-size: 14px;
        line-height: 24px;
        color: #63656e;
        padding-bottom: 10px;
        .content-icon {
            color: #ea3636;
            position: absolute;
            top: 20px;
        }
        .content-text {
            display: inline-block;
            margin-left: 20px;
        }
    }
    ::v-deep .bk-table-header {
        .header-cell-with-tips {
            color: inherit;
            text-decoration: underline;
            text-decoration-style: dashed;
            text-underline-position: under;
        }
    }
</style>
