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
    name: 'x-script',
    type: 'x-script',
    displayName: 'x-script',
    events: ['selected', 'toggle', 'change', 'clear'],
    styles: ['size', 'padding', 'margin', 'font', 'backgroundColor'],
    props: {
        // input
        value: {
            type: 'string',
            val: 'hello world'
        },
        placeholder: {
            type: 'string'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string'
        },
        // button
        title: {
            type: 'string',
            val: 'hello world'
        },
        'button-theme': {
            type: 'string',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'text']
        },
        /**
         * 以下 prop 在接入系统时必填，否则将使用前端数据
         * 接口地址需带域名，本地开发时，需配置跨域访问
         */
        // 获取业务列表接口地址
        'biz-list-ajax-url': {
            type: 'string',
            val: ''
        },
        // 获取指定业务下所有脚本的接口地址
        'script-list-ajax-url': {
            type: 'string',
            val: ''
        },
        // 执行脚本接口地址
        'execute-ajax-url': {
            type: 'string',
            val: ''
        },
        // 系统接口通用参数
        'system-info': {
            type: 'object',
            val: {}
        }
    }
}
