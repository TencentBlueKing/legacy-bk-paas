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
    name: 'steps',
    type: 'bk-steps',
    displayName: '步骤',
    icon: 'bk-drag-step',
    group: '导航',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/steps',
    events: [
        {
            name: 'step-changed',
            tips: '当前步骤变化时调用该事件函数，事件回调参数 (step: Number)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    props: {
        steps: {
            type: 'step',
            val: [{
                title: '步骤1', icon: 1, description: ''
            }, {
                title: '步骤2', icon: 2, description: ''
            }, {
                title: '步骤3', icon: 3, description: ''
            }]
        },
        'cur-step': {
            type: 'number',
            val: 1,
            tips: '当前步骤的索引值，从 1 开始；支持 .sync 修饰符',
            modifiers: ['sync']
        },
        direction: {
            type: 'string',
            options: ['horizontal', 'vertical'],
            val: 'horizontal',
            tips: '步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向'
        },
        theme: {
            type: 'string',
            options: ['primary', 'info', 'success', 'warning', 'danger'],
            val: 'primary'
        },
        controllable: {
            type: 'boolean',
            val: false,
            tips: '步骤可否被控制前后跳转'
        }
    }
}
