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
    events: ['change', 'input', 'focus', 'blur', 'keypress', 'keydown', 'keyup', 'enter', 'paste', 'clear', 'left-icon-click', 'right-icon-click'],
    styles: ['size', 'margin', 'display'],
    props: {
        value: {
            type: 'string',
            val: 'hello world'
        },
        type: {
            type: 'string',
            options: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
            val: 'text'
        },
        'font-size': {
            type: 'string',
            options: ['normal', 'medium', 'large'],
            val: 'normal'
        },
        placeholder: {
            type: 'string'
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
            val: true
        },
        maxlength: {
            type: 'number'
        },
        minlength: {
            type: 'number'
        },
        name: {
            type: 'string'
        },
        'left-icon': {
            type: 'string'
        },
        'right-icon': {
            type: 'string'
        },
        precision: {
            // todo type number
            type: 'string',
            options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
