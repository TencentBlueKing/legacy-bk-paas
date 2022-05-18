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
                placeholder="按用户名搜索"
                right-icon="bk-icon icon-search"
                @clear="handleKeywordClear"
                @enter="handleKeywordEnter"
                v-model="filters.keyword">
            </bk-input>
            <export-button name="user" :list="list" :fields="exportFields" />
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
                    :sortable="column.sortable">
                    <template slot-scope="{ row }">
                        <loading v-if="column.dynamic" :loading="fetching[column.id]">
                            <span v-if="column.type === 'number'">{{row[column.id] | formatCount}}</span>
                            <span v-else>{{row[column.id]}}</span>
                        </loading>
                        <template v-else>{{row[column.id]}}</template>
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
    import tableListMixin from '../table-list-mixin.js'

    export default {
        components: {
            Loading,
            ExportButton
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
                orderBy: undefined,
                columns: [
                    { id: 'username', name: '用户名', width: '360' },
                    { id: 'projectCount', name: '应用数', sortable: 'custom', dynamic: true, type: 'number' },
                    { id: 'pageCount', name: '页面数', sortable: 'custom', dynamic: true, type: 'number' }
                ],
                filters: {
                    keyword: '',
                    dateRange: []
                },
                fetching: {
                    base: false
                }
            }
        },
        computed: {
            params () {
                const params = {
                    user: this.filters.keyword,
                    time: this.timeParam, // mixin
                    pageSize: this.pagination.limit,
                    pageNum: this.pagination.current,
                    orderBy: this.orderBy
                }
                return params
            }
        },
        created () {
            this.setFetching()
            this.fetchData()
        },
        methods: {
            fetchData () {
                this.getUserBase()
            },
            async getUserBase () {
                this.fetching.base = true
                try {
                    const { data: [list, total] } = await http.post('/operation/stats/user/base', this.params)
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
                this.getUserProjectCount()
                this.getUserPageCount()
            },
            async getUserProjectCount () {
                const users = this.list.map(item => item.username)
                this.fetching.projectCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/user/projectCount', { users })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(user => user.username === item.username)
                        updateItem.projectCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.projectCount = false
                }
            },
            async getUserPageCount () {
                const users = this.list.map(item => item.username)
                this.fetching.pageCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/user/pageCount', { users })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(user => user.username === item.username)
                        updateItem.pageCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.pageCount = false
                }
            }
        }
    }
</script>
