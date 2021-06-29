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
    name: 'el-radio-group',
    type: 'el-radio-group',
    displayName: '单选框',
    icon: 'bk-drag-radio',
    group: 'Form',
    order: 1,
    events: [{
        name: 'change', tips: '绑定值变化时触发的事件，回调参数为选中的 Radio label 值'
    }],
    styles: ['margin'],
    directives: [
        {
            type: 'v-model',
            prop: 'value',
            propTypes: ['string', 'number', 'boolean'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        slots: {
            name: 'el-radio',
            type: ['el-radio', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('label')))
                if (errData) return '返回值每个元素需要含有label字段'
            },
            val: [
                { label: '单选一' },
                { label: '单选二' },
                { label: '单选三' }
            ],
            // 生成 slot 时，每个 slot 的属性值映射，例如 bk-checkbox 里的 :label, :value, :checked, :key
            // <bk-checkbox v-for="item in checkboxgroupc57d9bc6Slot" :label="item.label" :value="item.value" :checked="item.checked" :key="item.value">{{ item.label }}</bk-checkbox>
            attrs: [
                { 'key': 'label', 'value': 'label' },
                { 'key': 'key', 'value': 'label' }
            ]
        },
        value: {
            type: ['string', 'number', 'boolean'],
            val: ''
        },
        disabled: {
            type: 'boolean',
            val: false,
            'v-bind': '',
            tips: '是否禁用状态'
        },
        fill: {
            type: 'string',
            val: '#409EFF',
            tips: '按钮形式的 Radio 激活时的填充色和边框色'
        }
    }
}
