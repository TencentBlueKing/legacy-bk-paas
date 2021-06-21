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
    name: 'el-color-picker',
    type: 'el-color-picker',
    displayName: '颜色选择',
    icon: 'bk-drag-colorpick',
    group: 'Form',
    order: 1,
    styles: ['margin', 'padding', 'display'],
    renderStyles: {
        display: 'inline-flex'
    },
    events: [{
        name: 'change', tips: '当绑定值变化时触发, 回调参数：当前值'
    }, {
        name: 'active-change', tips: '面板中当前显示的颜色发生改变时触发, 回调参数：当前显示的颜色值'
    }],
    directives: [
        {
            type: 'v-model',
            propTypes: ['string'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        size: {
            type: 'string',
            val: '',
            options: ['medium', 'small', 'mini'],
            tips: '尺寸大小'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用状态'
        },
        'show-alpha': {
            type: 'boolean',
            val: false,
            tips: '是否支持透明度选择'
        },
        'color-format': {
            type: 'string',
            options: ['hsl ', 'hsv', 'hex', 'rgb'],
            val: 'hex',
            tips: '写入 v-model 的颜色的格式'
        },
        predefine: {
            type: 'array',
            val: [],
            tips: '预定义颜色'
        },
        'popper-class': {
            type: 'string',
            tips: 'ColorPicker 下拉框的类名'
        }
    }
}
