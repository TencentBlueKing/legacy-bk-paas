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
    name: 'pagination',
    type: 'bk-pagination',
    displayName: '分页',
    icon: 'bk-drag-pagination',
    group: '数据',
    order: 1,
    events: ['change', 'limit-change'],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'block'
    },
    props: {
        limit: {
            type: 'number',
            options: [10, 20, 50, 100],
            val: 10
        },
        count: {
            type: 'number',
            val: 10
        },
        current: {
            type: 'number',
            val: 1
        },
        type: {
            type: 'string',
            options: ['default', 'compact'],
            val: 'default'
        },
        'limit-list': {
            type: 'array',
            val: [10, 20, 50, 100]
        },
        'show-limit': {
            type: 'boolean',
            val: true
        }
    }
}
