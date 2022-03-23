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
    name: 'van-progress',
    type: 'van-progress',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-progress',
    displayName: '进度条',
    group: '数据',
    events: [],
    styles: ['padding', 'margin'],
    renderStyles: {},
    props: {
        'percentage': {
            type: ['string', 'number'],
            val: 0,
            tips: '进度百分比'
        },
        'stroke-width': {
            type: ['string', 'number'],
            val: '4px',
            tips: '进度条粗细，默认单位为px'
        },
        'color': {
            type: 'string',
            val: '#1989fa',
            tips: '进度条颜色'
        },
        'track-color': {
            type: 'string',
            val: '#e5e5e5',
            tips: '轨道颜色'
        },
        'pivot-text': {
            type: 'string',
            val: undefined,
            tips: '进度文字内容'
        },
        'pivot-color': {
            type: 'string',
            val: '#1989fa',
            tips: '进度文字背景色'
        },
        'text-color': {
            type: 'string',
            val: 'white',
            tips: '进度文字颜色'
        },
        'inactive': {
            type: 'boolean',
            val: false,
            tips: '是否置灰'
        },
        'show-pivot': {
            type: 'boolean',
            val: true,
            tips: '是否显示进度文字'
        }
    }
}
