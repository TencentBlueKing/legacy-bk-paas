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
    name: 'el-tabs',
    type: 'el-tabs',
    displayName: '选项卡',
    icon: 'bk-drag-tab',
    group: '导航',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/tabs',
    events: [
        {
            name: 'tab-click',
            tips: 'tab 被选中时调用该事件函数，事件回调参数 (tab: Object)'
        },
        {
            name: 'tab-remove',
            tips: '点击 tab 移除按钮时调用该事件函数，事件回调参数 (name: String)'
        },
        {
            name: 'tab-add',
            tips: '点击 tabs 的新增按钮时调用该事件函数，无回调参数'
        },
        {
            name: 'edit',
            tips: '点击 tabs 的新增按钮或 tab 被关闭时调用该事件函数，事件回调参数 (targetName: String, action: String)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'background', 'opacity'],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
    ],
    props: {
        value: {
            type: 'string',
            val: 'Tab-1',
            tips: '当前显示的选项卡名称'
        },
        type: {
            type: 'string',
            options: ['card', 'border-card'],
            val: 'card',
            tips: '风格类型'
        },
        'tab-position': {
            type: 'string',
            options: ['left', 'right', 'top', 'bottom'],
            val: 'top',
            tips: '选项卡位置'
        },
        closable: {
            type: 'boolean',
            val: true,
            tips: '是否可关闭选项卡'
        },
        addable: {
            type: 'boolean',
            val: false,
            tips: '是否可新增选项卡'
        },
        editable: {
            type: 'boolean',
            val: false,
            tips: '标签是否同时可增加和关闭'
        },
        stretch: {
            type: 'boolean',
            val: false,
            tips: '标签的宽度是否自撑开'
        }
    },
    slots: {
        default: {
            name: ['el-tab-pane'],
            type: ['list', 'remote'],
            displayName: 'tab-panel可选项配置',
            tips: '默认插槽，填写的数据需要是数组且每个元素需包含label和name字段',
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => (!item.hasOwnProperty('name') || !item.hasOwnProperty('label')))
                if (errData) return '返回值每个元素需要含有label和name字段'
            },
            val: [
                { name: 'Tab-1', label: 'Tab-1' },
                { name: 'Tab-2', label: 'Tab-2' },
                { name: 'Tab-3', label: 'Tab-3' }
            ]
        }
    }
}
