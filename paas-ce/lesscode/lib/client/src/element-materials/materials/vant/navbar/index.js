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
    name: 'van-nav-bar',
    type: 'van-nav-bar',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-navbar',
    displayName: '导航栏',
    group: '导航',
    events: [
        { name: 'click-left', tips: '点击左侧按钮时触发' },
        { name: 'click-right', tips: '点击右侧按钮时触发' }
    ],
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        title: {
            type: 'string',
            val: '标题',
            tips: '标题'
        },
        'left-text': {
            type: 'string',
            val: '返回',
            tips: '左侧文案'
        },
        'right-text': {
            type: 'string',
            val: '确认',
            tips: '右侧文案'
        },
        'left-arrow': {
            type: 'boolean',
            val: false,
            tips: '是否显示左侧箭头'
        },
        'border': {
            type: 'boolean',
            val: true,
            tips: '是否显示边框'
        },
        'fixed': {
            type: 'boolean',
            val: false,
            tips: '是否固定在顶部'
        },
        'placeholder': {
            type: 'boolean',
            val: false,
            tips: '固定在顶部时，是否在标签位置生成一个等高的占位元素'
        },
        'z-index': {
            type: ['number', 'string'],
            val: 1,
            tips: '导航栏 z-index'
        },
        'safe-area-inset-top': {
            type: 'boolean',
            val: false,
            tips: '是否开启顶部安全区适配'
        }
    }
}
