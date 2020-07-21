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

/***
 * 遍历targetData
 * parentCallBack 是遍历到grid时候的回调
 * childCallBack  是遍历到组件节点的回调
 */
export function walkGrid (children, grid, childCallBack, parentCallBack, index, columnIndex, parentGrid) {
    if (parentCallBack) parentCallBack(grid, children, index, parentGrid, columnIndex)
    const renderProps = grid.renderProps || {}
    const slots = renderProps.slots || {}
    const columns = slots.val || []
    columns.forEach((column, columnIndex) => {
        const children = column.children || []
        children.forEach((component, index) => {
            if (component.type === 'render-grid') {
                walkGrid(children, component, childCallBack, parentCallBack, index, columnIndex, grid)
            } else {
                if (childCallBack) childCallBack(component, children, index, grid, columnIndex)
            }
        })
    })
}

export function findComponentParentGrid (targetData, id) {
    let componentParentGrid = null
    targetData.forEach((grid, index) => {
        const callBack = (data, parent, index, parentGrid) => {
            if (data.componentId === id) componentParentGrid = parentGrid
        }
        walkGrid(targetData, grid, callBack, callBack, index)
    })
    return componentParentGrid
}

/**
 * 函数柯里化
 *
 * @example
 *     function add (a, b) {return a + b}
 *     curry(add)(1)(2)
 *
 * @param {Function} fn 要柯里化的函数
 *
 * @return {Function} 柯里化后的函数
 */
export function curry (fn) {
    const judge = (...args) => {
        return args.length === fn.length
            ? fn(...args)
            : arg => judge(...args, arg)
    }
    return judge
}

/**
 * 判断是否是对象
 *
 * @param {Object} obj 待判断的
 *
 * @return {boolean} 判断结果
 */
export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * 规范化参数
 *
 * @param {Object|string} type vuex type
 * @param {Object} payload vuex payload
 * @param {Object} options vuex options
 *
 * @return {Object} 规范化后的参数
 */
export function unifyObjectStyle (type, payload, options) {
    if (isObject(type) && type.type) {
        options = payload
        payload = type
        type = type.type
    }

    if (NODE_ENV === 'development') {
        if (typeof type !== 'string') {
            console.warn(`expects string as the type, but found ${typeof type}.`)
        }
    }

    return { type, payload, options }
}

/**
 * 以 baseColor 为基础生成随机颜色
 *
 * @param {string} baseColor 基础颜色
 * @param {number} count 随机颜色个数
 *
 * @return {Array} 颜色数组
 */
export function randomColor (baseColor, count) {
    const segments = baseColor.match(/[\da-z]{2}/g)
    // 转换成 rgb 数字
    for (let i = 0; i < segments.length; i++) {
        segments[i] = parseInt(segments[i], 16)
    }
    const ret = []
    // 生成 count 组颜色，色差 20 * Math.random
    for (let i = 0; i < count; i++) {
        ret[i] = '#'
            + Math.floor(segments[0] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16)
            + Math.floor(segments[1] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16)
            + Math.floor(segments[2] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16)
    }
    return ret
}

/**
 * min max 之间的随机整数
 *
 * @param {number} min 最小值
 * @param {number} max 最大值
 *
 * @return {number} 随机数
 */
export function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 异常处理
 *
 * @param {Object} err 错误对象
 * @param {Object} ctx 上下文对象，这里主要指当前的 Vue 组件
 */
export function catchErrorHandler (err, ctx) {
    const data = err.data
    if (data) {
        if (!data.code || data.code === 404) {
            ctx.exceptionCode = {
                code: '404',
                msg: '当前访问的页面不存在'
            }
        } else if (data.code === 403) {
            ctx.exceptionCode = {
                code: '403',
                msg: 'Sorry，您的权限不足!'
            }
        } else {
            console.error(err)
            ctx.bkMessageInstance = ctx.$bkMessage({
                theme: 'error',
                message: err.message || err.data.msg || err.statusText
            })
        }
    } else {
        console.error(err)
        ctx.bkMessageInstance = ctx.$bkMessage({
            theme: 'error',
            message: err.message || err.data.msg || err.statusText
        })
    }
}

/**
 * 获取字符串长度，中文算两个，英文算一个
 *
 * @param {string} str 字符串
 *
 * @return {number} 结果
 */
export function getStringLen (str) {
    let len = 0
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
            len += 2
        } else {
            len++
        }
    }
    return len
}

/**
 * 转义特殊字符
 *
 * @param {string} str 待转义字符串
 *
 * @return {string} 结果
 */
export const escape = str => String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')

/**
 * 对象转为 url query 字符串
 *
 * @param {*} param 要转的参数
 * @param {string} key key
 *
 * @return {string} url query 字符串
 */
export function json2Query (param, key) {
    const mappingOperator = '='
    const separator = '&'
    let paramStr = ''

    if (param instanceof String || typeof param === 'string'
        || param instanceof Number || typeof param === 'number'
        || param instanceof Boolean || typeof param === 'boolean'
    ) {
        paramStr += separator + key + mappingOperator + encodeURIComponent(param)
    } else {
        Object.keys(param).forEach(p => {
            const value = param[p]
            const k = isEmpty(key) ? p : key + (param instanceof Array ? '[' + p + ']' : '.' + p)
            paramStr += separator + json2Query(value, k)
        })
    }
    return paramStr.substr(1)
}

/**
 * 字符串转换为驼峰写法
 *
 * @param {string} str 待转换字符串
 *
 * @return {string} 转换后字符串
 */
export function camelize (str) {
    return str.replace(/-(\w)/g, (strMatch, p1) => p1.toUpperCase())
}

/**
 * 获取元素的样式
 *
 * @param {Object} elem dom 元素
 * @param {string} prop 样式属性
 *
 * @return {string} 样式值
 */
export function getStyle (elem, prop) {
    if (!elem || !prop) {
        return false
    }

    // 先获取是否有内联样式
    let value = elem.style[camelize(prop)]

    if (!value) {
        // 获取的所有计算样式
        let css = ''
        if (document.defaultView && document.defaultView.getComputedStyle) {
            css = document.defaultView.getComputedStyle(elem, null)
            value = css ? css.getPropertyValue(prop) : null
        }
    }

    return String(value)
}

/**
 *  获取元素相对于页面的高度
 *
 *  @param {Object} node 指定的 DOM 元素
 */
export function getActualTop (node) {
    let actualTop = node.offsetTop
    let current = node.offsetParent

    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }

    return actualTop
}

/**
 *  获取元素相对于页面左侧的宽度
 *
 *  @param {Object} node 指定的 DOM 元素
 */
export function getActualLeft (node) {
    let actualLeft = node.offsetLeft
    let current = node.offsetParent

    while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    return actualLeft
}

/**
 * document 总高度
 *
 * @return {number} 总高度
 */
export function getScrollHeight () {
    let scrollHeight = 0
    let bodyScrollHeight = 0
    let documentScrollHeight = 0

    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight
    }

    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight
    }

    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight

    return scrollHeight
}

/**
 * 滚动条在 y 轴上的滚动距离
 *
 * @return {number} y 轴上的滚动距离
 */
export function getScrollTop () {
    let scrollTop = 0
    let bodyScrollTop = 0
    let documentScrollTop = 0

    if (document.body) {
        bodyScrollTop = document.body.scrollTop
    }

    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop
    }

    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop

    return scrollTop
}

/**
 * 浏览器视口的高度
 *
 * @return {number} 浏览器视口的高度
 */
export function getWindowHeight () {
    const windowHeight = document.compatMode === 'CSS1Compat'
        ? document.documentElement.clientHeight
        : document.body.clientHeight

    return windowHeight
}

/**
 * 生成 uuid
 *
 * @param {Number} len 长度
 * @param {Number} radix 基数
 *
 * @return {string} uuid
 */
export function uuid (len = 8, radix = 16) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        let i
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        let i
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}

/**
 * 从当前节点开始往上查找具有 cls 类名的节点
 *
 * @param {Object} node 当前点击的元素对象
 * @param {string} cls 要判断的类名
 *
 * @return {Object} 找到的 dom 节点
 */
export function getNodeWithClass (node, cls) {
    let parent = node

    while (parent.parentNode !== document && !parent.classList.contains(cls)) {
        parent = parent.parentNode
    }

    return parent
}

/**
 * 移除 具有 nodeCls 类名的节点上的 targetCls 类名
 *
 * @param {string} rowCls 获取节点的条件的类名
 * @param {string} targetCls 要移除的类名
 */
export function removeClassWithNodeClass (nodeCls, targetCls) {
    const rowNodeList = Array.from(document.querySelectorAll(nodeCls) || [])
    rowNodeList.forEach(rowNode => {
        rowNode.classList.remove(targetCls)
    })
}

/**
 * 从样式属性 12px 种分离出 12 和 px
 *
 * splitValueAndUnit('value', '12px') ==> '12'
 * splitValueAndUnit('unit', '12px') ==> 'px'
 */
export function splitValueAndUnit (type, string) {
    if (!string) {
        return ''
    }
    const reg = /(\d*)(\D*)/
    const match = string.match(reg)
    if (!match) {
        return ''
    }
    const resultMap = {
        'value': Number(match[1]),
        'unit': match[2]
    }
    return resultMap[type]
}

export const findComponent = (target, componentId) => {
    let res = ''
    target.forEach((grid, index) => {
        const callBack = (data) => {
            if (data.componentId === componentId) res = data
        }
        walkGrid(target, grid, callBack, callBack, index)
    })
    return res
}
export const findComponentParentRow = (target, componentId) => {
    const len = target.length
    for (let i = 0; i < len; i++) {
        const curNode = target[i]
        if (curNode.componentId === componentId) {
            return target
        }
        if (!curNode.renderProps.slots) {
            continue
        }
        if (curNode.renderProps.slots.type === 'column') {
            if (curNode.renderProps.slots.val.length > 0) {
                for (let j = 0; j < curNode.renderProps.slots.val.length; j++) {
                    const curColumn = curNode.renderProps.slots.val[j]
                    const column = findComponentParentRow(curColumn.children, componentId)
                    if (column.length > 0) {
                        return column
                    }
                }
            }
        }
    }
    return []
}

/**
 * 获取的节点的前后相邻的具有某个类的节点集合
 *
 * @param {Object} node 节点
 * @param {string} cls 类名
 *
 * @return {Array} 满足条件的集合
 */
export const siblings = (node, cls) =>
    Array.from(node.parentNode.children).filter(c => c.nodeType === 1 && c.classList.contains(cls))

/**
 * 获取某个节点的具有某个类名的第一个父节点
 *
 * @param {Object} node 节点
 * @param {string} cls 类名
 *
 * @return {Object} 满足条件的父节点
 */
export function getParentByCls (node, cls) {
    for (; node && node !== document; node = node.parentNode) {
        if (node.classList.contains(cls)) {
            return node
        }
    }
    return null
}

/**
 * 校验非负单位值
 *
 * @param {string | number} val
 *
 * @return {boolean}
 */
export function validateNaturalNumber (val) {
    const reg = /^\d*(\.5)?$/
    return Boolean(String(val).match(reg))
}

/**
 * 校验单位值
 * todo 是否允许输入小数，某些非法输入如 '-5+5-99+' 从 bk-input 拿到的 val 是空字符串
 *
 * @param {string | number} val
 *
 * @return {boolean}
 */
export function validateRoundNumber (val) {
    const reg = /^-?\d*(\.5)?$/
    return Boolean(String(val).match(reg))
}

/**
 * 找不同，不同返回 true
 *
 * @param {array} arr
 *
 * @return {boolean}
 */
export function computeIsDifferent (arr) {
    const first = arr[0]
    for (const item of arr) {
        if (item !== first) {
            return true
        }
    }
    return false
}

/**
 * 返回一个 tips 内的超链接 html 字符串
 */
export function formatLink ({ content = '', href = 'https://magicbox.bk.tencent.com/components_vue/2.0/example/index.html#/icon' } = {}) {
    return `<a style="color: #72A7FF; text-decoration: underline;" target="_blank" href="${href}">${content}</a>`
}

/**
 * 给内容长于 limitStrLength tips 加默认宽度
 *
 * @param {string|object} tips
 * @param {number} width tips 设置宽度
 *
 * @return {object}
 */
export function transformTipsWidth (tips, width = 290) {
    const limitStrLength = 22

    if (isEmpty(tips)) {
        return ''
    } else if (typeof tips === 'string') {
        if (tips.length >= limitStrLength) {
            return { width, content: tips }
        }
    } else if (tips.html || (tips.content && tips.content.length >= limitStrLength)) {
        return { width, ...tips }
    }

    return tips
}

/**
 * 非空校验
 * @param {*} obj
 */
export function isEmpty (obj) {
    return obj === null || obj === '' || obj === undefined
}

export const getOffset = target => {
    let totalLeft = null
    let totalTop = null
    let par = target.offsetParent
    totalLeft += target.offsetLeft
    totalTop += target.offsetTop
    while (par) {
        if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
            // 不是IE8我们才进行累加父级参照物的边框
            totalTop += par.clientTop
            totalLeft += par.clientLeft
        }
        totalTop += par.offsetTop
        totalLeft += par.offsetLeft
        par = par.offsetParent
    }
    return { left: totalLeft, top: totalTop }
}
