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
    name: 'progress',
    type: 'bk-progress',
    displayName: '进度条',
    icon: 'bk-drag-progress',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/progress',
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    props: {
        theme: {
            type: 'string',
            options: ['primary', 'warning', 'success', 'danger'],
            val: 'primary'
        },
        percent: {
            type: 'float',
            val: 0.3,
            regExp: /^(0.\d+|0|1)$/,
            tips: '进度百分比',
            regErrorText: '请输入 0-1 之间的小数'
        },
        size: {
            type: 'string',
            options: ['small', 'normal', 'large'],
            val: 'normal'
        },
        'stroke-width': {
            type: 'number',
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
        'show-text': {
            type: 'boolean',
            val: true,
            tips: '是否显示进度条文字内容'
        },
        'title-style': {
            type: 'object',
            val: {
                fontSize: '16px',
                verticalAlign: 'middle'
            },
            tips: '设置 title 的样式'
        }
    }
}
