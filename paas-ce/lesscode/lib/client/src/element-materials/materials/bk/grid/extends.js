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

export default function (children) {
    const base = {
        name: 'grid',
        type: 'render-grid',
        displayName: 'grid',
        group: '布局',
        styles: ['size', 'margin', 'padding', 'backgroundColor'],
        props: {
            gutter: {
                type: 'number',
                val: 0,
                tips: '每列栅格之间的间距'
            },
            'margin-horizontal': {
                type: 'number',
                val: 0
            },
            'margin-vertical': {
                type: 'number',
                val: 0
            }
        },
        slots: {
            default: {
                type: ['column'],
                displayName: '列配置',
                tips: '每一列栅格宽度占比为该列配置值占总列配置值的百分比，建议总列配置值为 12 或 24',
                val: [
                    { span: 1, children: [] },
                    { span: 1, children: [] }
                ]
            }
        }
    }
    const props = Object.assign({}, base.props, children.props)
    const slots = { default: Object.assign({}, base.slots.default, children.slots.default) }

    const newObject = Object.assign({}, base, children)
    newObject.slots = slots
    newObject.props = props

    return newObject
}
