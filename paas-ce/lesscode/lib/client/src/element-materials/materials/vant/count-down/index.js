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
    name: 'van-count-down',
    type: 'van-count-down',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-countdown',
    displayName: '倒计时',
    group: '数据',
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    events: [
        { name: 'finish', tips: '倒计时结束时触发' },
        { name: 'change', tips: '倒计时变化时触发, 回调参数（timeData: TimeData）' }
    ],
    props: {
        'time': {
            type: ['string', 'number'],
            val: 30 * 60 * 60 * 1000,
            tips: '倒计时时长，单位毫秒'
        },
        'format': {
            type: 'string',
            val: 'HH:mm:ss',
            tips: '时间格式，天数(DD)/小时(HH)/分钟(mm)/秒(ss)/毫秒(S/SS/SSS)'
        },
        'auto-start': {
            type: 'boolean',
            val: true,
            tips: '是否自动开始倒计时'
        },
        'millisecond': {
            type: 'boolean',
            val: false,
            tips: '是否开启毫秒级渲染，若要看到效果，请务必将format中设置SS(毫秒）'
        }
    }
}
