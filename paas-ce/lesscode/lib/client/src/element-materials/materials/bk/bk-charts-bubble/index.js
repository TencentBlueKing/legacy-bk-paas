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
    name: 'bk-charts-bubble',
    type: 'bk-charts',
    displayName: '气泡图',
    icon: 'bk-drag-bk-bubble-chart',
    group: 'BKCharts',
    order: 1,
    events: [],
    styles: ['display'],
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
            val: 200,
            tips: '图表高度，单位为px'
        },
        options: {
            type: 'json',
            val: {
                'type': 'bubble',
                'data': {
                    'datasets': [
                        {
                            'label': 'Bubble point 1',
                            'hoverBackgroundColor': 'rgba(255,111,114,0.5)',
                            'hoverBorderColor': 'rgba(255,111,114,1)',
                            'backgroundColor': 'rgba(255,111,114,0.5)',
                            'borderColor': 'rgba(255,111,114,1)',
                            'borderWidth': 1,
                            'data': [
                                { 'x': -58, 'y': -37, 'r': 7 },
                                { 'x': -80, 'y': -5, 'r': 1.8 },
                                { 'x': -3, 'y': 20, 'r': 7 },
                                { 'x': 58, 'y': -77, 'r': 6 },
                                { 'x': -16, 'y': -13, 'r': 2.8 },
                                { 'x': -23, 'y': 30, 'r': 1 }
                            ]
                        },
                        {
                            'label': 'Bubble point 2',
                            'hoverBackgroundColor': 'rgba(51,157,255,0.5)',
                            'hoverBorderColor': 'rgba(51,157,255,1)',
                            'backgroundColor': 'rgba(51,157,255,0.5)',
                            'borderColor': 'rgba(51,157,255,1)',
                            'borderWidth': 1,
                            'data': [
                                { 'x': 55, 'y': -23, 'r': 10 },
                                { 'x': 88, 'y': 33, 'r': 5 },
                                { 'x': 22, 'y': -35, 'r': 14 },
                                { 'x': 79, 'y': 59, 'r': 11 },
                                { 'x': 40, 'y': -91, 'r': 7 },
                                { 'x': 10, 'y': 33, 'r': 11.5 }
                            ]
                        }
                    ]
                },
                'options': {
                    'flexWithContainer': true,
                    'title': { 'display': true, 'text': '气泡图', 'tooltips': { 'mode': 'point' } }
                }
            },
            tips: '图表配置，配置项详见bkcharts'
        },
        remoteOptions: {
            type: 'remote',
            tips: '动态图表配置，可通过函数动态返回图表配置属性，函数返回值会覆盖上述opions里面的同名属性，\n\neg：若函数返回值为{series: [...]}，则最终的图表的渲染会使用函数返回的series数据，其它配置仍为options中的静态配置，由此可达到动态设置图表数据的效果',
            val: {
                'type': 'bubble',
                'data': {
                    'datasets': [
                        {
                            'label': 'Bubble point 1',
                            'hoverBackgroundColor': 'rgba(255,111,114,0.5)',
                            'hoverBorderColor': 'rgba(255,111,114,1)',
                            'backgroundColor': 'rgba(255,111,114,0.5)',
                            'borderColor': 'rgba(255,111,114,1)',
                            'borderWidth': 1,
                            'data': [
                                { 'x': -58, 'y': -37, 'r': 7 },
                                { 'x': -80, 'y': -5, 'r': 1.8 },
                                { 'x': -3, 'y': 20, 'r': 7 },
                                { 'x': 58, 'y': -77, 'r': 6 },
                                { 'x': -16, 'y': -13, 'r': 2.8 },
                                { 'x': -23, 'y': 30, 'r': 1 }
                            ]
                        },
                        {
                            'label': 'Bubble point 2',
                            'hoverBackgroundColor': 'rgba(51,157,255,0.5)',
                            'hoverBorderColor': 'rgba(51,157,255,1)',
                            'backgroundColor': 'rgba(51,157,255,0.5)',
                            'borderColor': 'rgba(51,157,255,1)',
                            'borderWidth': 1,
                            'data': [
                                { 'x': 55, 'y': -23, 'r': 10 },
                                { 'x': 88, 'y': 33, 'r': 5 },
                                { 'x': 22, 'y': -35, 'r': 14 },
                                { 'x': 79, 'y': 59, 'r': 11 },
                                { 'x': 40, 'y': -91, 'r': 7 },
                                { 'x': 10, 'y': 33, 'r': 11.5 }
                            ]
                        }
                    ]
                },
                'options': {
                    'flexWithContainer': true,
                    'title': { 'display': true, 'text': '气泡图', 'tooltips': { 'mode': 'point' } }
                }
            },
            remoteValidate (data) {
                console.log(data, 'valid')
                if (typeof data !== 'object') return '返回值需要是object'
            }
        }
    }
}
