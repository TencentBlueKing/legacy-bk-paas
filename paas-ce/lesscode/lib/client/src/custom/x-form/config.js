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
    name: 'x-form',
    type: 'x-form',
    displayName: 'x-form',
    styles: ['padding', 'margin', 'font', 'backgroundColor'],
    props: {
        // input
        value: {
            type: 'string',
            val: 'hello world'
        },
        placeholder: {
            type: 'string',
            tips: '空白提示'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        clearable: {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        },
        // button
        title: {
            type: 'string',
            val: 'hello world',
            tips: '原生 html title 属性'
        },
        'button-text': {
            type: 'string',
            val: '按钮',
            tips: '按钮文案'
        },
        'button-submit-url': {
            type: 'string',
            val: '',
            tips: '点击按钮发送请求的异步地址'
        },
        'button-theme': {
            type: 'string',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'text'],
            tips: '按钮类型、主题'
        },
        // select
        'select-value': {
            type: 'string',
            val: '',
            tips: '当前被选中的值'
        },
        'select-show-select-all': {
            type: 'boolean',
            val: true,
            tips: '是否显示全选选项，仅当开启 select-multiple 时生效'
        },
        'select-multiple': {
            type: 'boolean',
            val: true,
            tips: '是否多选'
        },
        'select-disabled': {
            type: 'boolean',
            val: false
        },
        'select-readonly': {
            type: 'boolean',
            val: false
        },
        'select-ajax-url': {
            type: 'string',
            val: '',
            tips: '下拉框获取数据的异步地址'
        },
        'select-render-list': {
            type: 'array',
            val: [
                { id: 1, name: '爬山' },
                { id: 2, name: '跑步' },
                { id: 3, name: '打球' },
                { id: 4, name: '跳舞' },
                { id: 5, name: '健身' },
                { id: 6, name: '骑车' }
            ],
            tips: '下拉框的数据'
        }
    }
}
