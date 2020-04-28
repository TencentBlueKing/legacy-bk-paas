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
    name: 'badge',
    type: 'bk-badge',
    displayName: '标记',
    icon: 'bk-drag-badge',
    group: '数据',
    order: 1,
    events: ['hover', 'leave'],
    styles: ['size', 'margin', 'display', 'font', 'backgroundColor'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        theme: {
            type: 'string',
            val: 'primary'
        },
        val: {
            type: 'string',
            val: ''
        },
        icon: {
            type: 'string',
            val: ''
        },
        max: {
            type: 'number',
            val: ''
        },
        dot: {
            type: 'boolean',
            val: false
        },
        visible: {
            type: 'boolean',
            val: true
        },
        position: {
            type: 'string',
            val: 'top-right'
        },
        'ext-cls': {
            type: 'string',
            val: ''
        },
        slots: {
            name: 'text',
            type: 'text',
            val: '文字标记'
        }
    }
}
