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

const urlPrefix = 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example'

const exmapleFirstImgUrl = urlPrefix + '/static/images/firstswiper.jpg'
const exmapleSecondImgUrl = urlPrefix + '/static/images/secondswiper.jpg'

export default {
    name: 'swiper',
    type: 'bk-swiper',
    displayName: '轮播图',
    icon: 'bk-drag-swiper',
    group: '数据',
    order: 1,
    events: ['index-change'],
    styles: ['size', 'margin', 'display'],
    props: {
        'is-loop': {
            type: 'boolean',
            val: true
        },
        height: {
            type: 'number',
            val: 300
        },
        width: {
            type: 'number',
            val: 600
        },
        pics: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => !item.hasOwnProperty('url'))
                if (errData) return '返回值每个元素需要含有url字段'
            },
            val: [
                { url: exmapleFirstImgUrl },
                { url: exmapleSecondImgUrl }
            ]
        },
        'loop-time': {
            type: 'number',
            val: 8000
        },
        'ext-cls': {
            type: 'string',
            val: ''
        }
    }
}
