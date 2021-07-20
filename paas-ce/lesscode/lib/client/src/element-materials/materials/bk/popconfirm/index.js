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
    name: 'popconfirm',
    type: 'bk-popconfirm',
    displayName: '弹出确认',
    icon: 'bk-drag-popconfrim',
    group: '反馈',
    order: 1,
    styles: ['margin', 'display'],
    events: [{
        name: 'confirm', tips: '点击确定按钮触发的事件'
    }, {
        name: 'cancel', tips: '点击取消按钮触发的事件'
    }],
    props: {
        title: {
            type: 'string',
            val: '鼠标移入提示，带操作的工具提示',
            tips: '标题'
        },
        theme: {
            type: 'string',
            val: 'light',
            options: ['light', 'dark'],
            tips: '主题'
        },
        trigger: {
            type: 'string',
            val: 'mouseenter',
            options: ['mouseenter', 'click'],
            tips: '触发方式'
        },
        'confirm-text': {
            type: 'string',
            val: '确定',
            tips: '确认按钮文字'
        },
        'cancel-text': {
            type: 'string',
            val: '取消',
            tips: '取消按钮文字'
        },
        'confirm-button-is-text': {
            type: 'boolean',
            val: true,
            tips: '确认按钮类型，当title或slot有值时生效'
        },
        'cancel-button-is-text': {
            type: 'boolean',
            val: true,
            tips: '取消按钮类型，当title或slot有值时生效'
        },
        'z-index': {
            type: 'number',
            val: 2500,
            tips: '弹出层z-index'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置 pop 弹层自定义样式类名，传入的类会被加在 pop 弹层的 DOM .tippy-popper 上'
        },
        'ext-popover-cls': {
            type: 'string',
            tips: '配置 pop 弹层主内容区域自定义样式类名，传入的类会被加在 pop 弹层主内容区域的 DOM .bk-popconfirm-content 上'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['html'],
            val: '<bk-button>删除</bk-button>'
        },
        content: {
            name: ['html'],
            type: ['html'],
            val: '<div>自定义内容</div>'
        }
    }
}
