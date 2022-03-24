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
    name: 'van-empty',
    type: 'van-empty',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-empty',
    displayName: '空状态',
    group: '数据',
    styles: ['padding', 'margin', 'size'],
    renderStyles: {
    },
    props: {
        'image': {
            type: 'string',
            val: 'default',
            options: ['error', 'network', 'search', 'default'],
            tips: '图片类型'
        },
        'image-size': {
            type: ['string', 'number'],
            tips: '图片大小，默认单位为 px'
        },
        'description': {
            type: 'string',
            val: '',
            tips: '图片下方的描述文字'
        }
    }
}
