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
    name: 'el-pagination-text',
    type: 'el-pagination',
    displayName: '分页',
    icon: 'bk-drag-pagination',
    group: '数据',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/pagination',
    events: [
        {
            name: 'size-change',
            tips: 'pageSize 改变时调用该事件函数，事件回调参数 (pageSize: Number)'
        },
        {
            name: 'current-change',
            tips: 'currentPage 改变时调用该事件函数，事件回调参数 (currentPage: Number)'
        },
        {
            name: 'prev-click',
            tips: '用户点击上一页按钮改变当前页时调用该事件函数，事件回调参数 (currentPage: Number)'
        },
        {
            name: 'next-click',
            tips: '用户点击下一页按钮改变当前页时调用该事件函数，事件回调参数 (currentPage: Number)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    renderStyles: {
        display: 'block'
    },
    props: {
        small: {
            type: 'boolean',
            val: false,
            tips: '是否使用小型分页样式'
        },
        background: {
            type: 'boolean',
            val: false,
            tips: '是否为分页按钮添加背景色'
        },
        total: {
            type: 'number',
            val: 100,
            tips: '总数据量'
        },
        'current-page': {
            // 添加 vModel 配置之后，表示此属性需要写入 data 中，然后在模板中通过 data 中的变量来引用
            type: 'number',
            val: 1,
            tips: '当前页码，正整数，支持.sync修饰符',
            modifiers: ['sync']
        },
        'page-size': {
            type: 'number',
            val: 10,
            tips: '每页显示条目个数，支持 .sync 修饰符)',
            modifiers: ['sync']
        },
        'page-count': {
            type: 'number',
            tips: '总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性'
        },
        'pager-count': {
            type: 'number',
            val: 7,
            tips: '页码按钮的数量，当总页数超过该值时会折叠'
        },
        layout: {
            type: 'string',
            val: 'prev,pager,next,jumper,->,total',
            regExp: /^(sizes|prev|pager|next|jumper|->|total|slot)(,(sizes|prev|pager|next|jumper|->|total|slot))*$/,
            regErrorText: '请用逗号分隔:sizes, prev, pager, next, jumper, ->, total, slot',
            tips: '组件布局，子组件名用逗号分隔:sizes, prev, pager, next, jumper, ->, total, slot'
        },
        'prev-text': {
            type: 'string',
            val: '',
            tips: '替代图标显示的上一页文字'
        },
        'next-text': {
            type: 'string',
            val: '',
            tips: '替代图标显示的下一页文字'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        'hide-on-single-page': {
            type: 'boolean',
            val: false,
            tips: '只有一页时是否隐藏'
        },
        'popper-class': {
            type: 'string',
            val: '',
            tips: '每页显示个数选择器的下拉框类名'
        }
    }
}
