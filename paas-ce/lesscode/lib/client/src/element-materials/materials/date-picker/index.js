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
    name: 'date-picker',
    type: 'bk-date-picker',
    displayName: '日期选择',
    icon: 'bk-drag-date',
    group: '表单',
    order: 1,
    events: ['change', 'clear', 'open-change', 'pick-success'],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        // 日历组件的值，可以是 Date 或字符串或数组，只有在 daterange 和 datetimerange 类型时才支持数组
        value: {
            type: 'string',
            regExp: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
            // 正则校验错误时的提示文本，默认值为"格式错误，请重新输入"
            regErrorText: '请输入正确的日期格式，如"2020-01-01"'
        },
        placeholder: {
            type: 'string'
        },
        type: {
            type: 'string',
            options: ['date', 'daterange', 'datetime', 'datetimerange', 'month', 'year'],
            val: 'date'
        },
        format: {
            type: 'string',
            options: ['yyyy-MM-dd', 'yyyy-MM', 'yyyy', 'yyyy-MM-dd HH:mm:ss', 'HH:mm:ss', 'mm:ss'],
            val: 'yyyy-MM-dd'
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
        'hide-disabled-options': {
            type: 'boolean',
            val: false
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
