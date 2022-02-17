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
    name: 'collapse',
    type: 'bk-collapse',
    displayName: '折叠面板',
    icon: 'bk-drag-collapse',
    group: '数据',
    order: 1,
    events: [{ name: 'item-click', tips: '点击时调用该事件函数，事件回调参数 (names: Array)' }],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    props: {
        'active-name': {
            type: 'string',
            val: '',
            tips: '当前激活面板的 name',
            modifiers: ['sync']
        },
        accordion: {
            type: 'boolean',
            val: false,
            tips: '是否使用手风琴效果'
        },
        slots: {
            name: 'bk-collapse-item',
            type: 'collapse',
            val: [
                { name: 'collapse' }
            ]
        }
    }
}
