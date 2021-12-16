/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

export default {
    name: 'bk-charts-line',
    type: 'bk-charts',
    displayName: '折线图',
    icon: 'bk-drag-line-chart',
    group: 'BKCharts',
    order: 1,
    events: [],
    styles: ['display'],
    renderStyles: {
        display: 'inline-block'
    },
    renderProps: {
        width: {
            val: '400px'
        },
        height: {
            val: 200
        }
    },
    props: {
        width: {
            type: 'size'
        },
        height: {
            type: 'number',
            tips: '图表高度，单位为px'
        },
        options: {
            type: 'json',
            val: {
                type: 'line',
                data: {
                    labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July'
                    ],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    flexWithContainer: true
                }
            },
            tips: '图表配置，配置项详见bkcharts'
        },
        remoteOptions: {
            type: 'remote',
            tips: '动态图表配置，可通过函数动态返回图表配置属性，函数返回值会覆盖上述opions里面的同名属性，\n\neg：若函数返回值为{series: [...]}，则最终的图表的渲染会使用函数返回的series数据，其它配置仍为options中的静态配置，由此可达到动态设置图表数据的效果',
            val: {
                type: 'line',
                data: {
                    labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July'
                    ],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    flexWithContainer: true
                }
            },
            remoteValidate (data) {
                console.log(data, 'valid')
                if (typeof data !== 'object') return '返回值需要是object'
            }
        }
    }
}
