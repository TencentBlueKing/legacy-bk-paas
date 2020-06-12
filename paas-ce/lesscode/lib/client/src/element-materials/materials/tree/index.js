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
    events: [{
        name: 'on-click', tips: '节点点击触发，回调参数为当前点击节点 node'
    }, {
        name: 'on-check', tips: '多选时，多选框 chang 触发（单选时不生效），回调参数为当前选择节点 node'
    }, {
        name: 'on-expanded', tips: '节点展开/收起触发，回调参数为操作节点'
    }, {
        name: 'on-drag-node', tips: '节点拖拽结束触发，回调参数（dragNode / targetNode）'
    }, {
        name: 'async-load-nodes', tips: '异步加载节点数据，回调参数为当前加载节点 node'
    }],
    styles: ['size', 'margin'],
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
                    id: 1
                }
            ],
            tips: 'tree 数据源'
        },
        'ext-cls': {
            type: 'string',
            tips: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM 上'
        }
    }
}
