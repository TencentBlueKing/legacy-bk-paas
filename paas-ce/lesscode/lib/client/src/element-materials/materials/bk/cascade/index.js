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
    name: 'cascade',
    type: 'bk-cascade',
    displayName: '级联选框',
    icon: 'bk-drag-cascade-jilianxuankuang',
    group: '表单',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/cascade',
    events: [
        {
            name: 'toggle',
            tips: '切换下拉折叠状态时调用该事件函数，参数为(isOpen: Boolean)'
        },
        {
            name: 'change',
            tips: '选项发生变化时调用该事件函数，参数为(newValue: String | Number, oldValue: String | Number, selectList: Array)'
        },
        {
            name: 'clear',
            tips: '清空选项时调用该事件函数，参数为(oldValue: String | Number)'
        },
        {
            name: 'search',
            tips: '搜索输入时调用该事件函数，参数为(search: String, event: Event)'
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
        'border',
        'opacity'
    ],
    directives: [
        {
            type: 'v-model',
            prop: 'value'
        }
        // {
        //     type: 'v-bind',
        //     prop: 'list',
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
        list: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [{
                id: 'hunan',
                name: '湖南',
                children: [
                    {
                        id: 'changsha',
                        name: '长沙'
                    },
                    {
                        id: 'yueyang',
                        name: '岳阳'
                    }
                ]
            }, {
                id: 'guangxi',
                name: '广西'
            }, {
                id: 'yunnan',
                name: '云南',
                children: [
                    {
                        id: 'kunming',
                        name: '昆明',
                        children: [
                            {
                                id: 'wuhuaqu',
                                name: '五华区'
                            },
                            {
                                id: 'guanduqu',
                                name: '官渡区'
                            },
                            {
                                id: 'xishanqu',
                                name: '西山区'
                            }
                        ]
                    },
                    {
                        id: 'dali',
                        name: '大理'
                    }
                ]
            }],
            tips: '可选项数据源'
        },
        multiple: {
            type: 'boolean',
            val: false,
            tips: '是否多选'
        },
        'scroll-height': {
            type: 'number',
            val: 216,
            tips: '下拉列表滚动高度'
        },
        'scroll-width': {
            type: 'number',
            val: 160,
            tips: '子版面的宽度'
        },
        disabled: {
            type: 'boolean',
            val: false,
            tips: '是否禁用'
        },
        clearable: {
            type: 'boolean',
            val: false,
            tips: '是否允许清空'
        },
        'check-any-level': {
            type: 'boolean',
            val: false,
            tips: '是否允许选择任意一级'
        },
        filterable: {
            type: 'boolean',
            val: false,
            tips: '是否允许快捷搜索'
        },
        'show-complete-name': {
            type: 'boolean',
            val: true,
            tips: '输入框中是否显示选中值的完整路径'
        },
        'separator': {
            type: 'string',
            val: '/',
            tips: '选项分隔符'
        },
        'trigger': {
            type: 'string',
            options: ['click', 'hover'],
            val: 'click',
            tips: '触发子菜单模式'
        }
    }
}
