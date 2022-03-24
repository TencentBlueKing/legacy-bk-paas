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
    name: 'van-password-input',
    type: 'van-password-input',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-passwordinput',
    displayName: '密码输入框',
    group: '表单',
    document: 'https://vant-contrib.gitee.io/vant/v2/#/zh-CN/password-input',
    events: [
        {
            name: 'focus',
            tips: '输入框聚焦时触发，暂无回调参数'
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
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'string',
            val: '',
            tips: '密码值'
        },
        info: {
            type: 'string',
            val: '',
            tips: '输入框下方文字提示'
        },
        'error-info': {
            type: 'string',
            val: '',
            tips: '输入框下方错误提示'
        },
        length: {
            type: ['number', 'string'],
            val: 6,
            tips: '密码最大长度'
        },
        gutter: {
            type: ['number', 'string'],
            val: 0,
            tips: '输入框格子之间的间距，如 20px 2em，默认单位为px'
        },
        mask: {
            type: 'boolean',
            val: true,
            tips: '是否隐藏密码内容'
        },
        focused: {
            type: 'boolean',
            val: false,
            tips: '是否已聚焦，聚焦时会显示光标'
        }
    }
}
