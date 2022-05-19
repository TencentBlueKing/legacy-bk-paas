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
    name: 'round-progress',
    type: 'bk-round-progress',
    displayName: '圆形进度',
    icon: 'bk-drag-roundprogress',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/round-progress',
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    directives: [],
    props: {
        percent: {
            type: 'float',
            val: 0.3,
            regExp: /^(0.\d+|0|1)$/,
            tips: '显示目前进度，可选值 0 < percent < 1',
            regErrorText: '请输入 0-1 之间的小数'
        },
        width: {
            type: 'string',
            val: '100px',
            tips: '圆环的大小'
        },
        'num-show': {
            type: 'boolean',
            val: true,
            tips: '是否显示目前百分数值'
        },
        'num-style': {
            type: 'object',
            val: { fontSize: '16px' },
            tips: '设置显示百分数的 css 样式'
        },
        title: {
            type: 'string',
            tips: '标题名，默认不显示'
        },
        'title-style': {
            type: 'object',
            val: { fontSize: '16px' },
            tips: '设置 title 的 css 样式'
        },
        config: {
            type: 'object',
            val: {
                strokeWidth: 10,
                bgColor: '#f0f1f5',
                activeColor: '#2dcb56'
            },
            tips: '设置进度圆环的颜色 bgColor、宽度 strokeWidth、背景色 bgColor'
        }
    }
}
