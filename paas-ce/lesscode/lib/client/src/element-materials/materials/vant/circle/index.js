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
    name: 'van-circle',
    type: 'van-circle',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-circle',
    displayName: '环形进度条',
    group: '数据',
    styles: ['padding', 'margin', 'font'],
    renderStyles: {
    },
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        'value': {
            type: 'number',
            val: 70,
            tips: '当前进度'
        },
        'rate': {
            type: ['string', 'number'],
            val: 100,
            tips: '目标进度'
        },
        'size': {
            type: ['string', 'number'],
            val: '100px',
            tips: '圆环直径，默认单位为 px'
        },
        'color': {
            type: ['object', 'string'],
            val: '#1989fa',
            tips: '进度条颜色，传入对象格式可以定义渐变色'
        },
        'layer-color': {
            type: 'string',
            val: 'white',
            tips: '轨道颜色'
        },
        'fill-color': {
            type: 'string',
            val: 'none',
            tips: '填充颜色'
        },
        'speed': {
            type: ['object', 'string'],
            val: 0,
            tips: '动画速度（单位为 rate/s）'
        },
        'text': {
            type: 'string',
            val: '进度',
            tips: '文字'
        },
        'stroke-width': {
            type: ['object', 'string'],
            val: 40,
            tips: '进度条宽度'
        },
        'stroke-linecap': {
            type: 'string',
            options: ['square', 'butt', 'round'],
            val: 'round',
            tips: '进度条端点的形状'
        },
        'clockwise': {
            type: 'boolean',
            val: false,
            tips: '是否顺时针增加'
        }
    }
}
