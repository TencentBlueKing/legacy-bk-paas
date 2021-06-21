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
    group: 'Form',
    order: 1,
    events: [{
        name: 'change', tips: '用户确认选定的值时触发，回调参数 组件绑定值。格式与绑定值一致，可受 value-format 控制'
    }, {
        name: 'blur', tips: '当 input 失去焦点时触发，组件实例'
    }, {
        name: 'focus', tips: '当 input 获得焦点时触发，回调参数为组件实例'
    }],
    styles: ['size', 'margin', 'display'],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            propTypes: ['string'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
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
