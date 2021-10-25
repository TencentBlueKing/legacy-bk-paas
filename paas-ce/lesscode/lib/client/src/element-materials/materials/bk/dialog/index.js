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
    name: 'dialog',
    type: 'bk-dialog',
    displayName: '对话框',
    icon: 'bk-drag-dialog',
    group: '反馈',
    order: 1,
    interactiveShow: true,
    events: [
        { name: 'confirm', tips: '点击确定按钮时调用该事件函数，暂无事件回调参数' },
        { name: 'cancel', tips: '点击取消按钮时调用该事件函数，主动调用关闭才会触发，通过改变双向绑定的值关闭弹框时不会触发，暂无事件回调参数' },
        { name: 'value-change', tips: '弹框显示状态变化时调用该事件函数，暂无事件回调参数' },
        { name: 'after-leave', tips: '弹框消失的动画结束后调用该事件函数，暂无事件回调参数' }
    ],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['boolean'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        'value': {
            type: 'boolean',
            tips: '是否显示弹框，支持v-model双向绑定'
        },
        'title': {
            type: 'string',
            val: '这是标题'
        },
        'theme': {
            type: 'string',
            options: ['primary', 'success', 'warning', 'danger'],
            val: 'success'
        },
        'header-position': {
            type: 'string',
            options: ['left', 'center']
        },
        'footer-position': {
            type: 'string',
            options: ['left', 'center', 'right']
        },
        'mask-close': {
            type: 'boolean',
            val: false
        },
        'close-icon': {
            type: 'boolean',
            val: true
        },
        'fullscreen': {
            type: 'boolean',
            val: false
        },
        'draggable': {
            type: 'boolean',
            val: false
        },
        'scrollable': {
            type: 'boolean',
            val: false
        },
        'width': {
            type: 'number',
            val: 400
        },
        'show-mask': {
            type: 'boolean',
            val: true
        },
        'ok-text': {
            type: 'string',
            val: '确定'
        },
        'cancel-text': {
            type: 'string',
            val: '取消'
        },
        'auto-close': {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    },
    slots: {
        default: {
            name: ['layout'],
            type: ['render-grid'],
            display: 'hidden',
            children: [
                {
                    name: ['layout'],
                    type: ['render-column']
                }
            ]
        }
    }
}
