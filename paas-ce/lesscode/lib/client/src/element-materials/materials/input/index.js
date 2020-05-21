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
    name: 'input',
    type: 'bk-input',
    displayName: '输入框',
    icon: 'bk-drag-input',
    group: '表单',
    order: 1,
    events: [{
        name: 'change', tips: '文本框内容变化时调用，回调参数（value, event）'
    }, {
        name: 'input', tips: '文本框内容变化时调用，回调参数（value, event）'
    }, {
        name: 'focus', tips: '文本框获取焦点时调用，回调参数（value, event）'
    }, {
        name: 'blur', tips: '文本框失去焦点时调用，回调参数（value, event）'
    }, {
        name: 'keypress', tips: '文本框输入按下键盘时调用，回调参数（value, event）'
    }, {
        name: 'keydown', tips: '文本框输入按下键盘时调用，回调参数（value, event）'
    }, {
        name: 'keyup', tips: '文本框输入按下键盘按键松开时调用，回调参数（value, event）'
    }, {
        name: 'enter', tips: '文本框获取焦点时，按下回车时调用，回调参数（value, event）'
    }, {
        name: 'paste', tips: '文本框粘贴内容时调用，回调参数（value, event）'
    }, {
        name: 'clear', tips: '点击文本框的清除图标时调用，回调参数（value, event）'
    }, {
        name: 'left-icon-click', tips: '点击配置的左图标时调用，回调参数（value, event）'
    }, {
        name: 'right-icon-click', tips: '点击配置的右图标时调用，回调参数（value, event）'
    }],
    styles: ['size', 'margin', 'display'],
    props: {
        value: {
            type: 'string',
            val: 'hello world'
        },
        type: {
            type: 'string',
            options: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
            val: 'text',
            tips: '输入框样式'
        },
        'font-size': {
            type: 'string',
            options: ['normal', 'medium', 'large'],
            val: 'normal',
            tips: '设置输入框内容字体大小：normal--12px；medium--14px；large--16px'
        },
        placeholder: {
            type: 'string',
            tips: '空白提示'
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
        'show-controls': {
            type: 'boolean',
            val: true,
            tips: 'type 为number 时，是否显示右侧控制箭头'
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
        'left-icon': {
            type: 'string',
            tips: {
                html: `左边显示的 icon，<a style="color: #72A7FF; text-decoration: underline;" target="_blank"
                    href="https://magicbox.bk.tencent.com/components_vue/2.0/example/index.html#/icon">查看支持的 icon</a>`
            }
        },
        'right-icon': {
            type: 'string',
            tips: {
                html: `右边显示的 icon，<a style="color: #72A7FF; text-decoration: underline;" target="_blank"
                    href="https://magicbox.bk.tencent.com/components_vue/2.0/example/index.html#/icon">查看支持的 icon</a>`
            }
        },
        precision: {
            // todo type number
            type: 'string',
            options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            tips: '保留小数位'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
