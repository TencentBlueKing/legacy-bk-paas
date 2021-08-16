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
    name: 'el-link',
    type: 'el-link',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-link1',
    displayName: '文字链接',
    group: '基础',
    events: [{ name: 'click' }],
    styles: ['size', 'padding', 'margin', 'display', 'text-align'],
    renderStyles: {
        display: 'inline-block',
        textAlign: 'center'
    },
    props: {
        type: {
            type: 'string',
            val: '',
            options: ['primary', 'success', 'warning', 'danger', 'info'],
            tips: '类型'
        },
        underline: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否下划线'
        },
        disabled: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否禁用状态'
        },
        href: {
            type: 'string',
            val: '',
            'v-bind': '',
            tips: '原生 href 属性'
        }
        // element 的图标，先去掉
        // icon: {
        //     type: 'string',
        //     val: '',
        //     tips: '图标类名'
        // },
    },
    slots: {
        default: {
            name: ['text'],
            type: ['text'],
            displayName: '文本配置',
            val: '文字链接'
        }
    }
}
