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
    name: 'el-switch',
    type: 'el-switch',
    displayName: '开关',
    icon: 'bk-drag-switcher',
    group: 'Form',
    order: 1,
    events: [{
        name: 'change', tips: 'switch 状态发生变化时的回调函数，回调参数为新的状态值'
    }],
    styles: ['margin', 'display', 'backgroundColor'],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['boolean', 'string', 'number'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        value: {
            type: 'boolean',
            val: false
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        width: {
            type: 'number',
            val: 40,
            tips: 'switch 的宽度（像素）'
        },
        'active-text': {
            type: 'string',
            val: '',
            tips: 'switch 打开时的文字描述'
        },
        'active-value': {
            type: ['boolean', 'string', 'number'],
            val: true,
            tips: 'switch 打开时的值'
        },
        'inactive-value': {
            type: ['boolean', 'string', 'number'],
            val: false,
            tips: 'switch 关闭时的值'
        },
        'active-color': {
            type: 'string',
            val: '#409EFF',
            tips: 'switch 打开时的背景色'
        },
        'inactive-color': {
            type: 'string',
            val: '#C0CCDA',
            tips: 'switch 关闭时的背景色'
        }
    }
}
