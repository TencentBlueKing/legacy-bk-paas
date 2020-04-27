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
    name: 'tag-input',
    type: 'bk-tag-input',
    displayName: '标签输入',
    icon: 'bk-drag-tag',
    group: '表单',
    order: 1,
    events: ['change', 'select', 'remove', 'removeAll'],
    styles: ['size', 'margin', 'display'],
    props: {
        list: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                { id: 'shenzhen', name: '深圳' },
                { id: 'guangzhou', name: '广州' },
                { id: 'beijing', name: '北京' },
                { id: 'shanghai', name: '上海' },
                { id: 'hangzhou', name: '杭州' },
                { id: 'nanjing', name: '南京' },
                { id: 'chognqing', name: '重庆' },
                { id: 'taibei', name: '台北' },
                { id: 'haikou', name: '海口' }
            ]
        },
        placeholder: {
            type: 'string',
            val: ''
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        'save-key': {
            type: 'string',
            val: ''
        },
        'search-key': {
            type: 'string',
            val: ''
        },
        'display-key': {
            type: 'string',
            val: ''
        },
        'has-delete-icon': {
            type: 'boolean',
            val: true
        },
        'allow-create': {
            type: 'boolean',
            val: true
        },
        'max-data': {
            type: 'number',
            val: -1
        },
        'use-group': {
            type: 'boolean',
            val: false
        },
        'max-result': {
            type: 'number',
            val: 10
        },
        'content-width': {
            type: 'number',
            val: 190
        },
        'content-max-width': {
            type: 'number',
            val: 300
        },
        separator: {
            type: 'string',
            val: ''
        },
        'left-space': {
            type: 'number',
            val: 0
        },
        'ext-cls': {
            type: 'string',
            val: ''
        }
    }
}
