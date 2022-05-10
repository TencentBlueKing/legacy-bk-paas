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
    name: 'divider',
    type: 'bk-divider',
    displayName: '分割线',
    icon: 'bk-drag-custom-comp-default',
    group: '基础',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/divider',
    events: [],
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
    renderStyles: {
        display: 'block'
    },
    props: {
        direction: {
            type: 'string',
            val: 'horizontal',
            options: ['horizontal', 'vertical'],
            tips: '分割线方向'
        },
        align: {
            type: 'string',
            val: 'center',
            options: ['left', 'right', 'center'],
            tips: '分割线位置'
        },
        color: {
            type: 'color',
            val: '#dde4eb',
            tips: '分割线颜色'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            displayName: '文本配置',
            val: '分割线'
        }
    }
}
