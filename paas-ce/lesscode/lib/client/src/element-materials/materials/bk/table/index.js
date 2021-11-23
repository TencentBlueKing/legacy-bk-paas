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
    events: [{
        name: 'select', tips: '当用户手动勾选数据行的 Checkbox 时调用该事件函数，事件回调参数 (selection: Array, row: Object)'
    }, {
        name: 'select-all', tips: '当用户手动勾选全选 Checkbox 时调用该事件函数，事件回调参数 (selection: Array)'
    }, {
        name: 'selection-change', tips: '当选择项发生变化时调用该事件函数，事件回调参数 (selection: Array)'
    }, {
        name: 'cell-mouse-enter', tips: '当单元格 hover 进入时调用该事件函数，事件回调参数 (row: Object, column: Object, cell: Object, event: Event)'
    }, {
        name: 'cell-mouse-leave', tips: '当单元格 hover 退出时调用该事件函数，事件回调参数 (row: Object, column: Object, cell: Object, event: Event)'
    }, {
        name: 'row-mouse-enter', tips: '当表格行 hover 进入时调用该事件函数，事件回调参数 (index: Number, row: Object, event: Event)'
    }, {
        name: 'row-mouse-leave', tips: '当表格行 hover 退出时调用该事件函数，事件回调参数 (index: Number, row: Object, event: Event)'
    }, {
        name: 'cell-click', tips: '当某个单元格被点击时调用该事件函数，事件回调参数 (row: Object, column: Object, cell: Object, event: Event)'
    }, {
        name: 'cell-dblclick', tips: '当某个单元格被双击击时调用该事件函数，事件回调参数 (row: Object, column: Object, cell: Object, event: Event)'
    }, {
        name: 'row-click', tips: '当某一行被点击时调用该事件函数，事件回调参数 (row: Object, event: Event, column: Object)'
    }, {
        name: 'row-contextmenu', tips: '当某一行被鼠标右键点击时调用该事件函数，事件回调参数 (row: Object, event: Event)'
    }, {
        name: 'row-dblclick', tips: '当某一行被双击时调用该事件函数，事件回调参数 (row: Object, event: Event)'
    }, {
        name: 'header-click', tips: '当某一列的表头被点击时调用该事件函数，事件回调参数 (column: Object, event: Event)'
    }, {
        name: 'header-contextmenu', tips: '当某一列的表头被鼠标右键点击时调用该事件函数，事件回调参数 (column: Object, event: Event)'
    }, {
        name: 'sort-change', tips: '当表格的排序条件发生变化时调用该事件函数，事件回调参数 (data: { column, prop, order })'
    }, {
        name: 'filter-change', tips: '当表格的筛选条件发生变化时调用该事件函数，事件回调参数 (filters: { key, value })。参数对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。'
    }, {
        name: 'current-change', tips: '当表格的当前行发生变化时调用该事件函数，如果要高亮当前行，请打开表格的 highlight-current-row 属性，事件回调参数 (currentRow: Object, oldCurrentRow: Object)'
    }, {
        name: 'header-dragend', tips: '当拖动表头改变了列的宽度时调用该事件函数，事件回调参数 (newWidth: Number, oldWidth: Number, column: Object, event: Event)'
    }, {
        name: 'expand-change', tips: '当用户对某一行展开或者关闭时调用该事件函数，事件回调参数 (row: Object, expandedRows: Array)'
    }, {
        name: 'page-change', tips: '当用户切换表格分页时调用该事件函数，事件回调参数 (newPage: Number)'
    }, {
        name: 'page-limit-change', tips: '当用户切换表格每页显示条数时调用该事件函数，事件回调参数 (limit: Number)'
    }],
    styles: ['size', 'margin', 'display'],
    directives: [
        {
            type: 'v-bind',
            prop: 'data',
            propTypes: ['array'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        data: {
            type: ['array', 'remote', 'table-data-source'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                { prop1: '1-1', prop2: '1-2', prop3: '1-3' },
                { prop1: '2-1', prop2: '2-2', prop3: '2-3' },
                { prop1: '3-1', prop2: '3-2', prop3: '3-3' }
            ],
            tips: '显示的数据'
        },
        height: {
            type: ['string', 'number'],
            tips: 'Table 的高度，默认为自动高度。如果 height 为 Number 类型，单位 px；如果 height 为 String 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。'
        },
        'max-height': {
            type: ['string', 'number']
        },
        stripe: {
            type: 'boolean',
            val: false,
            tips: '是否为斑马纹 Table'
        },
        border: {
            type: 'boolean',
            val: false,
            tips: '是否带有边框'
        },
        'outer-border': {
            type: 'boolean',
            val: false,
            tips: '是否带有外边框'
        },
        'row-border': {
            type: 'boolean',
            val: true,
            tips: '是否带有横向边框, 当 border 为 true 时，此属性设置无效'
        },
        'col-border': {
            type: 'boolean',
            val: false,
            tips: '是否带有纵向边框, 当 border 为 true 时，此属性设置无效'
        },
        size: {
            type: 'string',
            val: 'medium',
            options: ['small', 'medium', 'large']
        },
        fit: {
            type: 'boolean',
            val: true,
            tips: '列的宽度是否自动撑开'
        },
        'show-header': {
            type: 'boolean',
            val: true,
            tips: '是否显示表头'
        },
        'highlight-current-row': {
            type: 'boolean',
            val: false,
            tips: '是否高亮当前行'
        },
        'pagination': {
            type: 'object',
            val: {
                current: 1,
                count: 3,
                limit: 10,
                limitList: [10, 20, 50, 100],
                showLimit: false
            },
            tips: ''
                + '设置分页信息<br>'
                + 'count: 总数据量<br>'
                + 'current: 当前页码，正整数<br>'
                + 'limit: 每页显示条数(须存在于 limitList 中) <br>'
                + 'limitList: 每页显示条数可选项列表<br>'
                + 'showLimit: 是否显示每页显示条数控件<br>'
        },
        'show-pagination-info': {
            type: 'boolean',
            val: true,
            tips: '是否显示分页条中共计XX条的信息'
        }
    },
    slots: {
        default: {
            name: ['bk-table-column'],
            type: ['table-list', 'remote'],
            displayName: '表头配置',
            val: [
                { label: '第一列', prop: 'prop1', sortable: false, type: '' },
                { label: '第二列', prop: 'prop2', sortable: false, type: '' },
                { label: '第三列', prop: 'prop3', sortable: false, type: '' }
            ]
        }
    }
}
