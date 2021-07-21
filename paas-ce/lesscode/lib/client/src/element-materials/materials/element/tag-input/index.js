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
    name: 'el-tag',
    type: 'el-tag',
    displayName: '标签',
    icon: 'bk-drag-tag',
    group: '数据',
    order: 1,
    events: [{
        name: 'click', tips: '点击 Tag 时触发的事件'
    }, {
        name: 'close', tips: '关闭 Tag 时触发的事件'
    }],
    styles: ['size', 'margin', 'display'],
    props: {
        type: {
            type: 'string',
            options: ['success', 'info', 'warning', 'danger'],
            val: '',
            tips: '类型'
        },
        closable: {
            type: 'boolean',
            val: false,
            tips: '是否可关闭'
        },
        'disabled-transitions': {
            type: 'boolean',
            val: false,
            tips: '是否禁用渐变动画'
        },
        hit: {
            type: 'boolean',
            val: false,
            tips: '是否有边框描边'
        },
        color: {
            type: 'string',
            val: '',
            tips: '背景色'
        },
        size: {
            type: 'string',
            options: ['medium', 'small', 'mini'],
            val: '',
            tips: '尺寸'
        },
        effect: {
            type: 'string',
            options: ['dark ', 'light', 'plain'],
            val: 'light',
            tips: '主题'
        }
    },
    slots: {
        default: {
            name: ['text'],
            type: ['text'],
            val: '文字标记'
        }
    }
}
