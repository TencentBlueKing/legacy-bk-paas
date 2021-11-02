export default {
    computed: {
        chartList () {
            const chartList = []
            Object.keys(this.chart).forEach(key => {
                const item = this.chart[key]
                chartList.push({
                    id: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    title: item.title
                })
            })
            return chartList
        }
    },
    methods: {
        getLineChartOptions (options) {
            const { labels, data } = options
            const maxNumber = Math.max(...data)

            // 得出合适的刻度
            const interval = this.getYAxisInterval(maxNumber)
            const yMax = maxNumber + (interval - (maxNumber % interval))

            return {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            fill: false,
                            backgroundColor: 'rgb(102 174 222 / 67%)',
                            borderColor: '#66AEDE',
                            tension: 0.1,
                            data
                        }
                    ]
                },
                options: {
                    layout: { padding: 0 },
                    flexWithContainer: true,
                    plugins: {
                        legend: false,
                        title: false
                    },
                    scales: {
                        yAxes: {
                            min: 0,
                            max: yMax,
                            ticks: {
                                stepSize: interval
                            }
                        },
                        xAxes: { scaleLabel: { display: true } }
                    }
                }
            }
        },
        getYAxisInterval (max) {
            let interval = 1
            if (max >= 0 && max <= 10) {
                interval = 1
            } else if (max > 10 && max <= 20) {
                interval = 2
            } else if (max > 20 && max <= 50) {
                interval = 5
            } else if (max > 50 && max <= 100) {
                interval = 10
            } else if (max > 100 && max <= 1000) {
                interval = 100
            } else if (max > 1000 && max <= 5000) {
                interval = 500
            } else if (max > 5000 && max <= 10000) {
                interval = 1000
            } else if (max > 10000 && max <= 20000) {
                interval = 2000
            } else if (max > 20000 && max <= 50000) {
                interval = 5000
            } else if (max > 50000 && max <= 100000) {
                interval = 10000
            } else if (max > 100000 && max <= 500000) {
                interval = 20000
            } else if (max > 500000 && max <= 1000000) {
                interval = 50000
            } else if (max > 1000000 && max <= 5000000) {
                interval = 500000
            } else if (max > 5000000 && max <= 10000000) {
                interval = 1000000
            } else {
                interval = 10000000
            }

            return interval
        }
    }
}
