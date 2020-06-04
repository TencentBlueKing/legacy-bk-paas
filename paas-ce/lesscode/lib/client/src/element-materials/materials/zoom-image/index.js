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

export default {
    name: 'zoom-image',
    type: 'bk-zoom-image',
    displayName: '缩放图',
    icon: 'bk-drag-swiper',
    group: '数据',
    order: 1,
    styles: ['size', 'margin', 'display'],
    // defaultStyles: {
    //     width: '600px',
    //     height: '300px'
    // },
    props: {
        'src': {
            type: 'string',
            val: exmapleFirstImgUrl,
            tips: '图片地址'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
