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
    name: 'link',
    type: 'bk-link',
    displayName: '文字链接',
    icon: 'bk-drag-link1',
    group: '基础',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/link',
    events: [
        {
            name: 'click',
            tips: '文字链接点击时调用该事件函数，事件回调参数 (event: Event)'
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
        'opacity',
        {
            name: 'font',
            exclude: ['color']
        }
    ],
    renderStyles: {
        display: 'inline-block',
        textAlign: 'center'
    },
    props: {
        theme: {
            type: 'string',
            val: 'primary',
            options: ['default', 'primary', 'success', 'warning', 'danger'],
            tips: '链接类型、主题'
        },
        href: {
            type: 'string',
            val: '',
            tips: '链接跳转地址'
        },
        disable: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        underline: {
            type: 'boolean',
            val: false,
            tips: '是否显示下划线'
        },
        icon: {
            type: 'icon',
            val: '',
            tips: '图标类名'
        },
        'icon-placement': {
            type: 'string',
            val: 'left',
            options: ['left', 'right'],
            tips: '图标位置'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            displayName: '文本配置',
            val: '文字链接'
        }
    }
}
