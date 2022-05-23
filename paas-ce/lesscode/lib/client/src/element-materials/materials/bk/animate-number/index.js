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
    name: 'animate-number',
    type: 'bk-animate-number',
    displayName: '动画数字',
    icon: 'bk-drag-animatenumber',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/animate-number',
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
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    props: {
        value: {
            type: 'number',
            val: 20,
            regExp: /^(0|[1-9][0-9]*)$/,
            regErrorText: '请输入大于等于0的整数'
        },
        digits: {
            type: 'number',
            val: 2,
            regExp: /^([0-9]|10)$/,
            regErrorText: '请输入0-10之间的整数',
            tips: '数字的位数'
        }
    }
}
