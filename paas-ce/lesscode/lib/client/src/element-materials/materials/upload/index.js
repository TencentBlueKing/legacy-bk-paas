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
    name: 'upload',
    type: 'bk-upload',
    displayName: '文件上传',
    icon: 'bk-drag-upload',
    group: '表单',
    order: 1,
    events: ['on-done', 'on-progress', 'on-success', 'on-error'],
    styles: ['size', 'margin'],
    props: {
        accept: {
            type: 'string',
            val: '*'
        },
        url: {
            type: 'string',
            val: 'https://jsonplaceholder.typicode.com/posts/'
        },
        // array object
        header: {
            type: 'string'
        },
        name: {
            type: 'string',
            val: 'upload_file'
        },
        // Number, Object 限制上传文件体积 { maxFileSize: 1, maxImgSize: 1 }
        size: {
            type: 'number',
            val: 5
        },
        tip: {
            type: 'string'
        },
        'delay-time': {
            type: 'number',
            val: 0
        },
        multiple: {
            type: 'boolean',
            val: true
        },
        'with-credentials': {
            type: 'boolean',
            val: false
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
