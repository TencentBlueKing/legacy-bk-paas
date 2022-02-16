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
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/rate',
    events: [
        {
            name: 'score',
            tips: '评分的时候调用该事件函数，事件回调参数 (rate: Number)'
        }
    ],
    styles: ['position', 'size', 'padding', 'margin', 'pointer', 'opacity'],
    directives: [
        // {
        //     type: 'v-bind',
        //     prop: 'rate',
        //     propTypes: ['number'],
        //     val: '',
        //     valType: 'variable',
        //     modifiers: ['sync']
        // }
    ],
    props: {
        rate: {
            type: 'number',
            val: 0,
            tips: '显示的分数',
            modifiers: ['sync']
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
        }
    }
}
