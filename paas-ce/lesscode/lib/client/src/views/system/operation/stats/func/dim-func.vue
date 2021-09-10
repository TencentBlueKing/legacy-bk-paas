<template>
    <div class="operation-list">
        <div class="filter">
            <bk-date-picker class="filter-item"
                v-model="filters.dateRange"
                type="daterange"
                placeholder="创建时间"
                @change="handleTimeChange"
                :shortcuts="dateShortcuts[0]">
            </bk-date-picker>
            <bk-input
                class="filter-item search-input"
                clearable
                placeholder="按函数名搜索"
                right-icon="bk-icon icon-search"
                @clear="handleKeywordClear"
                @enter="handleKeywordEnter"
                v-model="filters.keyword">
            </bk-input>
            <export-button name="func" :list="list" :fields="exportFields" />
        </div>
        <div class="data-list" v-bkloading="{ isLoading: fetching.base }">
            <bk-table
                v-show="!fetching.base"
                :data="list"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="函数名" prop="funcName" width="360"></bk-table-column>
                <bk-table-column label="所属项目" prop="projectName" width="300"></bk-table-column>
                <bk-table-column label="使用页面数">
                    <template slot-scope="{ row }">
                        <loading :loading="fetching.pageUsedCount">
                            <span>{{row.pageUsedCount | formatCount}}</span>
                        </loading>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>

<script>
    import http from '@/api'
    import Loading from '@/components/ui/loading.vue'
    import ExportButton from '../export-button.vue'
    import sharedMixin from '../shared-mixin.js'

    export default {
        components: {
            Loading,
            ExportButton
        },
        mixins: [sharedMixin],
        data () {
            return {
                list: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                exportFields: [
                    { id: 'funcName', name: '函数名' },
                    { id: 'projectName', name: '所属项目' },
                    { id: 'pageUsedCount', name: '使用页面数' }
                ],
                filters: {
                    keyword: '',
                    dateRange: []
                },
                fetching: {
                    base: false,
                    pageUsedCount: false
                }
            }
        },
        computed: {
            params () {
                const params = {
                    q: this.filters.keyword,
                    time: this.timeParam, // mixin
                    pageSize: this.pagination.limit,
                    pageNum: this.pagination.current
                }
                return params
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            async fetchData () {
                this.getFuncBase()
            },
            async getFuncBase () {
                this.fetching.base = true
                try {
                    const { data: [list, total] } = await http.post('/operation/stats/func/base', this.params)
                    this.list = list.map((item) => ({
                        ...item,
                        pageUsedCount: 0
                    }))
                    this.pagination.count = total

                    if (this.list && this.list.length) {
                        this.getFuncPageUsedCount()
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.base = false
                }
            },
            async getFuncPageUsedCount () {
                const funcIds = this.list.map(item => item.id)
                this.fetching.pageUsedCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/func/pageUsedCount', { funcIds })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(func => func.id === item.funcId)
                        updateItem.pageUsedCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.pageUsedCount = false
                }
            }
        }
    }
</script>
