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
    name: 'el-time-picker',
    type: 'el-time-picker',
    displayName: '时间选择',
    icon: 'bk-drag-time-2',
    group: '表单',
    order: 1,
    events: [{
        name: 'change', tips: '用户确认选定的值时调用该事件函数，事件回调参数 (value: String)'
    }],
    styles: ['size', 'margin', 'display'],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['string'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        value: {
            type: 'string',
            val: ''
        },
        readonly: {
            type: 'boolean',
            val: false
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        editable: {
            type: 'boolean',
            val: true
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        size: {
            type: 'string',
            options: ['medium', 'small', 'mini'],
            val: ''
        },
        placeholder: {
            type: 'string',
            tips: ''
        },
        'is-range': {
            type: 'boolean',
            val: false,
            tips: '是否为时间范围选择'
        },
        'value-format': {
            type: 'string',
            val: 'HH:mm:ss',
            tips: '格式，不配置 ss 时即不显示秒'
        },
        align: {
            type: 'string',
            options: ['left', 'center', 'right'],
            val: 'left',
            tips: '对齐方式'
        },
        'popper-class': {
            type: 'string',
            tips: 'TimePicker 下拉框的类名'
        }
    }
}
