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
    name: 'van-steps',
    type: 'van-steps',
    displayName: '步骤',
    icon: 'bk-drag-step',
    group: '导航',
    order: 1,
    document: 'https://youzan.github.io/vant/v2/#/zh-CN/steps',
    events: [
        {
            name: 'click-step',
            tips: '点击步骤的标题或图标时触发，事件回调参数 (index: Number)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    props: {
        active: {
            type: ['string', 'number'],
            val: 0,
            tips: '当前步骤'
        },
        direction: {
            type: 'string',
            options: ['horizontal', 'vertical'],
            val: 'horizontal',
            tips: '步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向'
        },
        'active-color': {
            type: 'string',
            val: '#07c160',
            tips: '激活状态颜色'
        },
        'inactive-color': {
            type: 'string',
            val: '#969799',
            tips: '未激活状态颜色'
        },
        'active-icon': {
            type: 'string',
            val: 'checked',
            tips: '激活状态底部图标'
        },
        'inactive-icon': {
            type: 'string',
            tips: '未激活状态底部图标'
        },
        'finish-icon': {
            type: 'string',
            tips: '已完成步骤对应的底部图标，优先级高于 inactive-icon'
        },
        'icon-prefix': {
            type: 'string',
            val: 'van-icon',
            tips: '图标类名前缀，同 Icon 组件的 class-prefix 属性'
        }
    },
    slots: {
        default: {
            name: ['van-step'],
            type: ['list', 'remote'],
            displayName: 'van-step 可选项配置',
            tips: '默认插槽，填写的数据需要是数组且每个元素需包含text字段',
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('text')))
                if (errData) return '返回值每个元素需要含有text字段'
            },
            val: [
                { text: '买家下单' },
                { text: '商家接单' },
                { text: '买家提货' },
                { text: '交易完成' }
            ]
        }
    }
}
