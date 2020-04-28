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
    name: 'time-picker',
    type: 'bk-time-picker',
    displayName: '时间选择',
    icon: 'bk-drag-time-2',
    group: '表单',
    order: 1,
    events: ['change', 'open-change'],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        // Date String Array
        value: {
            type: 'string'
        },
        placeholder: {
            type: 'string'
        },
        type: {
            type: 'string',
            options: ['time', 'timerange'],
            val: 'time'
        },
        format: {
            type: 'string',
            val: 'HH:mm:ss'
        },
        'font-size': {
            type: 'string',
            options: ['normal', 'medium', 'large'],
            val: 'normal'
        },
        placement: {
            type: 'string',
            options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
            val: 'bottom-start'
        },
        editable: {
            type: 'boolean',
            val: true
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        'enter-mode': {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
