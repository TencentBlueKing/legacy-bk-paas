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
    name: 'card',
    type: 'bk-card',
    displayName: '卡片',
    icon: 'bk-drag-card',
    group: '反馈',
    order: 1,
    styles: ['size', 'margin', 'display'],
    renderStyles: {
        width: '320px',
        display: 'inline-block'
    },
    props: {
        title: {
            type: 'string',
            val: '卡片标题',
            tips: '卡片标题'
        },
        'is-collapse': {
            type: 'boolean',
            val: false,
            tips: '是否支持展开收起'
        },
        'collapse-status': {
            type: 'boolean',
            val: true,
            tips: '默认展开'
        },
        position: {
            type: 'string',
            val: 'left',
            options: ['left', 'right'],
            tips: '展开icon的显示位置'
        },
        'show-head': {
            type: 'boolean',
            val: true,
            tips: '是否显示头部'
        },
        'show-foot': {
            type: 'boolean',
            val: false,
            tips: '是否显示底部'
        },
        border: {
            type: 'boolean',
            val: true,
            tips: '是否显示边框'
        }
    },
    slots: {
        header: {
            name: ['layout'],
            type: ['free-layout'],
            renderStyles: {
                'height': '50px'
            },
            children: [
                {
                    name: ['text'],
                    type: ['span'],
                    renderStyles: {
                        top: '0px',
                        left: '0px'
                    }
                }
            ]
        },
        default: {
            name: ['layout'],
            type: ['free-layout'],
            renderStyles: {
                'height': '200px'
            }
        },
        footer: {
            name: ['layout'],
            type: ['free-layout'],
            renderStyles: {
                'height': '50px'
            }
        }
    }
}
