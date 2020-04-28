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
    name: 'x-form',
    type: 'x-form',
    displayName: 'x-form',
    events: ['selected', 'toggle', 'change', 'clear'],
    styles: ['padding', 'margin', 'font', 'backgroundColor'],
    props: {
        // input
        value: {
            type: 'string',
            val: 'hello world'
        },
        placeholder: {
            type: 'string'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string'
        },
        // button
        title: {
            type: 'string',
            val: 'hello world'
        },
        'button-text': {
            type: 'string',
            val: '按钮'
        },
        'button-submit-url': {
            type: 'string',
            val: ''
        },
        'button-theme': {
            type: 'string',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'text']
        },
        // select
        'select-value': {
            type: 'string',
            val: ''
        },
        'select-show-select-all': {
            type: 'boolean',
            val: true
        },
        'select-multiple': {
            type: 'boolean',
            val: true
        },
        'select-disabled': {
            type: 'boolean',
            val: false
        },
        'select-readonly': {
            type: 'boolean',
            val: false
        },
        'select-ajax-url': {
            type: 'string',
            val: ''
        },
        'select-render-list': {
            type: 'array',
            val: [
                { id: 1, name: '爬山' },
                { id: 2, name: '跑步' },
                { id: 3, name: '打球' },
                { id: 4, name: '跳舞' },
                { id: 5, name: '健身' },
                { id: 6, name: '骑车' }
            ]
        }
    }
}
