<template>
    <section>
        <div class="history-container" v-bkloading="{ isLoading: isLoading, opacity: 1 }">
            <div class="history-content">
                <bk-table :data="list" type="small" ext-cls="history-table" empty-text="暂无部署记录">
                    <bk-table-column label="关联的应用模块" prop="bindInfo" width="200" show-overflow-tooltip></bk-table-column>
                    <bk-table-column label="源码包类型" prop="releaseType" width="150" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            {{releaseTypeMap[row.releaseType]}}
                            <span v-if="row.releaseType === 'PROJECT_VERSION'">
                                {{`${row.fromProjectVersion === '' ? `(默认)` : (row.fromProjectVersion ? `(${row.fromProjectVersion})` : '') }` }}
                            </span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="部署环境" prop="env" :formatter="envFormatter" width="150"></bk-table-column>
                    <bk-table-column label="部署包版本" prop="version" width="120" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <div v-if="row.codeUrl" class="status-result">
                                <a class="status-log-link" :href="row.codeUrl">{{row.version}}</a>
                            </div>
                            <span v-else-if="row.isOffline">{{ row.version}} </span>
                            <span v-else v-bk-tooltips.right="'本次部署无版本包生成'">{{row.version}} </span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="部署执行的 Sql" width="120">
                        <template slot-scope="{ row }">
                            <bk-button text @click="showSql(row)" v-if="row.releaseSqlIds">
                                查看详情
                            </bk-button>
                            <span v-else>--</span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="操作人" prop="createUser" :formatter="userFormatter" width="120"></bk-table-column>
                    <bk-table-column label="操作结果" prop="status" width="220">
                        <template slot-scope="{ row }">
                            <div class="status-result">
                                <i v-if="row.status === 'running'" class="bk-drag-icon bk-drag-icon bk-drag-loading-2 history-status-icon"></i>
                                <i v-else class="bk-drag-icon bk-drag-circle-shape history-status-icon" :class="[`icon-${row.status}`]"></i>
                                <span>{{ typeMap[row.isOffline] }}{{ statusMap[row.status] }}</span>
                                <span v-if="!row.isOffline" class="status-log-link" @click="showLog(row)">，查看详情</span>
                            </div>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="操作时间" prop="createTime" :formatter="timeFormatter" width="180"></bk-table-column>
                    <bk-table-column label="操作来源" prop="releaseType" :formatter="sourceFormatter" width="150"></bk-table-column>
                </bk-table>
            </div>
        </div>
        <completed-log v-if="showCompletedLog" :is-show="showCompletedLog" :deploy-id="deployId" :default-content="defaultContent" :status="status" @closeLog="closeLog"></completed-log>
        <running-log v-if="showRunningLog" :is-show="showRunningLog" :deploy-id="deployId" @closeLog="closeLog" :title="`${envMap[env]}部署执行日志`"></running-log>
        <bk-sideslider
            :is-show.sync="isShowSql"
            :quick-close="true"
            :width="960"
            :title="`数据库变更详情【${envFormatter('', '', sqlEnv)}】`"
        >
            <div slot="content">
                <monaco
                    v-bkloading="{ isLoading: isLoadingSql }"
                    read-only
                    height="calc(100vh - 90px)"
                    :value="sqlDetail"
                    :options="{ language: 'sql' }"
                ></monaco>
            </div>
        </bk-sideslider>
    </section>
</template>

<script>
    import dayjs from 'dayjs'
    import completedLog from './components/completed-log'
    import runningLog from './components/running-log'
    import monaco from '@/components/monaco.vue'
    export default {
        components: {
            completedLog,
            runningLog,
            monaco
        },
        data () {
            return {
                envMap: {
                    prod: '生产环境',
                    stag: '预发布环境'
                },
                typeMap: ['部署', '下架'],
                statusMap: {
                    successful: '成功',
                    failed: '失败',
                    running: '中'
                },
                releaseTypeMap: {
                    NEW_VERSION: '应用默认版本',
                    PROJECT_VERSION: '应用版本',
                    HISTORY_VERSION: '历史部署包',
                    FROM_V3: 'PaaS平台部署包'
                },
                isLoading: true,
                list: [],
                deployId: '',
                defaultContent: '',
                showCompletedLog: false,
                showRunningLog: false,
                env: '',
                status: '',
                isLoadingSql: false,
                isShowSql: false,
                sqlDetail: '',
                sqlEnv: ''
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        created () {
            this.getList()
        },
        methods: {
            async getList () {
                try {
                    this.isLoading = true
                    this.list = await this.$store.dispatch('release/getList', { projectId: this.projectId })
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.isLoading = false
                }
            },
            timeFormatter (obj, con, val) {
                if (obj.releaseType === 'FROM_V3') {
                    const paasInfo = obj.fromPaasInfo ? JSON.parse(obj.fromPaasInfo) : {}
                    return paasInfo.createTime || '--'
                } else {
                    return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
                }
            },
            userFormatter (obj, con, val) {
                if (obj.releaseType === 'FROM_V3') {
                    const paasInfo = obj.fromPaasInfo ? JSON.parse(obj.fromPaasInfo) : {}
                    return paasInfo.createUser || '--'
                } else {
                    return val
                }
            },
            sourceFormatter (obj, con, val) {
                return val === 'FROM_V3' ? 'PaaS平台' : '可视化开发平台'
            },
            envFormatter (obj, con, val) {
                return this.envMap[val] || val
            },
            showLog (row) {
                // 先判断当前时间是否大于部署时间十分钟，十分钟以上直接显示completedLog
                let showCompleted = false
                const tmpTime = row.createTime
                const createTime = dayjs(tmpTime).format('YYYY-MM-DD HH:mm:ss') || ''
                const createTimeUnix = new Date(createTime).getTime()
                const currentTimeUnix = new Date().getTime()
                if ((currentTimeUnix - createTimeUnix) > 600000) {
                    showCompleted = true
                }

                this.deployId = row.deployId
                this.env = row.env
                this.status = row.status
                if (row.status !== 'running' || showCompleted) {
                    this.defaultContent = this.defaultContent = row.errorMsg || '日志为空'
                    this.showCompletedLog = true
                } else {
                    this.showRunningLog = true
                }
            },
            closeLog () {
                this.showCompletedLog = false
                this.showRunningLog = false
                this.deployId = ''
                this.defaultContent = ''
            },
            showSql ({ releaseSqlIds, env }) {
                this.isShowSql = true
                this.isLoadingSql = true
                this.$store.dispatch('dataSource/getSqlRecords', { ids: releaseSqlIds }).then((res) => {
                    this.sqlDetail = (res || []).reduce((acc, cur) => {
                        acc += `${cur.sql}\r\n`
                        return acc
                    }, '')
                    this.sqlEnv = env
                }).catch((error) => {
                    this.$bkMessage({ theme: 'error', message: error.message || error })
                }).finally(() => {
                    this.isLoadingSql = false
                })
            }
        }
    }
</script>

<style lang="postcss">
    .history-container {
        margin: 16px 24px;

        .history-content {
            min-width: 1000px;

            .history-table {
                box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
                border: none;
                th {
                    background-color: #F0F1F5;
                }
                .status-result {
                    .history-status-icon {
                        font-size: 8px;
                    }
                    .icon-successful {
                        color: #2dcb56;
                    }
                    .icon-failed {
                        color: #ea3636;
                    }
                    .status-log-link {
                        cursor: pointer;
                        color: #3a84ff;
                    }
                }
            }
        }
    }
</style>
