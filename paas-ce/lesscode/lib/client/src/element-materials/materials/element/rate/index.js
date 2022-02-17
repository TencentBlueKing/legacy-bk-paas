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
    name: 'el-rate',
    type: 'el-rate',
    displayName: '评分',
    icon: 'bk-drag-rate',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/rate',
    events: [
        {
            name: 'change',
            tips: '分值改变时调用该事件函数，事件回调参数 (value: Number)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'number',
            val: 4
        },
        max: {
            type: 'number',
            val: 5,
            tips: '最大分值'
        },
        disabled: {
            type: 'boolean',
            val: false
        },
        'allow-half': {
            type: 'boolean',
            val: false,
            tips: '是否允许半选'
        },
        'low-threshold': {
            type: 'number',
            val: 2,
            tips: '低分和中等分数的界限值，值本身被划分在低分中'
        },
        'high-threshold': {
            type: 'number',
            val: 4,
            tips: '高分和中等分数的界限值，值本身被划分在高分中'
        },
        color: {
            type: ['array', 'object'],
            val: ['#99A9BF', '#F7BA2A', '#FF9900'],
            tips: 'icon 的颜色。若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的颜色'
        },
        'void-color': {
            type: 'color',
            val: '#C6D1DE',
            tips: '未选中 icon 的颜色'
        },
        'show-text': {
            type: 'boolean',
            val: false,
            tips: '是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容'
        },
        'show-score': {
            type: 'boolean',
            val: false,
            tips: '是否显示当前分数，show-score 和 show-text 不能同时为真'
        },
        'text-color': {
            type: 'color',
            val: '#1F2D3D',
            tips: '辅助文字的颜色'
        },
        'texts': {
            type: 'array',
            val: ['极差', '失望', '一般', '满意', '惊喜'],
            tips: '辅助文字数组'
        }
    }
}
