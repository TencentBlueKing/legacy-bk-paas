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
    name: 'el-badge',
    type: 'el-badge',
    displayName: '标记',
    icon: 'bk-drag-badge',
    group: '数据',
    order: 1,
    styles: ['size', 'margin', 'display', 'font', 'backgroundColor'],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        value: {
            type: ['string', 'number'],
            val: '1',
            tips: '显示值'
        },
        type: {
            type: 'string',
            options: ['primary', 'info', 'warning', 'danger', 'success'],
            val: 'primary',
            tips: '类型'
        },
        max: {
            type: 'number',
            val: '',
            tips: '组件显示的最大值，当 value 超过 max，显示数字 +；仅当设置了 Number 类型的 value 值时生效'
        },
        'is-dot': {
            type: 'boolean',
            val: false,
            tips: '小圆点'
        },
        hidden: {
            type: 'boolean',
            val: false,
            tips: '隐藏 badge'
        },
        slots: {
            name: 'text',
            type: 'text',
            val: '文字标记'
        }
    }
}
