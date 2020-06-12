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
    name: 'pagination',
    type: 'bk-pagination',
    displayName: '分页',
    icon: 'bk-drag-pagination',
    group: '数据',
    order: 1,
    events: [{
        name: 'change', tips: '当前页码变化时的回调，回调参数：变化后的页码'
    }, {
        name: 'limit-change', tips: '当前分页尺寸变化时的回调，回调参数：变化后的分页尺寸(即每页显示的条数)'
    }],
    styles: ['size', 'margin', 'display'],
    defaultStyles: {
        display: 'block'
    },
    props: {
        count: {
            type: 'number',
            val: 10,
            tips: '总数据量'
        },
        current: {
            type: 'number',
            val: 1,
            tips: '当前页码，正整数，支持.sync修饰符'
        },
        limit: {
            type: 'number',
            val: 10,
            tips: '每页显示条数(须存在于limit-list中)'
        },
        'limit-list': {
            type: 'array',
            val: [10, 20, 50, 100],
            tips: '每页显示条数可选项配置'
        },
        'show-limit': {
            type: 'boolean',
            val: true,
            tips: '是否显示附加功能（调整每页显示条数）'
        },
        location: {
            type: 'string',
            options: ['left', 'right'],
            val: 'right',
            tips: '每页显示条数控件位置'
        },
        align: {
            type: 'string',
            options: ['left', 'center', 'right'],
            val: 'left',
            tips: '分页控件位置，优先级高于location'
        },
        type: {
            type: 'string',
            options: ['default', 'compact'],
            val: 'default',
            tips: '组件外观类型'
        },
        size: {
            type: 'string',
            options: ['default', 'small'],
            val: 'default',
            tips: '页码尺寸大小'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
