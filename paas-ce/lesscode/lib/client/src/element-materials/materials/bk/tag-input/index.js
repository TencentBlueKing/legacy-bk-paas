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
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/tag',
    events: [
        {
            name: 'change',
            tips: '数据发生变化时调用该事件函数，事件回调参数 (tags: Array)'
        },
        {
            name: 'select',
            tips: '选择数据后调用该事件函数，暂无事件回调参数'
        },
        {
            name: 'remove',
            tips: '删除数据后调用该事件函数，暂无事件回调参数'
        },
        {
            name: 'removeAll',
            tips: '一键清空数据后调用该事件函数，暂无事件回调参数'
        },
        {
            name: 'blur',
            tips: '输入状态时失焦时调用该事件函数，事件回调参数 (inputStr: String, tags: Array)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        display: 'inline-block',
        width: '300px',
        verticalAlign: 'middle'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
        // {
        //     type: 'v-bind',
        //     prop: 'list',
        //     format: 'variable',
        //     valueTypeInclude: ['array']
        // }
    ],
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
            ],
            tips: '下拉菜单所需的数据列表'
        },
        placeholder: {
            type: 'string',
            tips: '空白提示'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        'save-key': {
            type: 'string',
            val: 'id',
            tips: '循环 list 时，保存字段的 key 值'
        },
        'search-key': {
            type: 'string',
            val: 'name',
            tips: '输入时，搜索的 key 值'
        },
        'display-key': {
            type: 'string',
            val: 'name',
            tips: '循环 list 时，显示字段的 key 值'
        },
        'has-delete-icon': {
            type: 'boolean',
            val: true,
            tips: '是否显示删除按钮'
        },
        clearable: {
            type: 'boolean',
            val: true,
            tips: '是否允许清空'
        },
        'allow-create': {
            type: 'boolean',
            val: false,
            tips: '是否允许自定义标签输入'
        },
        'max-data': {
            type: 'number',
            val: -1,
            tips: '是否限制可选个数，-1为不限制'
        },
        'use-group': {
            type: 'boolean',
            val: false,
            tips: '是否显示分组'
        },
        'max-result': {
            type: 'number',
            val: 10,
            tips: '下拉列表搜索结果显示个数，默认为 10'
        },
        'content-width': {
            type: 'number',
            val: 190,
            tips: '自定义设置下拉弹框的宽度，单选会撑满因此失效'
        },
        'content-max-width': {
            type: 'number',
            val: 300,
            tips: '自定义设置下拉弹框的长度'
        },
        separator: {
            type: 'string',
            tips: '输入分隔符号，支持批量输入'
        },
        'left-space': {
            type: 'number',
            val: 0,
            tips: '文字与左边框距离'
        }
    }
}
