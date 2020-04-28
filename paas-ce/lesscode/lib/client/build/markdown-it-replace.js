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

/**
 * 替换 token content
 *
 * @param {Object} token token 对象
 * @param {Object} opts 外层调用传来的参数
 */
function replaceContent (token, opts) {
    const type = token.type
    if (type === 'fence' || type === 'code_block' || type === 'inline' || type === 'code_inline') {
        token.content = token.content.replace(/\{\{\s*BASE_LIB_NAME\s*\}\}/g, opts.replaceStr)
    }
    if (token.children && token.children.length) {
        token.children.forEach(child => {
            replaceContent(child, opts)
        })
    }
}

module.exports = function replace (md, opts) {
    if (!opts.replaceStr) {
        return
    }
    md.core.ruler.push('replace', state => {
        state.tokens.forEach(token => {
            replaceContent(token, opts)
        })
    })
}
