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
    name: 'van-field',
    type: 'van-field',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-input',
    displayName: '输入框',
    group: '表单',
    document: 'https://vant-contrib.gitee.io/vant/v2/#/zh-CN/field',
    events: [
        {
            name: 'input',
            tips: '输入框内容变化时调用该事件函数，事件回调参数 (value: String)'
        },
        {
            name: 'focus',
            tips: '输入框获得焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'blur',
            tips: '输入框失去焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'clear',
            tips: '点击清除按钮时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'click',
            tips: '点击 Field 时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'click-input',
            tips: '点击输入区域时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'click-left-icon',
            tips: '点击左侧图标时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'click-right-icon',
            tips: '点击右侧图标时调用该事件函数，事件回调参数 (event: Event)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
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
            type: ['string', 'number'],
            val: '',
            tips: '当前输入的值'
        },
        label: {
            type: 'string',
            tips: '输入框左侧文本'
        },
        name: {
            type: 'string',
            tips: '名称，提交表单的标识符'
        },
        type: {
            type: 'string',
            options: ['text', 'tel', 'digit', 'password', 'number', 'textarea'],
            val: 'text',
            tips: '输入框类型'
        },
        size: {
            type: 'string',
            options: ['normal', 'large'],
            val: 'large',
            tips: '大小'
        },
        maxlength: {
            type: ['string', 'number'],
            tips: '输入的最大字符数'
        },
        placeholder: {
            type: 'string',
            tips: '输入框占位提示文字'
        },
        border: {
            type: 'boolean',
            val: true,
            tips: '是否显示内边框'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用输入框'
        },
        readonly: {
            type: 'boolean',
            val: false,
            tips: '是否只读'
        },
        colon: {
            type: 'boolean',
            val: false,
            tips: '是否在 label 后面添加冒号'
        },
        required: {
            type: 'boolean',
            val: false,
            tips: '是否显示表单必填星号'
        },
        center: {
            type: 'boolean',
            val: false,
            tips: '是否使内容垂直居中'
        },
        clearable: {
            type: 'boolean',
            val: false,
            tips: '是否启用清除图标，点击清除图标后会清空输入框'
        },
        'clear-trigger': {
            type: 'string',
            options: ['always', 'focus'],
            val: 'focus',
            tips: '显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示'
        },
        clickable: {
            type: 'boolean',
            val: false,
            tips: '是否开启点击反馈'
        },
        'is-link': {
            type: 'boolean',
            val: false,
            tips: '是否展示右侧箭头并开启点击反馈'
        },
        'show-word-limit': {
            type: 'boolean',
            val: false,
            tips: '是否显示字数统计，需要设置maxlength属性'
        },
        error: {
            type: 'boolean',
            val: false,
            tips: '是否将输入内容标红'
        },
        'error-message': {
            type: 'string',
            tips: '底部错误提示文案，为空时不展示'
        },
        'arrow-direction': {
            type: 'string',
            options: ['left', 'up', 'down', 'right'],
            val: 'right',
            tips: '箭头方向'
        },
        'label-width': {
            type: ['string', 'number'],
            val: '6.2em',
            tips: '左侧文本宽度，默认单位为px'
        },
        'label-align': {
            type: 'string',
            options: ['center', 'left', 'right'],
            val: 'left',
            tips: '左侧文本对齐方式'
        },
        'input-align': {
            type: 'string',
            options: ['center', 'left', 'right'],
            val: 'left',
            tips: '输入框对齐方式'
        },
        'error-message-align': {
            type: 'string',
            options: ['center', 'left', 'right'],
            val: 'left',
            tips: '错误提示文案对齐方式'
        },
        autosize: {
            type: ['boolean', 'object'],
            val: false,
            tips: '是否自适应内容高度，只对 textarea 有效，可传入对象,如 { maxHeight: 100, minHeight: 50 }'
        },
        'left-icon': {
            type: 'van-icon'
        },
        'right-icon': {
            type: 'van-icon'
        },
        autocomplete: {
            type: 'string',
            tips: 'input 标签原生的自动完成属性'
        }
    }
}
