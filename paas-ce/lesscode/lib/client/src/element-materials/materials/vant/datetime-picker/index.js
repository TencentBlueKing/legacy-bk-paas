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
    name: 'van-datetime-picker',
    type: 'van-datetime-picker',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-date',
    displayName: '时间选择',
    group: '表单',
    document: 'https://vant-contrib.gitee.io/vant/v2/#/zh-CN/datetime-picker',
    events: [
        {
            name: 'change',
            tips: '当值变化时调用该事件函数，事件回调参数 (picker: Picker实例)'
        },
        {
            name: 'confirm',
            tips: '点击完成按钮时调用该事件函数，事件回调参数 (value: 当前选中的时间)'
        },
        {
            name: 'cancel',
            tips: '点击取消按钮时调用该事件函数，暂无事件回调参数'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    props: {
        type: {
            type: 'string',
            val: 'datetime',
            options: ['datetime', 'date', 'time', 'year-month', 'month-day', 'datehour'],
            tips: '时间类型'
        },
        title: {
            type: 'string',
            val: '',
            tips: '顶部栏标题'
        },
        'confirm-button-text': {
            type: 'string',
            val: '确认',
            tips: '确认按钮文字'
        },
        'cancel-button-text': {
            type: 'string',
            val: '取消',
            tips: '取消按钮文字'
        },
        'show-toolbar': {
            type: 'boolean',
            val: true,
            tips: '是否显示顶部栏'
        },
        loading: {
            type: 'boolean',
            val: false,
            tips: '是否显示加载状态'
        },
        readonly: {
            type: 'boolean',
            val: false,
            tips: '是否为只读状态，只读状态下无法切换选项'
        },
        'columns-order': {
            type: 'array',
            tips: '自定义列排序数组, 子项可选值为 year、month、day、hour、minute'
        },
        'item-height': {
            type: ['number', 'string'],
            val: 44,
            tips: '选项高度，支持 px vw vh rem 单位，默认 px'
        },
        'visible-item-count': {
            type: ['number', 'string'],
            val: 6,
            tips: '可见的选项个数'
        },
        'swipe-duration': {
            type: ['number', 'string'],
            val: 1000,
            tips: '快速滑动时惯性滚动的时长，单位ms'
        }
    }
}
