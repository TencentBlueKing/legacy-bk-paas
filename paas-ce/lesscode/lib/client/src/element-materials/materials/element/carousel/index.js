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
    group: 'Others',
    order: 1,
    events: [{
        name: 'index-change', tips: '图片索引改变时触发该事件，回调参数为当前图片的索引'
    }],
    styles: ['size', 'margin', 'display'],
    renderStyles: {
        width: '600px',
        height: '300px'
    },
    directives: [
        {
            type: 'v-bind',
            prop: 'pics',
            propTypes: ['array'],
            val: '',
            valType: 'variable'
        }
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
        },
        slots: {
            name: 'el-carousel-item',
            type: ['carousel', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('label') || !item.hasOwnProperty('name')))
                if (errData) return '返回值每个元素需要含有label和name字段'
            },
            val: [
                { label: '走马灯1', name: '走马灯1', content: '<img src="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example/static/images/firstswiper.jpg" />' },
                { label: '走马灯2', name: '走马灯2', content: '<img src="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example/static/images/secondswiper.jpg" />' }
            ],
            // 生成 slot 时，每个 slot 的属性值映射，例如 bk-checkbox 里的 :label, :value, :checked, :key
            // <bk-checkbox v-for="item in checkboxgroupc57d9bc6Slot" :label="item.label" :value="item.value" :checked="item.checked" :key="item.value">{{ item.label }}</bk-checkbox>
            attrs: [
                { 'key': 'label', 'value': 'label' },
                { 'key': 'name', 'value': 'name' },
                { 'key': 'key', 'value': 'name' }
            ]
        }
    }
}
