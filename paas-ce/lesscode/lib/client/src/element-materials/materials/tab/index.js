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
    name: 'tab',
    type: 'bk-tab',
    displayName: '选项卡',
    icon: 'bk-drag-tab',
    group: '导航',
    order: 1,
    events: ['tab-change', 'close-panel', 'add-panel'],
    styles: ['size', 'margin', 'display'],
    props: {
        active: {
            type: 'string',
            val: 'Tab-1'
        },
        type: {
            type: 'string',
            options: ['card', 'border-card', 'unborder-card'],
            val: 'unborder-card'
        },
        'tab-position': {
            type: 'string',
            options: ['left', 'right', 'top'],
            val: 'top'
        },
        closable: {
            type: 'boolean',
            val: false
        },
        addable: {
            type: 'boolean',
            val: false
        },
        'scroll-step': {
            type: 'number',
            val: 200
        },
        'ext-cls': {
            type: 'string',
            val: ''
        },
        'validate-active': {
            type: 'boolean',
            val: true
        },
        slots: {
            name: 'bk-tab-panel',
            type: 'tab-panel',
            val: [
                { name: 'Tab-1', label: 'Tab-1' },
                { name: 'Tab-2', label: 'Tab-2' },
                { name: 'Tab-3', label: 'Tab-3' }
            ]
        }
    }

}
