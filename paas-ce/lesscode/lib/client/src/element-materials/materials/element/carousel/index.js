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
    name: 'el-carousel',
    type: 'el-carousel',
    displayName: '走马灯',
    icon: 'bk-drag-swiper',
    group: '其他',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/carousel',
    events: [
        {
            name: 'change',
            tips: '幻灯片切换时触发时调用该事件函数，事件回调参数 (currentIndex: Number、preIndex: Number)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    renderStyles: {
        width: '600px',
        height: '300px'
    },
    directives: [
        // {
        //     type: 'v-bind',
        //     prop: 'pics',
        //     propTypes: ['array'],
        //     val: '',
        //     valType: 'variable'
        // }
    ],
    props: {
        height: {
            type: 'string',
            tips: '走马灯的高度'
        },
        'initial-index': {
            type: 'number',
            val: 0,
            tips: '初始状态激活的幻灯片的索引，从 0 开始'
        },
        'trigger': {
            type: 'string',
            options: ['click', 'hover'],
            val: 'click',
            tips: '指示器的触发方式'
        },
        autoplay: {
            type: 'boolean',
            val: true,
            tips: '是否自动切换'
        },
        interval: {
            type: 'number',
            val: 5000,
            tips: '自动切换的时间间隔，单位为毫秒'
        },
        'indicator-position': {
            type: 'string',
            options: ['', 'outside', 'none'],
            tips: '指示器的位置'
        },
        arrow: {
            type: 'string',
            options: ['always', 'hover', 'never'],
            val: 'hover',
            tips: '切换箭头的显示时机'
        },
        type: {
            type: 'string',
            options: ['', 'card'],
            val: '',
            tips: '走马灯的类型'
        },
        loop: {
            type: 'boolean',
            val: true,
            tips: '是否循环显示'
        },
        direction: {
            type: 'string',
            options: ['horizontal', 'vertical'],
            val: 'horizontal',
            tips: '走马灯展示的方向'
        }
    },
    slots: {
        default: {
            name: ['el-carousel-item'],
            type: ['list', 'remote'],
            displayName: 'carousel可选项配置',
            tips: '值需要是数组，且每个元素需要含有label和name字段',
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('label') || !item.hasOwnProperty('name')))
                if (errData) return '返回值每个元素需要含有label和name字段'
            },
            val: [
                { label: '走马灯1', name: '走马灯1', content: '<img src="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example/static/images/firstswiper.jpg" />' },
                { label: '走马灯2', name: '走马灯2', content: '<img src="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example/static/images/secondswiper.jpg" />' }
            ]
        }
    }
}
