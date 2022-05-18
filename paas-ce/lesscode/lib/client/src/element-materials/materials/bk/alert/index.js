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
    name: 'alert',
    type: 'bk-alert',
    displayName: '警告',
    icon: 'bk-drag-alert-line',
    group: '反馈',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/alert',
    events: [
        {
            name: 'close',
            tips: '关闭警告时调用该事件函数，事件回调参数 (event: Event)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['height', 'maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    props: {
        type: {
            type: 'string',
            val: 'info',
            options: ['info', 'success', 'warning', 'error'],
            tips: '主题'
        },
        title: {
            type: 'string',
            val: '消息的提示文字',
            tips: '警告标题'
        },
        disable: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        closable: {
            type: 'boolean',
            val: false,
            tips: '是否可以关闭'
        },
        'close-text': {
            type: 'string',
            val: '',
            tips: '自定义关闭按钮'
        },
        'show-icon': {
            type: 'boolean',
            val: true,
            tips: '是否显示按钮'
        }
    }
}
