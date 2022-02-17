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
    name: 'el-tree',
    type: 'el-tree',
    displayName: '树',
    icon: 'bk-drag-tree',
    group: '数据',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/tree',
    events: [
        {
            name: 'node-click',
            tips: '节点被点击时调用该事件函数，事件回调参数 (nodeValue: Object、node: Object、component: Object)'
        },
        {
            name: 'check',
            tips: '当复选框被点击时调用该事件函数，事件回调参数 (checkValue: Object, checkNode: Object)'
        },
        {
            name: 'node-expand',
            tips: '节点被展开时调用该事件函数，事件回调参数 (nodeValue: Object、node: Object、component: Object)'
        }
    ],
    styles: ['position', 'size', 'margin', 'pointer', 'opacity'],
    directives: [
        // {
        //     type: 'v-bind',
        //     prop: 'data',
        //     propTypes: ['array'],
        //     val: '',
        //     valType: 'variable'
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
                    label: 'tree node1',
                    id: 1,
                    children: [
                        {
                            label: 'tree node 1-1',
                            id: 2
                        },
                        {
                            label: 'tree node 1-2',
                            id: 3
                        }
                    ]
                }, {
                    label: 'tree node2',
                    id: 4
                }
            ],
            tips: 'tree 数据源'
        },
        'node-key': {
            type: 'string',
            val: 'id',
            tips: '每个树节点用来作为唯一标识的属性，整棵树应该是唯一的'
        },
        'render-after-expand': {
            type: 'boolean',
            val: true,
            tips: '是否在第一次展开某个树节点后才渲染其子节点'
        },
        'highlight-current': {
            type: 'boolean',
            val: false,
            tips: '是否高亮当前选中节点，默认值是 false。'
        },
        'default-expand-all': {
            type: 'boolean',
            val: false,
            tips: '是否默认展开所有节点'
        },
        'check-on-click-node': {
            type: 'boolean',
            val: false,
            tips: '是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点'
        },
        'expand-on-click-node': {
            type: 'boolean',
            val: false,
            tips: '是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。'
        },
        'auto-expand-parent': {
            type: 'boolean',
            val: true,
            tips: '展开子节点的时候是否自动展开父节点'
        },
        'show-checkbox': {
            type: 'boolean',
            val: false,
            tips: '节点是否可被选择'
        },
        'check-strictly': {
            type: 'boolean',
            val: false,
            tips: '在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false'
        },
        'default-checked-keys': {
            type: 'array',
            val: [],
            tips: '默认勾选的节点的 key 的数组'
        },
        'current-node-key': {
            type: ['string', 'number'],
            val: '',
            tips: '当前选中的节点'
        },
        indent: {
            type: 'number',
            val: 16,
            tips: '相邻级节点间的水平缩进，单位为像素'
        },
        'icon-class': {
            type: 'icon',
            val: '',
            tips: '自定义树节点的图标'
        }
    }
}
