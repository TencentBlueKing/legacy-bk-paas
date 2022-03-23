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
    name: 'van-loading',
    type: 'van-loading',
    // bk-drag-custom-comp-default
    icon: '',
    displayName: '加载',
    group: '反馈',
    styles: ['padding', 'margin', 'font'],
    renderStyles: {
    },
    events: [
        { name: 'finish', tips: '倒计时结束时触发' },
        { name: 'change', tips: '倒计时变化时触发, 回调参数（timeData: TimeData）' }
    ],
    props: {
        'color': {
            type: 'string',
            val: '#c9c9c9',
            tips: '颜色'
        },
        'type': {
            type: 'string',
            options: ['spinner', 'circular'],
            val: 'circular',
            tips: '类型'
        },
        'size': {
            type: ['string', 'number'],
            val: '30px',
            tips: '加载图标大小，默认单位为 px'
        },
        'vertical': {
            type: 'boolean',
            val: false,
            tips: '是否垂直排列图标和文字内容'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            displayName: '',
            val: ''
        }
    }
}
