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

// Css map
const sheetsMap = new Map()

/**
 * 热更新 style
 * @param {string | number} id style 唯一 id
 * @param {string} content style 内容
 */
export const updateStyle = (id, content) => {
    let style = sheetsMap.get(id)
    if (style && !(style instanceof HTMLStyleElement)) {
        removeStyle(id)
        style = undefined
    }
    if (!style) {
        style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.innerHTML = content
        document.head.appendChild(style)
    } else {
        style.innerHTML = content
    }
    sheetsMap.set(id, style)
}

/**
 * 删除 style
 * @param {string | number} id style 唯一 id
 */
export const removeStyle = (id) => {
    const style = sheetsMap.get(id)
    if (style) {
        if (style instanceof CSSStyleSheet) {
            document.adoptedStyleSheets.indexOf(style)
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== style)
        } else {
            document.head.removeChild(style)
        }
        sheetsMap.delete(id)
    }
}

// 热更新模块 map
const hotCallbacksMap = new Map()

/**
 * 用于插件注册热更新方法
 * @param {*} callback 变更将执行的回调，用于 js，html 热更新
 */
export const hotAccept = (id, callback) => {
    const hotCallbacks = hotCallbacksMap.get(id) || []
    hotCallbacks.push(callback)
    hotCallbacksMap.set(id, hotCallbacks)
}

/**
 * 触发热更新，也可以由使用方主动调用，具体的更新渲染逻辑交给插件完成
 */
export const triggleUpdate = (payload) => {
    const hotCallbacks = hotCallbacksMap.get(payload.id) || []
    hotCallbacks.forEach((hotCallback) => {
        hotCallback(payload)
    })
}

/**
 * 监听storage事件，使用方可以直接通过 localstorage 来触发热更新
 * 写入的数据格式如下：{ id: 该模块唯一id, source：源码, type: 'rerender' | 'reload' | 'style' }
 */
window.addEventListener('storage', (event) => {
    try {
        if (event.key === 'ONLINE_PREVIEW') {
            const payload = JSON.parse(event.newValue)
            triggleUpdate(payload)
        }
    } catch (error) {
        console.error(`热更新失败：${error.message || error}`)
    }
})
