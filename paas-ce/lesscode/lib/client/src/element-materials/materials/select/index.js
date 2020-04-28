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
    name: 'select',
    type: 'bk-select',
    displayName: '下拉选框',
    icon: 'bk-drag-select',
    group: '表单',
    order: 1,
    events: ['selected', 'toggle', 'change', 'clear'],
    styles: ['size', 'padding', 'margin', 'display', 'font', 'border', 'backgroundColor'],
    props: {
        value: {
            type: 'string',
            val: ''
        },
        multiple: {
            type: 'boolean',
            val: true
        },
        'show-select-all': {
            type: 'boolean',
            val: true
        },
        'scroll-height': {
            type: 'number',
            val: 216
        },
        placeholder: {
            type: 'string',
            val: ''
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        readonly: {
            type: 'boolean',
            val: false
        },
        loading: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: false
        },
        searchable: {
            type: 'boolean',
            val: false
        },
        'search-ignore-case': {
            type: 'boolean',
            val: false
        },
        'popover-min-width': {
            type: 'number',
            val: 0
        },
        'popover-width': {
            type: 'number',
            val: 0
        },
        'font-size': {
            type: 'string',
            val: ''
        },
        'ext-cls': {
            type: 'string',
            val: ''
        },
        'ext-popover-cls': {
            type: 'string',
            val: ''
        },
        'z-index': {
            type: 'number',
            val: 2500
        },
        slots: {
            name: 'bk-option',
            type: ['option', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('id') || !item.hasOwnProperty('name')))
                if (errData) return '返回值每个元素需要含有Id和Name字段'
            },
            val: [
                { id: 1, name: '爬山' },
                { id: 2, name: '跑步' },
                { id: 3, name: '打球' },
                { id: 4, name: '跳舞' },
                { id: 5, name: '健身' },
                { id: 6, name: '骑车' }
            ],
            attrs: [
                { 'key': 'id', 'value': 'id' },
                { 'key': 'name', 'value': 'name' },
                { 'key': 'key', 'value': 'id' }
            ]
        }
    }
}
