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
    name: 'popover',
    type: 'bk-popover',
    displayName: '弹出提示',
    icon: 'bk-drag-popover-2',
    group: '反馈',
    order: 1,
    styles: ['margin', 'display'],
    props: {
        content: {
            type: 'string',
            val: '这里是提示文字',
            tips: '显示的内容',
            'v-bind': ''
        },
        placement: {
            type: 'string',
            val: 'bottom',
            options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
            tips: '组件显示位置'
        },
        width: {
            type: ['string', 'number'],
            val: 'auto',
            tips: '提示框内容宽度'
        },
        'max-width': {
            type: ['string', 'number'],
            val: 'auto',
            tips: '提示框内容宽度'
        },
        always: {
            type: 'boolean',
            val: false,
            tips: '是否总是可见'
        },
        'z-index': {
            type: 'number',
            val: 2500,
            tips: '弹出层z-index'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .tippy-popper 上'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['html'],
            val: '<bk-button>多行</bk-button>'
        },
        content: {
            name: ['html'],
            type: ['html'],
            val: '<div class="bk-text-primary pt10 pb5 pl10 pr10">显示多行信息</div>'
        }
    }
}
