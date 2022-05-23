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
    name: 'tree',
    type: 'bk-tree',
    displayName: '树',
    icon: 'bk-drag-tree',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/tree',
    events: [
        {
            name: 'on-click',
            tips: '节点点击时调用该事件函数，事件回调参数 (node: Object)'
        },
        {
            name: 'on-check',
            tips: '多选框 chang 时调用该事件函数（单选时不生效），事件回调参数 (node: Object)'
        },
        {
            name: 'on-expanded',
            tips: '节点展开/收起时调用该事件函数，事件回调参数 (node: Object, expanded: Boolean)'
        },
        {
            name: 'on-drag-node',
            tips: '节点拖拽结束时调用该事件函数，事件回调参数 (dragNode: Object, targetNode: Object)'
        },
        {
            name: 'async-load-nodes',
            tips: '异步加载节点数据时调用该事件函数，事件回调参数 (node: Object)'
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
    directives: [
        // {
        //     type: 'v-bind',
        //     prop: 'data',
        //     format: 'variable',
        //     valueTypeInclude: ['array']
        // }
    ],
    props: {
        'node-key': {
            type: 'string',
            val: 'id',
            tips: '具有唯一标识的key值'
        },
        'show-icon': {
            type: 'boolean',
            val: true,
            tips: '节点是否可配置icon'
        },
        multiple: {
            type: 'boolean',
            val: true,
            tips: '单选/多选标识'
        },
        'has-border': {
            type: 'boolean',
            val: false,
            tips: '是否显示边框'
        },
        data: {
            type: ['array', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
            },
            val: [
                {
                    name: 'tree node1',
                    title: 'tree node1',
                    expanded: true,
                    id: 1,
                    children: [
                        {
                            name: 'tree node 1-1',
                            title: 'tree node 1-1',
                            id: 2
                        },
                        {
                            name: 'tree node 1-2',
                            title: 'tree node 1-2',
                            id: 3
                        }
                    ]
                }, {
                    name: 'tree node2',
                    title: 'tree node2',
                    id: 4
                }
            ],
            tips: 'tree 数据源'
        }
    }
}
