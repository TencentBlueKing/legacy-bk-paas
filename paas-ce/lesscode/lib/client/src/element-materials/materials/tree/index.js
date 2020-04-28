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
    name: 'tree',
    type: 'bk-tree',
    displayName: '树',
    icon: 'bk-drag-tree',
    group: '数据',
    order: 1,
    events: ['on-click', 'on-check', 'on-expanded', 'on-drag-node', 'async-load-nodes'],
    styles: ['size', 'margin'],
    props: {
        'node-key': {
            type: 'string',
            val: 'id'
        },
        'show-icon': {
            type: 'boolean',
            val: true
        },
        multiple: {
            type: 'boolean',
            val: true
        },
        'has-border': {
            type: 'boolean',
            val: false
        },
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                {
                    name: 'tree node1',
                    title: 'tree node1',
                    id: 1
                }
            ]
        },
        'ext-cls': {
            type: 'string',
            val: ''
        }
    }
}
