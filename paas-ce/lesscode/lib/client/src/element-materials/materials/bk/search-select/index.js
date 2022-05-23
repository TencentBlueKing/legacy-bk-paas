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
    name: 'search-select',
    type: 'bk-search-select',
    displayName: '查询选择',
    icon: 'bk-drag-search',
    group: '表单',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/searchselect',
    events: [
        {
            name: 'show-menu',
            tips: '父列表显示时调用该事件函数，事件回调参数 (menuInstance: Object)'
        },
        {
            name: 'input-change',
            tips: '当用户输入时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'input-cut',
            tips: '当用户剪切内容时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'input-click',
            tips: '当用户点击input时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'input-focus',
            tips: '当单元格获取焦点时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'menu-select',
            tips: '当选择父列表项时调用该事件函数，事件回调参数 (item: Object, index: Number)'
        },
        {
            name: 'menu-child-select',
            tips: '当选择子列表项时调用该事件函数，事件回调参数 (item: Object, index: Number)'
        },
        {
            name: 'change',
            tips: '当输入内容发生变化时调用该事件函数，按下回车时调用，事件回调参数 (list: Array)'
        },
        {
            name: 'key-delete',
            tips: '当用户键入delete删除时会调用该事件函数，事件回调参数 (item: Object)'
        },
        {
            name: 'key-enter',
            tips: '当用户键入enter删除时会调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'child-checked',
            tips: '当用户选中子项时调用该事件函数，事件回调参数 (item: Object, index: Number, checked: Boolean)'
        },
        {
            name: 'clear',
            tips: '当用户点击清空时调用该事件函数，事件回调参数 (event: Event)'
        },
        {
            name: 'search',
            tips: '当用户点击搜索图标时调用该事件函数，事件回调参数 (event: Event)'
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
    renderStyles: {
        display: 'block'
    },
    directives: [
        {
            type: 'v-model',
            prop: 'values'
        }
        // {
        //     type: 'v-bind',
        //     prop: 'data',
        //     format: 'variable',
        //     valueTypeInclude: ['array']
        // }
    ],
    props: {
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                {
                    name: '实例状态',
                    id: '1',
                    multiable: true,
                    children: [
                        { name: '创建中', id: '1-2' },
                        { name: '运行中', id: '1-3' },
                        { name: '已关机', id: '1-4' }
                    ]
                },
                {
                    name: '实例业务',
                    id: '2',
                    children: [
                        { name: '王者荣耀', id: '2-1' },
                        { name: '刺激战场', id: '2-2' },
                        { name: '绝地求生', id: '2-3' }
                    ]
                },
                { name: 'IP地址', id: '3' },
                { name: '实例名', id: '4' },
                { name: '实例地址', id: '5' },
                { name: '测试六', id: '6' }
            ]
        },
        values: {
            type: 'array',
            val: [],
            tips: '选择中查询条件'
        },
        'split-code': {
            type: 'string',
            val: '|',
            tips: '查询条件分隔符'
        },
        'explain-code': {
            type: 'string',
            val: '|',
            tips: '查询条件解释符'
        },
        placeholder: {
            type: 'string',
            val: '',
            tips: '输入框空白提示'
        },
        'empty-text': {
            type: 'string',
            val: '',
            tips: '包含键值得过滤查询查询时为空的提示'
        },
        'max-height': {
            type: 'number',
            val: 120
        },
        'min-height': {
            type: 'number',
            val: 32
        },
        strink: {
            type: 'boolean',
            val: true,
            tips: '当输入条件过多超出input最小值时是否伸缩input框'
        },
        'show-delay': {
            type: 'number',
            val: 100,
            tips: '列表弹窗动画延时时间'
        },
        'display-key': {
            type: 'string',
            val: 'name',
            tips: '显示的字段名称'
        },
        'primary-key': {
            type: 'string',
            val: 'id',
            tips: '应用的唯一id字段名称'
        },
        condition: {
            type: 'object',
            val: {},
            tips: '查询条件的其他关系值'
        },
        filter: {
            type: 'boolean',
            val: false,
            tips: '是否过滤'
        },
        'show-condition': {
            type: 'boolean',
            val: true,
            tips: '是否显示条件选择 （或）'
        },
        'key-delay': {
            type: 'number',
            val: 300,
            tips: '监听输入和过滤的延时间隔'
        },
        readonly: {
            type: 'boolean',
            val: false
        },
        'wrap-zindex': {
            type: 'string',
            val: '9',
            tips: '设置组件的层级高度'
        },
        'default-focus': {
            type: 'boolean',
            val: false,
            tips: '组件初始化时是否获取焦点'
        },
        'input-type': {
            type: 'string',
            val: 'text',
            tips: '输入框类型'
        }
    }
}
