/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import normalizeComponent from './normalize-component'
import parseSfc from './parse-component'
import hmr from './hmr'

/**
 * vue2 在线解析，并注入hmr
 * @param { source: string, id: string, updateApi: Object } ctx
 */
export default (ctx) => {
    /**
     * 更新css
     * @param {array} styles 样式列表
     */
    const updateStyle = (styles) => {
        styles.forEach((style, index) => {
            if (style.content) {
                const styleId = ctx.id + index
                ctx.updateApi.updateStyle(styleId, style.content)
            }
        })
    }

    /**
     * 解析 vue 单文件
     * @param {string} source 单文件源码
     * @returns { component, styles } vue 组件和 样式
     */
    const parseComponent = (source) => {
        const {
            styles,
            script,
            render,
            staticRenderFns
        } = parseSfc(source)
    
        // 构造 vue 组件
        const component = normalizeComponent(
            script,
            render,
            staticRenderFns
        )

        return { component, styles }
    }

    const { component, styles } = parseComponent(ctx.source)
    updateStyle(styles)

    // 组件实例挂载，方便后续热更新
    if (!hmr.isRecorded(ctx.id)) {
        hmr.createRecord(ctx.id, component.options)
    }

    // hmr
    ctx.updateApi.hotAccept(ctx.id, (payload) => {
        const { component, styles } = parseComponent(payload.source)
        ;(payload.types || []).forEach((type) => {
            switch (type) {
                case 'rerender':
                    hmr.rerender(ctx.id, component.exports)
                    break
                case 'reload':
                    hmr.reload(ctx.id, component.exports)
                    break
                case 'style':
                    updateStyle(styles)
                    break
            }
        })
    })

    ctx.result = component.exports
    ctx.styles = styles
}
