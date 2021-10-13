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
    name: 'text',
    type: 'span',
    displayName: '文字',
    icon: 'bk-drag-text',
    group: '基础',
    order: 1,
    styles: ['size', 'margin', 'padding', 'display', 'font', 'border', 'backgroundColor', 'textAlign', 'color'],
    renderStyles: {
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '14px',
        color: '#63656e'
    },
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
            type: ['text'],
            displayName: '文本配置',
            val: '默认文字',
            regExp: /\S/,
            regErrorText: '文本配置不能为空'
        }
    }
}
