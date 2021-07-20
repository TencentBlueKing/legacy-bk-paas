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
    name: 'button',
    type: 'bk-button',
    displayName: '基础按钮',
    icon: 'bk-drag-button',
    group: '基础',
    order: 1,
    events: [{ name: 'click' }],
    styles: ['size', 'margin', 'padding', 'display', 'font', 'border', 'backgroundColor'],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        title: {
            type: 'string',
            val: 'hello world',
            tips: '原生 html title 属性'
        },
        size: {
            type: 'string',
            val: 'normal',
            options: ['small', 'normal', 'large'],
            tips: '按钮尺寸'
        },
        theme: {
            type: 'string',
            val: 'default',
            options: ['default', 'primary', 'success', 'warning', 'danger'],
            tips: '按钮类型、主题'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        loading: {
            type: 'boolean',
            val: false
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            val: '基础按钮'
        }
    }
}
