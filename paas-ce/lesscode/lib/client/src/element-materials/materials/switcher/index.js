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
    name: 'switcher',
    type: 'bk-switcher',
    displayName: '开关',
    icon: 'bk-drag-switcher',
    group: '表单',
    order: 1,
    events: ['change'],
    styles: ['margin', 'display', 'backgroundColor'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        selected: {
            type: 'boolean',
            val: false
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        'is-outline': {
            type: 'boolean',
            val: false
        },
        'is-square': {
            type: 'boolean',
            val: false
        },
        'show-text': {
            type: 'boolean',
            val: false
        },
        'on-text': {
            type: 'string',
            val: 'ON'
        },
        'off-text': {
            type: 'string',
            val: 'OFF'
        },
        theme: {
            type: 'string',
            options: ['primary', 'success'],
            val: 'success'
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
