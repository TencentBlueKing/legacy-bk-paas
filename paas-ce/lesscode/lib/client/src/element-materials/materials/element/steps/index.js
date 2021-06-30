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
    name: 'el-steps',
    type: 'el-steps',
    displayName: '步骤',
    icon: 'bk-drag-step',
    group: 'Navigation',
    order: 1,
    styles: ['size', 'margin', 'display'],
    props: {
        slots: {
            name: 'el-step',
            type: ['el-step', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('title')))
                if (errData) return '返回值每个元素需要含有title字段'
            },
            val: [
                { title: '步骤 1', icon: 'el-icon-edit', description: '' },
                { title: '步骤 2', icon: 'el-icon-upload', description: '' },
                { title: '步骤 3', icon: 'el-icon-picture', description: '' }
            ],
            // 生成 slot 时，每个 slot 的属性值映射，例如 bk-checkbox 里的 :label, :value, :checked, :key
            // <bk-checkbox v-for="item in checkboxgroupc57d9bc6Slot" :label="item.label" :value="item.value" :checked="item.checked" :key="item.value">{{ item.label }}</bk-checkbox>
            attrs: [
                { 'key': 'title', 'value': 'title' },
                { 'key': 'icon', 'value': 'icon' },
                { 'key': 'description', 'value': 'description' },
                { 'key': 'key', 'value': 'title' }
            ]
        },
        space: {
            type: ['number', 'string'],
            tips: '每个 step 的间距，不填写将自适应间距。支持百分比'
        },
        direction: {
            type: 'string',
            options: ['horizontal', 'vertical'],
            val: 'horizontal',
            tips: '步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向'
        },
        active: {
            type: 'number',
            val: 0,
            tips: '设置当前激活步骤'
        },
        'process-status': {
            type: 'string',
            options: ['wait', 'process', 'finish', 'error', 'success'],
            val: 'process',
            tips: '设置当前步骤的状态'
        },
        'finish-status': {
            type: 'string',
            options: ['wait', 'process', 'finish', 'error', 'success'],
            val: 'finish',
            tips: '设置结束步骤的状态'
        },
        'align-center': {
            type: 'boolean',
            val: false,
            tips: '进行居中对齐'
        },
        simple: {
            type: 'boolean',
            val: false,
            tips: '是否应用简洁风格'
        }
    }
}
