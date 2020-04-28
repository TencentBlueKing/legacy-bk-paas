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
    name: 'round-progress',
    type: 'bk-round-progress',
    displayName: '圆形进度',
    icon: 'bk-drag-roundprogress',
    group: '数据',
    order: 1,
    styles: ['margin', 'display'],
    defaultStyles: {
        display: 'inline-block'
    },
    props: {
        percent: {
            type: 'number',
            val: 0.3
        },
        radius: {
            type: 'string',
            val: '100px'
        },
        'num-show': {
            type: 'boolean',
            val: true
        },
        'num-style': {
            type: 'object',
            val: { fontSize: '16px' }
        },
        title: {
            type: 'string'
        },
        'title-style': {
            type: 'object',
            val: { fontSize: '16px' }
        },
        config: {
            type: 'object',
            val: {
                strokeWidth: 10,
                bgColor: '#f0f1f5',
                activeColor: '#2dcb56'
            }
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
