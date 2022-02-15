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
    name: 'el-upload',
    type: 'el-upload',
    displayName: '文件上传',
    icon: 'bk-drag-upload',
    group: '表单',
    order: 1,
    document: 'https://element.eleme.cn/#/zh-CN/component/upload',
    styles: [
        'position',
        {
            name: 'size',
            include: ['display']
        },
        'margin',
        'pointer',
        'background',
        'opacity'
    ],
    props: {
        accept: {
            type: 'string',
            val: '',
            tips: '可选的文件类型，参考 input 元素的 accept 属性'
        },
        action: {
            type: 'string',
            val: 'https://jsonplaceholder.typicode.com/posts/',
            tips: '上传服务地址'
        },
        'before-upload': {
            type: 'function',
            tips: '上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。',
            val: function (file) {
            }
        },
        'on-success': {
            type: 'function',
            tips: '文件上传成功时的钩子',
            val: function (response, file, fileList) {
            }
        },
        'on-progress': {
            type: 'function',
            tips: '文件上传时的钩子',
            val: function (event, file, fileList) {
            }
        },
        // array object
        headers: {
            type: 'object',
            val: {},
            tips: '请求头 { name: " ", value: " " }'
        },
        name: {
            type: 'string',
            val: 'file',
            tips: '上传的文件字段名'
        },
        limit: {
            type: ['number'],
            val: 5,
            tips: '最大允许上传个数'
        },
        multiple: {
            type: 'boolean',
            val: true,
            tips: '是否支持多选'
        },
        data: {
            type: 'object',
            val: {},
            tips: '上传时附带的额外参数'
        },
        'with-credentials': {
            type: 'boolean',
            val: false,
            tips: '是否允许带上 cookie'
        },
        'show-file-list': {
            type: 'boolean',
            val: true,
            tips: '是否显示已上传文件列表'
        },
        drag: {
            type: 'boolean',
            val: false,
            tips: '是否启用拖拽上传'
        }
    },
    slots: {
        default: {
            name: ['html'],
            type: ['html'],
            displayName: '组件配置',
            tips: '默认插槽，值用来控制组件本身的展示',
            val: '<el-button>点击上传</el-button>'
        }
    }
}
