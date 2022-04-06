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
    name: 'el-transfer',
    type: 'el-transfer',
    displayName: '穿梭框',
    icon: 'bk-drag-transfer',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/transfer',
    events: [
        {
            name: 'change',
            tips: '右侧列表元素变化时调用该事件函数，事件回调参数 (value: Array、direction: String、 moveKey: Array)'
        },
        {
            name: 'left-check-change',
            tips: '左侧列表元素被用户选中 / 取消选中时调用该事件函数，事件回调参数 (selectedKey: Array、 changeKey: Array)'
        },
        {
            name: 'right-check-change',
            tips: '右侧列表元素被用户选中 / 取消选中时调用该事件函数，事件回调参数 (selectedKey: Array、 changeKey: Array)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
        // {
        //     type: 'v-bind',
        //     prop: 'data',
        //     propTypes: ['array'],
        //     val: '',
        //     valType: 'variable'
        // }
    ],
    props: {
        value: {
            type: 'array',
            val: [],
            tips: '当前被选中的值，支持v-model，多选时配置一个二维数组'
        },
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                { key: 'shenzhen', label: '深圳', disabled: false },
                { key: 'guangzhou', label: '广州', disabled: false },
                { key: 'beijing', label: '北京', disabled: false },
                { key: 'shanghai', label: '上海', disabled: false },
                { key: 'hangzhou', label: '杭州', disabled: false },
                { key: 'nanjing', label: '南京', disabled: false },
                { key: 'chognqing', label: '重庆', disabled: false },
                { key: 'taibei', label: '台北', disabled: false },
                { key: 'haikou', label: '海口', disabled: false }
            ],
            tips: '穿梭框数据源'
        },
        filterable: {
            type: 'boolean',
            val: false,
            tips: '是否可搜索'
        },
        'filter-placeholder': {
            type: 'string',
            val: '',
            tips: '请输入搜索内容'
        },
        'target-order': {
            type: 'string',
            val: 'original',
            options: ['original', 'push', 'unshift'],
            tips: '右侧列表元素的排序策略：若为 original，则保持与数据源相同的顺序；若为 push，则新加入的元素排在最后；若为 unshift，则新加入的元素排在最前'
        },
        titles: {
            type: 'array',
            val: ['列表1', '列表2'],
            tips: '自定义列表标题'
        },
        'button-texts': {
            type: 'array',
            val: [],
            tips: '自定义按钮文案'
        },
        'left-default-checked': {
            type: 'array',
            val: [],
            tips: '初始状态下左侧列表的已勾选项的 key 数组'
        },
        'right-default-checked': {
            type: 'array',
            val: [],
            tips: '初始状态下右侧列表的已勾选项的 key 数组'
        }
    }
}
