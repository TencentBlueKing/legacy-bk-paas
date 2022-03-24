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
    name: 'van-pagination',
    type: 'van-pagination',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-pagination',
    displayName: '分页',
    group: '导航',
    events: [
        { name: 'change', tips: '页码改变时触发' }
    ],
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'number',
            val: 1,
            tips: '当前页码'
        },
        mode: {
            type: 'string',
            val: 'multi',
            options: ['multi', 'simple'],
            tips: '显示模式'
        },
        'prev-text': {
            type: 'string',
            val: '上一页',
            tips: '上一页按钮文字'
        },
        'next-text': {
            type: 'string',
            val: '下一页',
            tips: '下一页按钮文字'
        },
        'page-count': {
            type: ['number', 'string'],
            val: '',
            tips: '总页数'
            
        },
        'total-items': {
            type: ['number', 'string'],
            val: 0,
            tips: '总记录数'
            
        },
        'items-per-page': {
            type: ['number', 'string'],
            val: 10,
            tips: '每页记录数'
            
        },
        'show-page-size': {
            type: ['number', 'string'],
            val: 5,
            tips: '显示的页码个数'
            
        },
        'force-ellipses': {
            type: 'boolean',
            val: false,
            tips: '是否显示省略号'
        }
    }
}
