
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

export default function normalizeComponent (
    scriptExports,
    render,
    staticRenderFns,
    functionalTemplate,
    injectStyles,
    scopeId,
    moduleIdentifier, /* server only */
    shadowMode /* vue-cli only */
) {
    // Vue.extend constructor export interop
    const options = typeof scriptExports === 'function'
        ? scriptExports.options
        : scriptExports

    // render functions
    if (render) {
        options.render = render
        options.staticRenderFns = staticRenderFns
        options._compiled = true
    }

    // functional template
    if (functionalTemplate) {
        options.functional = true
    }

    // scopedId
    if (scopeId) {
        options._scopeId = 'data-v-' + scopeId
    }

    let hook
    if (injectStyles) {
        hook = shadowMode
            ? function () {
                injectStyles.call(
                    this,
                    (options.functional ? this.parent : this).$root.$options.shadowRoot
                )
            }
            : injectStyles
    }

    if (hook) {
        if (options.functional) {
            // for template-only hot-reload because in that case the render fn doesn't
            // go through the normalizer
            options._injectStyles = hook
            // register for functional component in vue file
            const originalRender = options.render
            options.render = function renderWithStyleInjection (h, context) {
                hook.call(context)
                return originalRender(h, context)
            }
        } else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate
            options.beforeCreate = existing
                ? [].concat(existing, hook)
                : [hook]
        }
    }

    return {
        exports: scriptExports,
        options: options
    }
}
