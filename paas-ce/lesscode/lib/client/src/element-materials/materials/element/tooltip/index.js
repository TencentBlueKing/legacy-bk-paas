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
    name: 'el-tooltip',
    type: 'el-tooltip',
    displayName: '文字提示',
    icon: 'bk-drag-popconfrim',
    group: 'Others',
    order: 1,
    styles: ['margin', 'display'],
    renderStyles: {
        display: 'inline-block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['boolean'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        effect: {
            type: 'string',
            val: 'light',
            options: ['light', 'dark'],
            tips: '主题'
        },
        content: {
            type: 'string',
            val: '鼠标移入提示，带操作的工具提示',
            tips: '显示的内容'
        },
        placement: {
            type: 'string',
            val: 'bottom',
            options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
            tips: 'Tooltip 的出现位置'
        },
        value: {
            type: 'boolean',
            val: false,
            tips: '状态是否可见'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: 'Tooltip 是否可用'
        },
        offset: {
            type: 'number',
            val: 0,
            tips: '出现位置的偏移量'
        },
        transition: {
            type: 'string',
            val: 'fade-in-linear',
            tips: '定义渐变动画'
        },
        'visible-arrow': {
            type: 'boolean',
            val: true,
            tips: '是否显示 Tooltip 箭头'
        },
        'popper-class': {
            type: 'string',
            tips: '为 popper 添加类名'
        },
        'open-delay': {
            type: 'number',
            tips: '触发方式为 hover 时的显示延迟，单位为毫秒'
        },
        enterable: {
            type: 'boolean',
            val: true,
            tips: '鼠标是否可进入到 tooltip 中'
        },
        'hide-after': {
            type: 'number',
            val: 0,
            tips: 'Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏'
        },
        slots: {
            name: 'template',
            type: 'html',
            val: '<i class="bk-icon icon-info-circle-shape"></i>'
        }
    }
}
