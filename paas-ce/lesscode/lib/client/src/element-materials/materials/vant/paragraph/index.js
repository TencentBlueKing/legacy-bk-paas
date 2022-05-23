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
    name: 'paragraph',
    type: 'p',
    displayName: '段落',
    icon: 'bk-drag-text',
    group: '基础',
    order: 1,
    styles: ['size', 'margin', 'display', 'font', 'backgroundColor', 'textAlign'],
    renderStyles: {
        display: 'inline-block',
        textAlign: 'left',
        fontSize: '28rpx',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
    },
    directives: [
        {
            type: 'v-html',
            prop: 'slots',
            format: 'variable',
            valueTypeInclude: ['string']
        }
    ],
    props: {
        title: {
            type: 'string',
            val: '',
            tips: '文字描述，hover 时会浮现提示内容'
        }
    },
    slots: {
        default: {
            name: ['text'],
            type: ['textarea'],
            displayName: '文本配置',
            regExp: /\S/,
            val: '默认段落文字',
            regErrorText: '文本配置不能为空'
        }
    }
}
