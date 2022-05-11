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
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/select',
    events: [
        {
            name: 'selected',
            tips: '选择列表时调用该事件函数，多选时，回调参数均为数组(value: String | Number | Array, option: Object | Array)'
        },
        {
            name: 'toggle',
            tips: '切换下拉折叠状态时调用该事件函数，回调参数(status: Boolean)'
        },
        {
            name: 'change',
            tips: '选项发生变化时调用该事件函数，回调参数(newValue: String | Number | Array, oldValue: String | Number | Array)'
        },
        {
            name: 'clear',
            tips: '清空已选项时调用该事件函数，回调参数(oldValue: String | Number | Array)'
        },
        {
            name: 'tab-remove',
            tips: '删除tab时调用该事件函数，回调参数(options: Array)'
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
        width: '300px'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: ['string', 'array', 'number'],
            // defaultValList: ['sss', [1, 2, 3], 3],
            val: '',
            tips: '当前被选中的值'
        },
        multiple: {
            type: 'boolean',
            val: true,
            tips: '是否多选'
        },
        'show-select-all': {
            type: 'boolean',
            val: true,
            tips: '是否显示全选选项，仅当开启multiple时生效'
        },
        'scroll-height': {
            type: 'number',
            val: 216,
            tips: '下拉列表滚动高度'
        },
        placeholder: {
            type: 'string',
            val: '',
            tips: '未选择数据时的空白提示'
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
            val: false,
            tips: '是否加载中'
        },
        clearable: {
            type: 'boolean',
            val: false,
            tips: '是否允许清空'
        },
        searchable: {
            type: 'boolean',
            val: false,
            tips: '是否显示搜索框'
        },
        'search-ignore-case': {
            type: 'boolean',
            val: false,
            tips: '搜索选项时是否忽略大小写'
        },
        'popover-min-width': {
            type: 'number',
            val: 0,
            tips: '设置下拉列表的最小宽度, 默认的列表宽度跟组件保持一致'
        },
        'popover-width': {
            type: 'number',
            val: 0,
            tips: '设置下拉列表的宽度, 默认的列表宽度跟组件保持一致'
        },
        'font-size': {
            type: 'string',
            val: '',
            tips: '设置下拉已选择及列表的字体大小'
        },
        'z-index': {
            type: 'number',
            val: 2500,
            tips: '弹出层的 z-index'
        }
    },
    slots: {
        default: {
            name: ['bk-option'],
            type: ['list', 'remote'],
            displayName: '可选项配置',
            tips: '默认插槽，填写的数据需要是数组且每个元素需包含id和name字段',
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('id') || !item.hasOwnProperty('name')))
                if (errData) return '返回值每个元素需要含有id和name字段'
            },
            val: [
                { id: 'option1', name: '爬山' },
                { id: 'option2', name: '跑步' },
                { id: 'option3', name: '打球' },
                { id: 'option4', name: '跳舞' },
                { id: 'option5', name: '健身' },
                { id: 'option6', name: '骑车' }
            ]
        }
    }
}
