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
    name: 'van-button',
    type: 'van-button',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-button',
    displayName: '按钮',
    group: '基础',
    events: [
        { name: 'click', tips: '点击时调用该事件函数，事件回调参数 (e: Event)' },
        { name: 'touchstart', tips: '开始触摸按钮时触发，事件回调参数 (e: TouchEvent)' }
    ],
    styles: ['size', 'padding', 'margin', 'display'],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        size: {
            type: 'string',
            val: 'normal',
            options: ['normal', 'large', 'small', 'mini'],
            tips: '尺寸'
        },
        type: {
            type: 'string',
            val: 'default',
            options: ['primary', 'warning', 'danger', 'info', 'default'],
            tips: '类型'
        },
        plain: {
            type: 'boolean',
            val: false,
            tips: '是否朴素按钮'
        },
        square: {
            type: 'boolean',
            val: false,
            tips: '是否方形按钮'
        },
        round: {
            type: 'boolean',
            val: false,
            tips: '是否圆角按钮'
        },
        loading: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否加载中状态'
        },
        'loading-text': {
            type: 'string',
            val: '',
            vips: '加载状态提示文字'
        },
        'loading-type': {
            type: 'string',
            default: 'circular',
            options: ['circular', 'spinner'],
            tips: '加载图标类型'
        },
        disabled: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否禁用状态'
        },
        'native-type': {
            type: 'string',
            val: '',
            options: ['button', 'submit', 'reset'],
            tips: '原生 type 属性'
        }
    },
    slots: {
        default: {
            name: ['text'],
            type: ['text'],
            displayName: '文本配置',
            val: '默认按钮'
        }
    }
}
