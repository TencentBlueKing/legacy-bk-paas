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
    name: 'rate',
    type: 'bk-rate',
    displayName: '评分',
    icon: 'bk-drag-rate',
    group: '表单',
    order: 1,
    events: [{
        name: 'score', tips: '评分的时候触发该回调事件，回调参数为选中的分数'
    }],
    styles: ['margin', 'display'],
    directives: [
        {
            type: 'v-bind',
            prop: 'rate',
            propTypes: ['number'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        rate: {
            type: 'number',
            val: 0,
            tips: '显示的分数'
        },
        width: {
            type: 'number',
            val: 15,
            tips: '星星的宽度'
        },
        height: {
            type: 'number',
            val: 16,
            tips: '星星的高度'
        },
        edit: {
            type: 'boolean',
            val: true
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
