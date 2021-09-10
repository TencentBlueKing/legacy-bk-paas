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
                placeholder="按名称/ID搜索"
                right-icon="bk-icon icon-search"
                @clear="handleKeywordClear"
                @enter="handleKeywordEnter"
                v-model="filters.keyword">
            </bk-input>
            <export-button name="comp" :list="list" :fields="exportFields" />
        </div>
        <div class="data-list" v-bkloading="{ isLoading: fetching.base }">
            <bk-table
                v-show="!fetching.base"
                :data="list"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="自定义组件名" prop="fullName" width="360" show-overflow-tooltip></bk-table-column>
                <bk-table-column label="自定义组件ID" prop="type" width="300" show-overflow-tooltip></bk-table-column>
                <bk-table-column label="使用项目数">
                    <template slot-scope="{ row }">
                        <loading :loading="fetching.projectUsedCount">
                            <span>{{row.projectUsedCount | formatCount}}</span>
                        </loading>
                    </template>
                </bk-table-column>
                <bk-table-column label="使用页面数">
                    <template slot-scope="{ row }">
                        <loading :loading="fetching.pageUsedCount">
                            <span>{{row.pageUsedCount | formatCount}}</span>
                        </loading>
                    </template>
                </bk-table-column>
                <bk-table-column label="版本数">
                    <template slot-scope="{ row }">
                        <loading :loading="fetching.versionCount">
                            <span>{{row.versionCount | formatCount}}</span>
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
                filters: {
                    keyword: '',
                    dateRange: []
                },
                exportFields: [
                    { id: 'fullName', name: '自定义组件名' },
                    { id: 'type', name: '自定义组件ID' },
                    { id: 'projectUsedCount', name: '使用项目数' },
                    { id: 'pageUsedCount', name: '使用页面数' },
                    { id: 'versionCount', name: '版本数' }
                ],
                fetching: {
                    base: false,
                    projectUsedCount: false,
                    pageUsedCount: false,
                    versionCount: false
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
            fetchData () {
                this.getCompBase()
            },
            async getCompBase () {
                this.fetching.base = true
                try {
                    const { data: [list, total] } = await http.post('/operation/stats/comp/base', this.params)
                    this.list = list.map((item) => ({
                        ...item,
                        fullName: `${item.displayName}(${item.name})`,
                        projectUsedCount: 0,
                        pageUsedCount: 0,
                        versionCount: 0
                    }))
                    this.pagination.count = total

                    if (this.list && this.list.length) {
                        this.getCompProjectUsedCount()
                        this.getCompPageUsedCount()
                        this.getCompVersionCount()
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.base = false
                }
            },
            async getCompProjectUsedCount () {
                const compIds = this.list.map(item => item.id)
                this.fetching.projectUsedCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/comp/projectUsedCount', { compIds })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(comp => comp.id === item.compId)
                        updateItem.projectUsedCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.projectUsedCount = false
                }
            },
            async getCompPageUsedCount () {
                const compIds = this.list.map(item => item.id)
                this.fetching.pageUsedCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/comp/pageUsedCount', { compIds })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(comp => comp.id === item.compId)
                        updateItem.pageUsedCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.pageUsedCount = false
                }
            },
            async getCompVersionCount () {
                const compIds = this.list.map(item => item.id)
                this.fetching.versionCount = true
                try {
                    const { data: countList } = await http.post('/operation/stats/comp/versionCount', { compIds })
                    countList.forEach((item) => {
                        const updateItem = this.list.find(comp => comp.id === item.componentId)
                        updateItem.versionCount = Number(item.count)
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.versionCount = false
                }
            }
        }
    }
</script>
