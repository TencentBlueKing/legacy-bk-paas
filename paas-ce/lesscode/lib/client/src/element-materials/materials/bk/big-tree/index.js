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
    name: 'big-tree',
    type: 'bk-big-tree',
    displayName: '大树',
    icon: 'bk-drag-bigtree',
    group: '数据',
    order: 1,
    events: [{
        name: 'select-change', tips: '选中的节点发生变化时触发，参数为TreeNode'
    }, {
        name: 'check-change', tips: '复选节点发生变化时触发 参数为(id/[id], checked)'
    }, {
        name: 'expand-change', tips: '展开/折叠节点时触发，回调参数为TreeNode'
    }, {
        name: 'disable-change', tips: '节点拖拽结束触发，回调参数（dragNode / targetNode）'
    }],
    styles: ['size', 'margin'],
    directives: [
        {
            type: 'v-bind',
            prop: 'data',
            propTypes: ['array'],
            val: '',
            valType: 'variable'
        }
    ],
    props: {
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                {
                    id: 1,
                    name: 'tree node1',
                    children: [
                        {
                            id: 11,
                            name: 'tree node11'
                        },
                        {
                            id: 12,
                            name: 'tree node12'
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'tree node2',
                    children: [
                        {
                            id: 21,
                            name: 'tree node21'
                        },
                        {
                            id: 22,
                            name: 'tree node22'
                        }
                    ]
                }
            ],
            tips: 'tree 数据源'
        },
        options: {
            type: 'object',
            val: {
                idKey: 'id',
                nameKey: 'name',
                childrenKey: 'children'
            },
            tips: '配置项'
        },
        'show-checkbox': {
            type: 'boolean',
            val: false,
            tips: '是否显示节点复选框'
        },
        'show-link-line': {
            type: 'boolean',
            val: false,
            tips: '是否显示层级连线'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
