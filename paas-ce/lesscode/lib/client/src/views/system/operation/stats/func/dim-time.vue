<template>
    <div class="operation-chart">
        <div class="filter">
            <bk-date-picker class="filter-item"
                v-model="filters.dateRange"
                type="daterange"
                placeholder="选择时间范围"
                :clearable="false"
                :use-shortcut-text="true"
                :shortcut-selected-index="dateShortcutSelectedIndex"
                :shortcuts="dateShortcuts[1]"
                @change="handleTimeChange"
                @shortcut-change="handleDateShortcutChange">
            </bk-date-picker>
            <bk-radio-group class="filter-item" v-model="filters.dateType" @change="handleTimeTypeChange">
                <bk-radio-button value="YEAR">按年</bk-radio-button>
                <bk-radio-button value="MONTH">按月</bk-radio-button>
                <bk-radio-button value="DAY">按天</bk-radio-button>
            </bk-radio-group>
            <export-button name="func" dim="time" :list="exportList" :fields="exportFields" />
        </div>
        <div class="chart-list">
            <div class="chart-item" v-for="chartItem in chartList" :key="chartItem.id">
                <div class="chart-title">{{chartItem.title}}</div>
                <div class="chart-container" v-bkloading="{ isLoading: fetching[chartItem.id] }">
                    <canvas :id="`chart${chartItem.name}`"></canvas>
                    <bk-exception v-if="!fetching[chartItem.id] && !chart[chartItem.id].data.length"
                        class="chart-empty" type="empty" scene="part">
                    </bk-exception>
                </div>
            </div>
        </div>

        <div class="total-list">
            <bk-table
                :outer-border="false"
                :header-border="false"
                :data="total">
                <bk-table-column
                    v-for="column in totalColumns"
                    :key="column.id"
                    :label="column.name"
                    :prop="column.id">
                    <template slot-scope="{ row }">
                        <loading :loading="fetching.total[column.id]">
                            <span>{{row[column.id] | formatCount}}</span>
                        </loading>
                    </template>
                </bk-table-column>
                <div class="append-tips" slot="append">
                    <i>* 不包含内置和已删除数据，同一页面使用同一函数多次被记作1次</i>
                </div>
            </bk-table>
        </div>
    </div>
</template>

<script>
    import http from '@/api'
    import Chart from '@blueking/bkcharts'
    import Loading from '@/components/ui/loading.vue'
    import ExportButton from '../export-button.vue'
    import sharedMixin from '../shared-mixin.js'
    import chartMixin from '../chart-mixin.js'

    export default {
        components: {
            Loading,
            ExportButton
        },
        mixins: [sharedMixin, chartMixin],
        data () {
            return {
                chart: {
                    base: {
                        title: '按时间新增函数量',
                        inst: null,
                        data: []
                    }
                },
                total: [{
                    func: null,
                    pageUsed: null
                }],
                filters: {
                    dateRange: [],
                    dateType: 'MONTH',
                    time: []
                },
                dateShortcutSelectedIndex: 3,
                fetching: {
                    base: false,
                    total: {
                        func: false,
                        pageUsed: false
                    }
                },
                exportFields: [
                    { id: 'time', name: '时间' },
                    { id: 'count', name: '数量' }
                ],
                totalColumns: [
                    { id: 'func', name: '函数总数' },
                    { id: 'pageUsed', name: '被页面使用的函数总数' }
                ]
            }
        },
        computed: {
            params () {
                const params = {
                    time: this.filters.time,
                    timeType: this.filters.dateType
                }
                return params
            },
            exportList () {
                const charts = this.chartList.map(item => ({
                    title: item.title,
                    data: this.chart[item.id].data
                }))
                return [
                    ...charts,
                    {
                        title: '汇总',
                        data: this.total,
                        fields: this.totalColumns
                    }
                ]
            }
        },
        created () {
            this.fetchData()
            this.fetchTotalData()
        },
        methods: {
            fetchData () {
                this.getFuncCountByTime()
            },
            fetchTotalData () {
                this.setFilterDateTime()
                this.getFuncTotalCount()
                this.getFuncPageUsedTotalCount()
            },
            async getFuncCountByTime () {
                this.setFilterDateTime()
                this.fetching.base = true
                try {
                    const { data: list } = await http.post('/operation/stats/func/timeline/base', this.params)
                    this.chart.base.data = list
                    this.renderBaseChart()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.base = false
                }
            },
            renderBaseChart () {
                const { inst: chartInst, data: chartData } = this.chart.base

                if (chartInst) {
                    chartInst.destroy()
                }

                if (!chartData || !chartData.length) {
                    return
                }

                const context = document.getElementById('chartBase')
                const dataCounts = chartData.map(item => item.count)
                const labels = chartData.map(item => item.time)

                const chartOptions = this.getLineChartOptions({ labels, data: dataCounts })
                this.chart.base.inst = new Chart(context, chartOptions)
            },
            async getFuncTotalCount () {
                const params = { time: this.filters.time }
                this.fetching.total.func = true
                try {
                    const { data = [] } = await http.post('/operation/stats/func/funcTotal', params)
                    this.total[0].func = data[0].total
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.total.func = false
                }
            },
            async getFuncPageUsedTotalCount () {
                const params = { time: this.filters.time }
                this.fetching.total.pageUsed = true
                try {
                    const { data = [] } = await http.post('/operation/stats/func/pageUsedTotal', params)
                    this.total[0].pageUsed = data[0].total
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fetching.total.pageUsed = false
                }
            }
        }
    }
</script>
