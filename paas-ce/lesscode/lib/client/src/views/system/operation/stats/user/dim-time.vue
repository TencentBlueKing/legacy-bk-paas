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
            <export-button name="user" dim="time" :list="exportList" :fields="exportFields" />
        </div>
        <div class="chart-list">
            <div class="chart-item">
                <div class="chart-title">用户数</div>
                <div class="chart-container" v-bkloading="{ isLoading: fetching.base }">
                    <canvas id="chart"></canvas>
                    <bk-exception v-if="!fetching.base && !chart.base.data.length"
                        class="chart-empty" type="empty" scene="part">
                    </bk-exception>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '@/api'
    import Chart from '@blueking/bkcharts'
    import ExportButton from '../export-button.vue'
    import sharedMixin from '../shared-mixin.js'
    import chartMixin from '../chart-mixin.js'

    export default {
        components: {
            ExportButton
        },
        mixins: [sharedMixin, chartMixin],
        data () {
            return {
                chart: {
                    base: {
                        inst: null,
                        data: []
                    }
                },
                filters: {
                    dateRange: [],
                    dateType: 'MONTH',
                    time: []
                },
                dateShortcutSelectedIndex: 3,
                fetching: {
                    base: false
                },
                exportFields: [
                    { id: 'time', name: '时间' },
                    { id: 'count', name: '数量' }
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
                return [
                    {
                        title: '用户数',
                        data: this.chart.base.data
                    }
                ]
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            async fetchData () {
                this.getUserCountByTime()
            },
            async getUserCountByTime () {
                this.setFilterDateTime()
                this.fetching.base = true
                try {
                    const { data: list } = await http.post('/operation/stats/user/timeline/base', this.params)
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

                const context = document.getElementById('chart')
                const dataCounts = chartData.map(item => item.count)
                const labels = chartData.map(item => item.time)

                const chartOptions = this.getLineChartOptions({ labels, data: dataCounts })
                this.chart.base.inst = new Chart(context, chartOptions)
            }
        }
    }
</script>
