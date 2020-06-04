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
    name: 'chart-bar',
    type: 'chart',
    displayName: '柱状图',
    icon: 'bk-drag-histogram',
    group: '图表',
    order: 1,
    events: [],
    styles: [],
    props: {
        width: {
            type: 'number',
            val: '',
            tips: '图表宽度，单位为px，为空则默认为100%'
        },
        height: {
            type: 'number',
            val: 300,
            tips: '图表高度，单位为px'
        },
        options: {
            type: 'json',
            val: {
                title: {
                    text: '柱状图demo',
                    x: 'center'
                },
                tooltip: {},
                legend: {
                    data: ['issue数量'],
                    left: 'left'
                },
                xAxis: {
                    data: ['一', '二', '三', '四', '五']
                },
                yAxis: {},
                series: [{
                    name: 'issue数量',
                    type: 'bar',
                    data: [3, 5, 8, 3, 5]
                }]
            },
            tips: '图表配置，配置项同echarts'
        }
    }
}
