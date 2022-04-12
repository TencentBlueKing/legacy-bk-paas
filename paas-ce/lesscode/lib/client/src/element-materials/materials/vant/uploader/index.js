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
    name: 'van-uploader',
    type: 'van-uploader',
    displayName: '文件上传',
    icon: 'bk-drag-upload',
    group: '表单',
    order: 1,
    events: [
        {
            name: 'oversize',
            tips: '文件大小超过限制时触发，事件回调参数 (file: Object, detail: Object)'
        },
        {
            name: 'click-upload',
            tips: '点击上传区域时触发，事件回调参数 (event: MouseEvent)'
        },
        {
            name: 'click-preview',
            tips: '点击预览图时触发，事件回调参数 (file: Object, detail: Object)'
        },
        {
            name: 'close-preview',
            tips: '关闭全屏图片预览时触发'
        },
        {
            name: 'delete',
            tips: '删除文件预览时触发，事件回调参数 (file: Object, detail: Object)'
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
        value: {
            type: 'array',
            val: [],
            tips: '已上传的文件列表'
        },
        accept: {
            type: 'string',
            val: 'image/*',
            tips: '允许上传的文件类型'
        },
        name: {
            type: ['string', 'number'],
            val: 'upload_file',
            tips: '标识符，可以在回调函数的第二项参数中获取'
        },
        'preview-size': {
            type: ['string', 'number'],
            val: '80px',
            tips: '预览图和上传区域的尺寸，默认单位为 px'
        },
        'preview-image': {
            type: 'boolean',
            val: true,
            tips: '是否在上传完成后展示预览图'
        }
    }
}
