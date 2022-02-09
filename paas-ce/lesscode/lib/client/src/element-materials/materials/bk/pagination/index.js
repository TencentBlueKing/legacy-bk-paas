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
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/pagination',
    events: [
        {
            name: 'change',
            tips: '当前页码变化时调用该事件函数，事件回调参数 (current: Number)'
        },
        {
            name: 'limit-change',
            tips: '当前分页尺寸变化时调用该事件函数，事件回调参数 (limit: Number)'
        }
    ],
    styles: ['position', 'size', 'padding', 'margin', 'pointer', 'opacity'],
    renderStyles: {
        display: 'block'
    },
    props: {
        count: {
            type: 'number',
            val: 10,
            tips: '总数据量'
        },
        current: {
            // 添加 vModel 配置之后，表示此属性需要写入 data 中，然后在模板中通过 data 中的变量来引用
            type: 'number',
            val: 1,
            tips: '当前页码，正整数，支持.sync修饰符',
            modifiers: ['sync']
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
        'show-total-count': {
            type: 'boolean',
            val: false,
            tips: '是否显示分页条中共计XX条的信息'
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
