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
    name: 'el-timeline',
    type: 'el-timeline',
    displayName: '时间轴',
    icon: 'bk-drag-timeline',
    group: 'Others',
    order: 1,
    styles: ['size', 'margin', 'display'],
    props: {
        slots: {
            name: 'el-timeline-item',
            type: ['timeline', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('label') || !item.hasOwnProperty('timestamp')))
                if (errData) return '返回值每个元素需要含有label和timestamp字段'
            },
            val: [
                { label: '活动按期开始', timestamp: '2018-04-15', color: '#0bbd87' },
                { label: '通过审核', timestamp: '2018-04-13', color: '' },
                { label: '创建成功', timestamp: '2018-04-11', color: '' }
            ],
            // 生成 slot 时，每个 slot 的属性值映射，例如 bk-checkbox 里的 :label, :value, :checked, :key
            // <bk-checkbox v-for="item in checkboxgroupc57d9bc6Slot" :label="item.label" :value="item.value" :checked="item.checked" :key="item.value">{{ item.label }}</bk-checkbox>
            attrs: [
                { 'key': 'label', 'value': 'label' },
                { 'key': 'timestamp', 'value': 'timestamp' },
                { 'key': 'color', 'value': 'color' },
                { 'key': 'key', 'value': 'timestamp' }
            ]
        },
        reverse: {
            type: 'boolean',
            val: false,
            tips: '指定节点排序方向，默认为正序'
        }
    }
}
