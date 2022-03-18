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
    name: 'van-icon',
    type: 'van-icon',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-icon',
    displayName: '图标',
    group: '基础',
    document: 'https://vant-contrib.gitee.io/vant/v2/#/zh-CN/icon',
    events: [
        {
            name: 'click',
            tips: '点击图标时触发，事件回调参数 (e: Event)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        name: {
            type: 'van-icon',
            val: 'chat-o',
            tips: '图标名称或图片链接'
        },
        dot: {
            type: 'boolean',
            val: false,
            tips: '是否显示图标右上角小红点'
        },
        badge: {
            type: ['string', 'number'],
            val: '',
            tips: '图标右上角徽标的内容'
        },
        color: {
            type: 'color',
            val: 'inherit',
            tips: '图标颜色'
        },
        size: {
            type: ['string', 'number'],
            val: 'inherit',
            tips: '图标大小，如 20px 2em，默认单位为px'
        },
        tag: {
            type: 'string',
            val: 'i',
            vips: 'HTML 标签'
        }
    }
}
