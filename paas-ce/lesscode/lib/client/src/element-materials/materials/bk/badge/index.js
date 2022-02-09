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
    name: 'badge',
    type: 'bk-badge',
    displayName: '标记',
    icon: 'bk-drag-badge',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/badge',
    events: [
        {
            name: 'hover',
            tips: '鼠标 hover 时调用该事件函数，暂无回调参数'
        },
        {
            name: 'leave',
            tips: '鼠标 leave 时调用该事件函数，暂无回调参数'
        }
    ],
    styles: [
        'position',
        'size',
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
        display: 'inline-block'
    },
    props: {
        theme: {
            type: 'string',
            options: ['primary', 'info', 'warning', 'danger', 'success'],
            val: 'primary',
            tips: '主题色'
        },
        val: {
            type: 'string',
            val: '1',
            tips: '标记内容'
        },
        icon: {
            type: 'icon',
            val: ''
        },
        max: {
            type: 'number',
            val: '',
            tips: '组件显示的最大值，当 value 超过 max，显示数字 +；仅当设置了 Number 类型的 value 值时生效'
        },
        dot: {
            type: 'boolean',
            val: false,
            tips: '是否仅显示小圆点；当设置 dot 为 true 时，val, icon, max 均会被忽略'
        },
        position: {
            type: 'string',
            val: 'top-right',
            options: ['top-right', 'bottom-right', 'bottom-left', 'top-left'],
            tips: '组件相对于其兄弟组件的位置'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['text'],
            displayName: '文本配置',
            val: '文字标记'
        }
    }
}
