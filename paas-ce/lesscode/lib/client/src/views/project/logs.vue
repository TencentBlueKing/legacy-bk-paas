<template>
    <div :class="[$style['logs'], 'page-content']">
        <div class="page-head" :class="$style['filter']">
            <div :class="$style['filter-item']">
                <div :class="$style['label']">类型</div>
                <div :class="$style['form-control']">
                    <bk-select :class="$style['select']" v-model="filter.obj" @change="handleFilterObjChange">
                        <bk-option v-for="option in options.objList"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </div>
            </div>
            <div :class="$style['filter-item']">
                <div :class="$style['label']">操作类型</div>
                <div :class="$style['form-control']">
                    <bk-select :class="$style['select']" v-model="filter.code">
                        <bk-option v-for="option in options.actions[filter.obj]"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </div>
            </div>
            <div :class="[$style['filter-item'], $style['status']]">
                <div :class="$style['label']">状态</div>
                <div :class="$style['form-control']">
                    <bk-select :class="$style['select']" v-model="filter.status">
                        <bk-option v-for="option in options.status"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </div>
            </div>
            <div :class="$style['filter-item']">
                <div :class="$style['label']">日期区间</div>
                <div :class="$style['form-control']">
                    <bk-date-picker :class="$style['date-picker']" :shortcuts="dateShortcuts" type="datetimerange"
                        v-model="dateTimeRange"
                        :clearable="false"
                        :shortcut-close="true"
                        :use-shortcut-text="true"
                        :shortcut-selected-index="dateShortcutSelectedIndex"
                        @shortcut-change="handleDateShortcutChange">
                    </bk-date-picker>
                </div>
            </div>
            <div :class="[$style['filter-item'], $style['button']]">
                <div :class="$style['form-control']">
                    <bk-button theme="primary" :disabled="fetching.list" @click="handleQuery">查询</bk-button>
                </div>
            </div>
        </div>

        <div class="page-body" :class="$style['data-list']" v-bkloading="{ isLoading: fetching.list || fetching.options }">
            <bk-table
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                :data="list"
                :pagination="pagination"
                @page-limit-change="handlePageSizeChange"
                @page-change="handlePageChange"
                v-show="!fetching.list">
                <bk-table-column label="时间" prop="operateTime" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{ row.operateTime | time }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作类型" prop="operateCodeText" min-width="120" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{row.operateCodeText}}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="对象及类型" prop="operateObj" min-width="220" class-name="table-cell-operate-obj" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <div :class="$style['operate-obj']"><span :class="$style['label']">类型：</span>{{operateObjNameMap[row.operateObj]}}</div>
                        <div :class="$style['operate-target']"><span :class="$style['label']">对象：</span>{{row.operateTarget}}</div>
                    </template>
                </bk-table-column>
                <bk-table-column label="状态" prop="operateStatus" min-width="120" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span :class="$style['operate-status']">
                            <i class="bk-drag-icon bk-drag-check-circle-fill" :class="$style['success']" v-if="row.operateStatus"></i>
                            <i class="bk-drag-icon bk-drag-close-circle-fill" :class="$style['error']" v-else></i>
                            {{row.operateStatus | statusText}}
                        </span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作人" prop="createUser" min-width="120" show-overflow-tooltip />
                <bk-table-column label="描述" prop="operateDesc" min-width="300" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{row.operateDesc}}</span>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import dayjs from 'dayjs'
    export default {
        filters: {
            time: function (value) {
                if (!value) return '--'
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            },
            statusText: function (value) {
                return (['失败', '成功'])[value]
            }
        },
        data () {
            return {
                fetching: {
                    options: false,
                    list: false
                },
                dateTimeRange: [],
                logs: {},
                list: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                options: {
                    objList: [],
                    actions: {},
                    status: [
                        { id: 1, name: '成功' },
                        { id: 0, name: '失败' }
                    ]
                },
                filter: {
                    obj: '',
                    code: '',
                    status: '',
                    timeStart: '',
                    timeEnd: ''
                },
                dateShortcutSelectedIndex: 1
            }
        },
        computed: {
            ...mapState('logs', ['dateShortcuts']),
            projectId () {
                return this.$route.params.projectId
            },
            operateObjNameMap () {
                const nampMap = {}
                this.options.objList.forEach(({ id, name }) => {
                    nampMap[id] = name
                })
                return nampMap
            }
        },
        created () {
            this.getOptions()
            this.getList()
        },
        methods: {
            async getOptions () {
                this.fetching.options = true
                try {
                    const options = await this.$store.dispatch('logs/getOptions')
                    this.options.objList = options.objList
                    this.options.actions = options.actions
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.options = false
                }
            },
            async getList () {
                const params = this.getParams()
                this.fetching.list = true
                try {
                    const [list, total] = await this.$store.dispatch('logs/getList', { projectId: this.projectId, config: { params } })
                    this.list = list
                    this.pagination.count = total
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.list = false
                }
            },
            getParams () {
                this.setFilterDateTime()
                const params = { ...this.filter }
                params.pageSize = this.pagination.limit
                params.pageNum = this.pagination.current
                return params
            },
            handleQuery () {
                this.pagination.current = 1
                this.getList()
            },
            handleFilterObjChange () {
                this.filter.code = ''
            },
            handleDateShortcutChange (value, index) {
                this.dateShortcutSelectedIndex = index
            },
            setFilterDateTime () {
                let timeRange = this.dateTimeRange
                if (this.dateShortcutSelectedIndex !== -1) {
                    timeRange = this.dateShortcuts[this.dateShortcutSelectedIndex].value()
                }
                this.filter.timeStart = +new Date(`${timeRange[0]}`)
                this.filter.timeEnd = +new Date(`${timeRange[1]}`)
            },
            handlePageSizeChange (size) {
                this.pagination.limit = size
                this.pagination.current = 1
                this.getList()
            },
            handlePageChange (page) {
                this.pagination.current = page
                this.getList()
            }
        }
    }
</script>

<style lang="postcss" module>
    .logs {
        padding: 30px 24px;

        .filter {
            display: flex;
            max-width: 1440px;

            .filter-item {
                flex: 1;
                display: flex;
                align-items: center;
                margin-right: 12px;

                .label {
                    flex: none;
                    &::after {
                        content: '：'
                    }
                }
                .form-control {
                    flex: 1;
                    width: 100%;

                    .date-picker {
                        width: 100%;
                        min-width: 300px;
                    }
                    .select {
                        background: #fff;
                    }
                }

                &.status {
                    flex: none;
                    .form-control {
                        width: 150px;
                    }
                }
                &.button {
                    flex: none;
                }

                &:last-child {
                    margin: 0;
                }
            }
        }

        .data-list {
            .operate-obj,
            .operate-target {
                .label {
                    color: #979ba5;
                }
            }

            .operate-status {
                .success {
                    color: #2dcb56;
                    font-size: 14px;
                }
                .error {
                    color: #db2626;
                    font-size: 14px;
                }
            }
        }
    }

    :global {
        .table-cell-operate-obj {
            .cell {
                -webkit-line-clamp: unset;
                padding-top: 8px;
                padding-bottom: 8px;
            }
        }
    }

    @media (max-width: 1440px) {
        .logs {
            .filter {
                .filter-item {
                    flex-direction: column;
                    align-items: flex-start;

                    .label {
                        margin-bottom: 4px;
                    }

                    &.button {
                        align-self: flex-end;
                    }
                }
            }
        }
    }
</style>
