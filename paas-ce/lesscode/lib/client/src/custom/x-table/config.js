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
    name: 'x-table',
    type: 'x-table',
    displayName: 'x-table',
    styles: ['size', 'padding', 'margin', 'font', 'backgroundColor'],
    props: {
        'get-table-list-ajax-url': {
            type: 'string',
            val: '',
            tips: '获取表格数据的异步地址'
        },
        'post-edit-table-list-ajax-url': {
            type: 'string',
            val: '',
            tips: '新建数据异步地址'
        },
        'del-table-list-ajax-url': {
            type: 'string',
            val: '',
            tips: '删除表格中某条数据的异步地址'
        }
    }
}
