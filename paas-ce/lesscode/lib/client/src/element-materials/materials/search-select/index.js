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
    name: 'search-select',
    type: 'bk-search-select',
    displayName: '查询选择',
    icon: 'bk-drag-search',
    group: '表单',
    order: 1,
    events: ['show-menu', 'input-change', 'input-cut', 'input-click', 'input-focus', 'menu-select', 'menu-child-select', 'change', 'key-delete', 'key-enter', 'child-checked', 'clear'],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'block'
    },
    props: {
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                {
                    name: '实例状态',
                    id: '1',
                    multiable: true,
                    children: [
                        { name: '创建中', id: '1-2' },
                        { name: '运行中', id: '1-3' },
                        { name: '已关机', id: '1-4' }
                    ]
                },
                {
                    name: '实例业务',
                    id: '2',
                    children: [
                        { name: '王者荣耀', id: '2-1' },
                        { name: '刺激战场', id: '2-2' },
                        { name: '绝地求生', id: '2-3' }
                    ]
                },
                { name: 'IP地址', id: '3' },
                { name: '实例名', id: '4' },
                { name: '实例地址', id: '5' },
                { name: '测试六', id: '6' }
            ]
        },
        values: {
            type: 'array',
            val: []
        },
        'split-code': {
            type: 'string',
            val: '|'
        },
        'explain-code': {
            type: 'string',
            val: '|'
        },
        placeholder: {
            type: 'string',
            val: ''
        },
        'empty-text': {
            type: 'string',
            val: ''
        },
        'max-height': {
            type: 'number',
            val: 120
        },
        'min-height': {
            type: 'number',
            val: 32
        },
        strink: {
            type: 'boolean',
            val: true
        },
        'show-delay': {
            type: 'number',
            val: 100
        },
        'display-key': {
            type: 'string',
            val: 'name'
        },
        'primary-key': {
            type: 'string',
            val: 'id'
        },
        condition: {
            type: 'object',
            val: {}
        },
        filter: {
            type: 'boolean',
            val: false
        },
        'show-condition': {
            type: 'boolean',
            val: true
        },
        'key-delay': {
            type: 'number',
            val: 300
        },
        readonly: {
            type: 'boolean',
            val: false
        },
        'wrap-zindex': {
            type: 'string',
            val: '9'
        },
        'default-focus': {
            type: 'boolean',
            val: false
        },
        'input-type': {
            type: 'string',
            val: 'text'
        },
        'ext-cls': {
            type: 'string',
            val: ''
        }
    }
}
