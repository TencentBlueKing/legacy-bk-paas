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
    name: 'el-avatar',
    type: 'el-avatar',
    displayName: '头像',
    icon: 'bk-drag-image',
    group: '数据',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/avatar',
    events: [
        {
            name: 'error',
            tips: ' 图片类头像加载失败时调用该事件函数，事件回调参数 (e: Event)'
        }
    ],
    styles: ['position', 'size', 'padding', 'margin', 'pointer', 'background', 'opacity'],
    renderStyles: {
        display: 'inline-block'
    },
    props: {
        icon: {
            type: 'icon',
            val: '',
            tips: '设置头像的图标类型'
        },
        size: {
            type: ['string', 'number'],
            val: 'large',
            tips: '计数器尺寸:large, medium, small, mini'
        },
        shape: {
            type: 'string',
            options: ['circle', 'square'],
            val: 'circle',
            tips: '设置头像的形状'
        },
        src: {
            type: 'string',
            val: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example/static/images/firstswiper.jpg',
            tips: '图片头像的资源地址'
        },
        srcSet: {
            type: 'string',
            val: '',
            tips: '以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像'
        },
        alt: {
            type: 'string',
            val: '',
            tips: '图片加载失败时替换文字'
        },
        fit: {
            type: 'string',
            options: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            val: 'cover',
            tips: '当展示类型为图片的时候，设置图片如何适应容器框'
        }
    }
}
