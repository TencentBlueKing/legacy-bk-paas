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
    name: 'bread-crumb',
    type: 'bk-breadcrumb',
    displayName: '面包屑',
    icon: 'bk-drag-breadcrumb',
    group: '导航',
    order: 4,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/breadcrumb',
    styles: ['position', 'size', 'padding', 'margin', 'font', 'pointer', 'background', 'opacity'],
    props: {
        separator: {
            type: 'string',
            val: '>',
            tips: '分隔符'
        },
        separatorClass: {
            type: 'string',
            val: '',
            tips: '图表分隔符class'
        }
    },
    slots: {
        default: {
            name: ['bk-breadcrumb-item'],
            type: ['list', 'remote'],
            displayName: 'bk-breadcrumb-item 可选项配置',
            tips: '默认插槽，填写的数据需要是数组且每个元素需包含label和to字段',
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('label') || !item.hasOwnProperty('to')))
                if (errData) return '返回值每个元素需要含有label和to字段'
            },
            val: [
                { label: '首页', to: '/' },
                { label: '使用指引', to: '/help' },
                { label: '面包屑', to: null }
            ]
        }
    }
}
