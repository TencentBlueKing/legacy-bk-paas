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
    name: 'el-card',
    type: 'el-card',
    displayName: '卡片',
    icon: 'bk-drag-card',
    group: 'Other',
    order: 1,
    styles: ['size', 'margin', 'display'],
    renderStyles: {
        width: '320px',
        height: '320px',
        display: 'block'
    },
    props: {
        header: {
            type: 'string',
            val: '设置 header',
            tips: '设置 header'
        },
        'body-style': {
            type: 'object',
            val: { padding: '20px' },
            tips: '设置 body 的样式'
        },
        shadow: {
            type: 'string',
            val: 'always',
            options: ['always', 'hover', 'never'],
            tips: '设置阴影显示时机'
        },
        slots: {
            name: 'layout',
            type: 'hidden',
            val: {
                name: 'free-layout',
                type: 'free-layout',
                slotContainer: true,
                renderProps: {
                    slots: {
                        type: 'free-layout-item',
                        val:
                            [
                                {
                                    children: []
                                }
                            ]
                    }
                },
                renderStyles: { 'height': '200px', 'pointer-events': 'auto' },
                renderEvents: {},
                renderDirectives: []
            }
        }
    }
}
