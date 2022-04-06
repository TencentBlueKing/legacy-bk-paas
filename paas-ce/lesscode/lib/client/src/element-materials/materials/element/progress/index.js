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
    name: 'el-progress',
    type: 'el-progress',
    displayName: '进度条',
    icon: 'bk-drag-progress',
    group: '数据',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/progress',
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    props: {
        percentage: {
            type: 'float',
            val: 30,
            tips: '进度百分比',
            regErrorText: '请输入 0-100 之间的数'
        },
        type: {
            type: 'string',
            options: ['line', 'circle', 'dashboard'],
            val: 'line',
            tips: '进度条类型'
        },
        status: {
            type: 'string',
            options: ['success', 'exception', 'warning'],
            val: '',
            tips: '进度条当前状态'
        },
        'stroke-width': {
            type: 'number',
            val: 6,
            tips: '进度条的宽度，单位 px'
        },
        'text-inside': {
            type: 'boolean',
            val: false,
            tips: '进度条显示文字内置在进度条内'
        },
        color: {
            type: 'string',
            tips: '进度条背景色'
        },
        width: {
            type: 'number',
            val: 126,
            tips: '环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）'
        },
        'show-text': {
            type: 'boolean',
            val: true,
            tips: '是否显示进度条文字内容'
        },
        'stroke-linecap': {
            type: 'string',
            options: ['butt', 'round', 'square'],
            val: 'round',
            tips: 'circle/dashboard 类型路径两端的形状'
        }
    }
}
