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
    name: 'el-input-number',
    type: 'el-input-number',
    displayName: '计数器',
    icon: 'bk-drag-input',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/input-number',
    events: [
        {
            name: 'change',
            tips: '绑定值被改变时调用该事件函数，事件回调参数 (currentValue: Number, oldValue: Number)'
        },
        {
            name: 'focus',
            tips: '在组件 Input 获得焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'blur',
            tips: '在组件 Input 失去焦点时调用该事件函数，事件回调参数 (event: Event)'
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
        'opacity'
    ],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'number',
            val: 0
        },
        min: {
            type: 'number',
            val: -100,
            tips: '设置计数器允许的最小值'
        },
        max: {
            type: 'number',
            val: 100,
            tips: '计数器步长'
        },
        step: {
            type: 'number',
            val: 1,
            tips: '设置计数器允许的最大值'
        },
        'step-strictly': {
            type: 'boolean',
            val: true,
            tips: '是否只能输入 step 的倍数'
        },
        precision: {
            type: 'number',
            tips: '数值精度'
        },
        size: {
            type: 'string',
            options: ['large', 'medium', 'small', 'mini'],
            tips: '计数器尺寸'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        controls: {
            type: 'boolean',
            val: true,
            tips: '是否使用控制按钮'
        },
        'controls-position': {
            type: 'string',
            options: ['right', 'normal'],
            val: 'normal',
            tips: '控制按钮位置'
        },
        name: {
            type: 'string',
            tips: 'html 原生属性 name'
        },
        label: {
            type: 'string',
            val: '',
            tips: '输入框关联的label文字'
        },
        placeholder: {
            type: 'string',
            val: '',
            tips: '输入框默认 placeholder'
        }
    }
}
