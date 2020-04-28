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
    name: 'table',
    type: 'bk-table',
    displayName: '表格',
    icon: 'bk-drag-table',
    group: '数据',
    order: 1,
    events: [
        'select',
        'select-all',
        'selection-change',
        'cell-mouse-enter',
        'cell-mouse-leave',
        'row-mouse-enter',
        'row-mouse-leave',
        'cell-click',
        'cell-dblclick',
        'row-click',
        'row-contextmenu',
        'row-dblclick',
        'header-click',
        'header-contextmenu',
        'sort-change',
        'filter-change',
        'current-change',
        'header-dragend',
        'expand-change',
        'page-change'
    ],
    styles: ['size', 'margin', 'display'],
    props: {
        slots: {
            name: 'bk-table-column',
            type: 'table-column',
            val: [
                { label: '第一列', prop: 'prop1', sortable: false },
                { label: '第二列', prop: 'prop2', sortable: false },
                { label: '第三列', prop: 'prop3', sortable: false }
            ]
        },
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                { prop1: '1-1', prop2: '1-2', prop3: '1-3' },
                { prop1: '2-1', prop2: '2-2', prop3: '2-3' },
                { prop1: '3-1', prop2: '3-2', prop3: '3-3' }
            ]
        },
        height: {
            type: ['string', 'number']
        },
        'max-height': {
            type: ['string', 'number']
        },
        stripe: {
            type: 'boolean',
            va: false
        },
        border: {
            type: 'boolean',
            va: false
        },
        'outer-border': {
            type: 'boolean',
            va: false
        },
        'row-border': {
            type: 'boolean',
            va: true
        },
        'col-border': {
            type: 'boolean',
            va: false
        },
        size: {
            type: 'string',
            val: 'medium',
            options: ['small', 'medium', 'large']
        },
        fit: {
            type: 'boolean',
            val: true
        },
        'show-header': {
            type: 'boolean',
            val: true
        },
        'highlight-current-row': {
            type: 'boolean',
            val: false
        }
    }
}
