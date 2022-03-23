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
    name: 'van-switch',
    type: 'van-switch',
    displayName: '开关',
    icon: 'bk-drag-switcher',
    group: '表单',
    order: 1,
    document: 'https://youzan.github.io/vant/v2/#/zh-CN/switch',
    events: [
        {
            name: 'change',
            tips: '状态发生变化时调用该事件函数，事件回调参数 (value: boolean)'
        },
        {
            name: 'click',
            tips: '点击时触发，事件回调参数 (event: Event)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'boolean',
            val: false,
            tips: '开关选中状态'
        },
        loading: {
            type: 'boolean',
            val: false
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        size: {
            type: ['string', 'number'],
            val: '30px',
            tips: '开关尺寸，默认单位为px'
        },
        'active-color': {
            type: 'string',
            val: '#1989fa',
            tips: '打开时的背景色'
        },
        'inactive-color': {
            type: 'string',
            val: 'white',
            tips: '关闭时的背景色'
        }
    }
}
