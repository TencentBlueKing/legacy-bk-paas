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
    name: 'el-slider',
    type: 'el-slider',
    displayName: '滑块',
    icon: 'bk-drag-slider',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/slider',
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
            val: 30
        },
        'min': {
            type: 'number',
            val: 0
        },
        'max': {
            type: 'number',
            val: 100
        },
        disable: {
            type: 'boolean',
            val: false
        },
        'step': {
            type: 'number',
            val: 1,
            tips: '步长'
        },
        'show-tooltip': {
            type: 'boolean',
            val: true,
            tips: '是否显示 tooltip'
        },
        'show-stops': {
            type: 'boolean',
            val: false,
            tips: '是否显示间断点'
        },
        'range': {
            type: 'boolean',
            val: false,
            tips: '是否为范围选择'
        },
        'vertical': {
            type: 'boolean',
            val: false,
            tips: '是否竖向模式'
        },
        'height': {
            type: 'string',
            val: '',
            tips: 'Slider 高度，竖向模式时必填'
        },
        marks: {
            type: 'object',
            val: {
                10: {
                    style: {
                        color: '#1989FA'
                    },
                    label: '10%'
                }
            },
            tips: '标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式'
        }
    }
}
