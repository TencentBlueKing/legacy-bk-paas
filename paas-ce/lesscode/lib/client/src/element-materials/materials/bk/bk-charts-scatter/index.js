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
    name: 'bk-charts-scatter',
    type: 'bk-charts',
    displayName: '散点图',
    icon: 'bk-drag-bk-scatter-chart',
    group: 'BKCharts',
    order: 1,
    events: [],
    styles: [
        {
            name: 'size',
            include: ['display']
        }
    ],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        width: {
            type: 'size',
            val: '400px'
        },
        height: {
            type: 'number',
            tips: '图表高度，单位为px',
            val: 200
        },
        options: {
            type: 'json',
            val: {
                'type': 'scatter',
                'data': {
                    'datasets': [
                        {
                            'label': 'Scatter Dataset',
                            'borderColor': 'rgba(255,111,114,1)',
                            'backgroundColor': 'rgba(255,111,114,1)',
                            'pointRadius': 3,
                            'data': [
                                { 'x': 39.8, 'y': -8.607 },
                                { 'x': 50.1, 'y': -10.38 },
                                { 'x': 100, 'y': -16.07 },
                                { 'x': 126, 'y': -18.03 },
                                { 'x': 158, 'y': -20 },
                                { 'x': 200, 'y': -21.99 },
                                { 'x': 251, 'y': -23.98 },
                                { 'x': 316, 'y': -25.97 },
                                { 'x': 398, 'y': -27.97 },
                                { 'x': 501, 'y': -29.96 },
                                { 'x': 631, 'y': -31.96 },
                                { 'x': 794, 'y': -33.96 }
                            ]
                        }
                    ]
                },
                'options': {
                    'flexWithContainer': true,
                    'scales': { 'xAxes': { 'type': 'linear', 'position': 'bottom' } }

                }
            },
            tips: '图表配置，配置项详见bkcharts'
        },
        remoteOptions: {
            type: 'remote',
            tips: '动态图表配置，可通过函数动态返回图表配置属性，函数返回值会覆盖上述opions里面的同名属性，\n\neg：若函数返回值为{series: [...]}，则最终的图表的渲染会使用函数返回的series数据，其它配置仍为options中的静态配置，由此可达到动态设置图表数据的效果',
            val: {
                'type': 'scatter',
                'data': {
                    'datasets': [
                        {
                            'label': 'Scatter Dataset',
                            'borderColor': 'rgba(255,111,114,1)',
                            'backgroundColor': 'rgba(255,111,114,1)',
                            'pointRadius': 3,
                            'data': [
                                { 'x': 39.8, 'y': -8.607 },
                                { 'x': 50.1, 'y': -10.38 },
                                { 'x': 100, 'y': -16.07 },
                                { 'x': 126, 'y': -18.03 },
                                { 'x': 158, 'y': -20 },
                                { 'x': 200, 'y': -21.99 },
                                { 'x': 251, 'y': -23.98 },
                                { 'x': 316, 'y': -25.97 },
                                { 'x': 398, 'y': -27.97 },
                                { 'x': 501, 'y': -29.96 },
                                { 'x': 631, 'y': -31.96 },
                                { 'x': 794, 'y': -33.96 }
                            ]
                        }
                    ]
                },
                'options': {
                    'flexWithContainer': true,
                    'scales': { 'xAxes': { 'type': 'linear', 'position': 'bottom' } }

                }
            },
            remoteValidate (data) {
                console.log(data, 'valid')
                if (typeof data !== 'object') return '返回值需要是object'
            }
        }
    }
}
