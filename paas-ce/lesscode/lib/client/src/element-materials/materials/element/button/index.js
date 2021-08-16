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
    name: 'el-button',
    type: 'el-button',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-button',
    displayName: '按钮',
    group: '基础',
    events: [{ name: 'click' }],
    styles: ['size', 'padding', 'margin', 'display'],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        size: {
            type: 'string',
            val: '',
            options: ['medium', 'small', 'mini'],
            tips: '尺寸'
        },
        type: {
            type: 'string',
            val: '',
            options: ['primary', 'success', 'warning', 'danger', 'info', 'text'],
            tips: '类型'
        },
        plain: {
            type: 'boolean',
            val: false,
            tips: '是否朴素按钮'
        },
        round: {
            type: 'boolean',
            val: false,
            tips: '是否圆角按钮'
        },
        circle: {
            type: 'boolean',
            val: false,
            tips: '是否圆形按钮'
        },
        loading: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否加载中状态'
        },
        disabled: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否禁用状态'
        },
        // element 的图标，先去掉
        // icon: {
        //     type: 'string',
        //     val: '',
        //     tips: '图标类名'
        // },
        autofocus: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否默认聚焦'
        },
        'native-type': {
            type: 'string',
            val: '',
            options: ['button', 'submit', 'reset'],
            tips: '原生 type 属性'
        }
    },
    slots: {
        default: {
            name: ['text'],
            type: ['text'],
            displayName: '文本配置',
            val: '默认按钮'
        }
    }
}
