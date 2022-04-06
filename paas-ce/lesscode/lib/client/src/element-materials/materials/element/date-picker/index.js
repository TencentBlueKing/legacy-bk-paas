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
    name: 'el-date-picker',
    type: 'el-date-picker',
    displayName: '日期选择',
    icon: 'bk-drag-date',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
    events: [
        {
            name: 'change',
            tips: '用户确认选定的值时调用该事件函数，事件回调参数 (value: Date|Array)'
        },
        {
            name: 'blur',
            tips: '当 input 失去焦点时调用该事件函数，事件回调参数 (component: Object)'
        },
        {
            name: 'focus',
            tips: '当 input 获得焦点时调用该事件函数，事件回调参数 (component: Object)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: ['string', 'array'],
            regExp: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
            // 正则校验错误时的提示文本，默认值为"格式错误，请重新输入"
            regErrorText: '请输入正确的日期格式，如"2020-01-01"',
            tips: '日期，如"2020-01-01"'
        },
        placeholder: {
            type: 'string',
            tips: '占位文案'
        },
        'start-placeholder': {
            type: 'string',
            tips: '范围选择时开始日期的占位内容'
        },
        'end-placeholder': {
            type: 'string',
            tips: '范围选择时开始日期的占位内容'
        },
        type: {
            type: 'string',
            options: ['date', 'daterange', 'datetime', 'datetimerange', 'month', 'year', 'dates', 'week', 'monthrange'],
            val: 'date',
            clearable: false,
            trigger: 'change-format'
        },
        format: {
            type: 'string',
            options: ['yyyy-MM-dd', 'yyyy-MM', 'yyyy', 'yyyy-MM-dd HH:mm:ss', 'HH:mm:ss', 'mm:ss'],
            val: 'yyyy-MM-dd',
            listener: 'change-format'
        },
        'font-size': {
            type: 'string',
            options: ['normal', 'medium', 'large'],
            val: 'normal',
            tips: '设置组件主体内容字体大小：normal--12px；medium--14px；large--16px'
        },
        align: {
            type: 'string',
            options: ['left', 'center', 'right'],
            val: 'left',
            tips: '日历面板出现的位置'
        },
        size: {
            type: 'string',
            val: '',
            options: ['medium', 'small', 'mini'],
            tips: '尺寸'
        },
        editable: {
            type: 'boolean',
            val: true
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
        'popper-class': {
            type: 'string',
            tips: 'DatePicker 下拉框的类名'
        }
    }
}
