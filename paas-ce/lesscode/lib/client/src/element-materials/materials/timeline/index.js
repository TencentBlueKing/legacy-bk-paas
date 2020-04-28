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
    name: 'timeline',
    type: 'bk-timeline',
    displayName: '时间轴',
    icon: 'bk-drag-timeline',
    group: '数据',
    order: 1,
    events: ['select'],
    styles: ['margin'],
    props: {
        list: {
            type: 'array',
            val: [
                { tag: '一天前', content: '由<strong>张三</strong>上线到蓝鲸市场' },
                { tag: '16:59', content: '<div style="color: #ff5656;">由<strong>李四</strong>部署到生产环境并发布至应用市场</div>' },
                { tag: '一天前', content: '由<strong>王五</strong>部署到预发布环境' },
                { tag: '2天前', content: '<div>由<strong>王五</strong>上线到<span style="color: #3c96ff;">蓝鲸市场</span></div>' },
                { tag: '一周前', content: '由<strong>李四</strong>部署到<p style="color: #ff5656">生产环境</p>并发布至<strong>应用市场</strong>' }
            ]
        },
        'ext-cls': {
            type: 'string'
        }
    }
}
