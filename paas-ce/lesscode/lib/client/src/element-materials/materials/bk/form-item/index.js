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
    name: 'form-item',
    type: 'widget-form-item',
    displayName: '表单容器',
    display: 'none',
    icon: 'bk-drag-form',
    group: '表单',
    order: 0,
    styles: [],
    directives: [],
    props: {
        property: {
            type: 'string',
            val: ''
        },
        label: {
            type: 'string',
            val: ''
        },
        'label-width': {
            type: 'number',
            val: 150
        },
        'error-display-type': {
            type: 'string',
            options: ['tooltips', 'normal'],
            val: 'normal'
        },
        'required': {
            type: 'boolean',
            val: false
        },
        'icon-offset': {
            type: 'number',
            val: 8
        },
        'auto-check': {
            type: 'boolean',
            val: false
        }
    },
    slots: {
        default: []
    }
}
