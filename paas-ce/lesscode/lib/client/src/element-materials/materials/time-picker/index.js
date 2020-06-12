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
    events: [{
        name: 'change', tips: '时间改变事件，回调参数为当前选择的时间'
    }, {
        name: 'open-change', tips: '面板弹出或收起事件，参数为面板展开收起的状态，回调参数为新的状态'
    }],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        // Date String Array
        value: {
            type: ['string', 'array'],
            tips: '时间选择器组件的值，可以是 Date 或字符串或数组，只有在 timerange 类型时才支持数组'
        },
        placeholder: {
            type: 'string',
            tips: '空白提示'
        },
        type: {
            type: 'string',
            options: ['time', 'timerange'],
            val: 'time'
        },
        format: {
            type: 'string',
            val: 'HH:mm:ss',
            tips: '格式，不配置 ss 时即不显示秒'
        },
        'font-size': {
            type: 'string',
            options: ['normal', 'medium', 'large'],
            val: 'normal',
            tips: '设置组件主体内容字体大小：normal--12px；medium--14px；large--16px'
        },
        placement: {
            type: 'string',
            options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
            val: 'bottom-start',
            tips: '面板出现的位置'
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
            val: true,
            tips: '是否开启回车模式'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
