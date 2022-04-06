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
    name: 'el-input',
    type: 'el-input',
    displayName: '输入框',
    icon: 'bk-drag-input',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    events: [
        {
            name: 'change',
            tips: '仅在输入框失去焦点或用户按下回车时调用该事件函数，事件回调参数 (value: String | Number)'
        },
        {
            name: 'input',
            tips: '在 Input 值改变时调用该事件函数，事件回调参数(value: String | Number)'
        },
        {
            name: 'focus',
            tips: '在 Input 获得焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'blur',
            tips: '在 Input 失去焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'clear',
            tips: '在点击由 clearable 属性生成的清空按钮时调用该事件函数, 无回调参数'
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
        width: '200px'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: ['string', 'number'],
            val: ''
        },
        type: {
            type: 'string',
            options: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
            val: 'text',
            tips: '输入框样式'
        },
        placeholder: {
            type: 'string',
            val: '',
            tips: '输入框占位文本'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        readonly: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        'show-word-limit': {
            type: 'boolean',
            val: false,
            tips: '是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效'
        },
        size: {
            type: 'string',
            options: ['medium', 'small', 'mini'],
            tips: '输入框尺寸，只在 type!="textarea" 时有效'
        },
        maxlength: {
            type: 'number',
            tips: '最大输入长度'
        },
        minlength: {
            type: 'number',
            tips: '最小输入长度'
        },
        name: {
            type: 'string',
            tips: 'html 原生属性 name'
        },
        'prefix-icon': {
            type: 'icon'
        },
        'suffix-icon': {
            type: 'icon'
        }
    }
}
