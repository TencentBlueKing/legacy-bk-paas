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
    name: 'van-tag',
    type: 'van-tag',
    // bk-drag-custom-comp-default
    icon: '',
    displayName: '标签',
    group: '数据',
    events: [
        { name: 'click-left', tips: '点击左侧按钮时触发' },
        { name: 'click-right', tips: '点击右侧按钮时触发' }
    ],
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    props: {
        'type': {
            type: 'string',
            val: 'default',
            options: ['primary', 'success', 'danger', 'warning', 'default'],
            tips: '类型'
        },
        'size': {
            type: 'string',
            val: '',
            options: ['large', 'medium'],
            tips: '类型'
        },
        'color': {
            type: 'string',
            val: '',
            tips: '标签颜色'
        },
        'plain': {
            type: 'boolean',
            val: false,
            tips: '是否为空心样式'
        },
        'round': {
            type: 'boolean',
            val: false,
            tips: '是否为圆角样式'
        },
        'mark': {
            type: 'boolean',
            val: false,
            tips: '是否为标记样式'
        },
        'text-color': {
            type: 'string',
            val: '',
            tips: '文本颜色，优先级高于color属性'
        },
        'closeable': {
            type: 'boolean',
            val: false,
            tips: '是否为可关闭标签'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            displayName: '文本配置',
            val: '文字标记'
        }
    }
}
