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
    name: 'van-slider',
    type: 'van-slider',
    displayName: '滑块',
    icon: '',
    group: '表单',
    order: 1,
    document: 'https://youzan.github.io/vant/v2/#/zh-CN/slider',
    events: [
        {
            name: 'input',
            tips: '进度变化时实时触发，事件回调参数 (value: 当前进度)'
        },
        {
            name: 'change',
            tips: '进度变化且结束拖动触发，事件回调参数 (value: 当前进度)'
        },
        {
            name: 'drag-start',
            tips: '开始拖动时触发'
        },
        {
            name: 'drag-end',
            tips: '结束拖动时触发'
        }
    ],
    styles: ['position', 'size', 'margin', 'opacity'],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: ['string', 'number'],
            value: 0,
            tips: '当前进度百分比'
        },
        min: {
            type: ['string', 'number'],
            val: 0,
            tips: '最小值'
        },
        max: {
            type: ['string', 'number'],
            val: 100,
            tips: '最大值'
        },
        step: {
            type: ['string', 'number'],
            val: 1,
            tips: '步长'
        },
        'bar-height': {
            type: ['string', 'number'],
            val: '2px',
            tips: '进度条高度，默认单位为px'
        },
        'button-size': {
            type: ['string', 'number'],
            val: '24px',
            tips: '滑块按钮大小，默认单位为px'
        },
        'active-color': {
            type: 'string',
            val: '#1989fa',
            tips: '进度条激活态颜色'
        },
        'inactive-color': {
            type: 'string',
            val: '#e5e5e5',
            tips: '进度条非激活态颜色'
        },
        range: {
            type: 'boolean',
            default: false,
            tips: '是否开启双滑块模式'
        },
        placeholder: {
            type: 'string',
            tips: '输入框占位提示文字'
        },
        disabled: {
            type: 'boolean',
            default: false,
            tips: '是否禁用滑块'
        },
        'vertical': {
            type: 'boolean',
            default: false,
            tips: '是否垂直展示'
        }
    }
}
