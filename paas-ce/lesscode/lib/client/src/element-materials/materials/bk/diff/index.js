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
    name: 'diff',
    type: 'bk-diff',
    displayName: '差异对比',
    icon: 'bk-drag-diff',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/diff',
    styles: [
        'position',
        'size',
        'padding',
        'margin',
        {
            name: 'font',
            exclude: ['wordSpacing', 'textOverflow', 'wordBreak', 'wordWrap', 'whiteSpace', 'verticalAlign']
        },
        'pointer',
        'background',
        'opacity'
    ],
    renderStyles: {
        display: 'block'
    },
    props: {
        'old-content': {
            type: ['string', 'remote'],
            val: 'auth.requestCurrentUser().then(user => {})'
        },
        'new-content': {
            type: ['string', 'remote'],
            val: 'auth.requestCurrentUser().then(user => { return 223 })'
        },
        theme: {
            type: 'string',
            options: ['light', 'dark'],
            val: 'light'
        },
        format: {
            type: 'string',
            options: ['line-by-line', 'side-by-side'],
            val: 'side-by-side',
            tips: '展示方式'
        },
        context: {
            type: 'number',
            val: 5,
            tips: '不同地方间隔多少行不隐藏'
        },
        language: {
            type: 'string',
            options: ['javascript', 'python', 'java', 'c'],
            val: 'javascript'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
