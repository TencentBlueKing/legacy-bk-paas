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
    name: 'van-tree-select',
    type: 'van-tree-select',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-treeselect',
    displayName: '分类选择',
    group: '导航',
    events: [
        { name: 'click-nav', tips: '点击左侧导航时触发，事件回调参数 index' },
        { name: 'click-item', tips: '点击右侧选择项时触发，事件回调参数 data' }
    ],
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    props: {
        items: {
            type: 'array',
            val: [
                { text: '江苏',
                    badge: 5,
                    children: [
                        { text: '南京', id: 1 },
                        { text: '无锡', id: 2 },
                        { text: '徐州', id: 3 },
                        { text: '苏州', id: 4 }
                    ] },
                { text: '浙江',
                    dot: true,
                    children: [
                        { text: '杭州', id: 1 },
                        { text: '温州', id: 2 },
                        { text: '宁波', disabled: true, id: 3 },
                        { text: '义务', id: 4 }
                    ] }
            ],
            tips: '整体为一个数组，数组内包含一系列描述分类的对象，每个分类里，text表示当前分类的名称，children表示分类里的可选项。'
        },
        height: {
            type: ['string', 'number'],
            val: 300,
            tips: '高度，默认单位为px'
        },
        'main-active-index': {
            type: ['string', 'number'],
            val: 0,
            tips: '左侧选中项的索引'
        },
        'active-id': {
            type: ['string', 'number', 'array'],
            val: 0,
            tips: '左侧选中项的索引,支持传入数组'
        },
        max: {
            type: ['string', 'number'],
            val: 'Infinity',
            tips: '右侧项最大选中个数'
        }
    }
}
