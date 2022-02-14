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
    name: 'el-select',
    type: 'el-select',
    displayName: '下拉选框',
    icon: 'bk-drag-select',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/select',
    events: [
        {
            name: 'change',
            tips: '选中值发生变化时调用该事件函数，事件回调参数 (value: Array)'
        },
        {
            name: 'visible-change',
            tips: '下拉框出现/隐藏时调用该事件函数，事件回调参数 (value: Boolean)'
        },
        {
            name: 'remove-tag',
            tips: '多选模式下移除tag时调用该事件函数，事件回调参数 (value: String|Number|Boolean)'
        },
        {
            name: 'clear',
            tips: '可清空的单选模式下用户点击清空按钮时调用该事件函数，无回调参数'
        },
        {
            name: 'blur',
            tips: '当 input 失去焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'focus',
            tips: '当 input 获得焦点时调用该事件函数，事件回调参数 (event: Event)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'padding',
        'margin',
        'pointer',
        'opacity'
    ],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: ['string', 'number', 'boolean'],
            val: ''
        },
        multiple: {
            type: 'boolean',
            val: false,
            tips: '是否多选'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        size: {
            type: 'string',
            val: '',
            options: ['medium', 'small', 'mini'],
            tips: '输入框尺寸'
        },
        clearable: {
            type: 'boolean',
            val: false,
            tips: '是否允许清空'
        },
        placeholder: {
            type: 'string',
            val: '请选择',
            tips: '占位符'
        },
        loading: {
            type: 'boolean',
            val: false,
            tips: '是否正在从远程获取数据'
        },
        filterable: {
            type: 'boolean',
            val: false,
            tips: '是否可搜索'
        },
        'collapse-tags': {
            type: 'boolean',
            val: false,
            tips: '多选时是否将选中值按文字的形式展示'
        },
        autocomplete: {
            type: 'string',
            val: 'off',
            tips: 'select input 的 autocomplete 属性'
        },
        'popper-class': {
            type: 'string',
            val: '',
            tips: 'Select 下拉框的类名'
        },
        'popper-append-to-body': {
            type: 'boolean',
            val: true,
            tips: '对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单'
        }
    },
    slots: {
        default: {
            name: ['el-option'],
            type: ['list', 'remote'],
            displayName: 'option可选项配置',
            tips: '值需要是数组，且每个元素需要含有id和name字段',
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
