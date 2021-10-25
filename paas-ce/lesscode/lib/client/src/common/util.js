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

import { messageSuccess } from '@/common/bkmagic'
import domToImage from './dom-to-image'
import store from '@/store'
import Vue from 'vue'

/***
 * 遍历targetData
 * parentCallBack 是遍历到grid时候的回调
 * childCallBack  是遍历到组件节点的回调
 */
export function walkGrid (children, grid, childCallBack, parentCallBack, index, columnIndex, parentGrid) {
    if (parentCallBack) parentCallBack(grid, children, index, parentGrid, columnIndex)
    const interactiveComponents = store.getters['components/interactiveComponents']
    const renderSlots = grid.renderSlots || {}
    const slots = renderSlots.default || {}
    let columns = slots.val && Array.isArray(slots.val) ? slots.val : []
    let isLayoutSupportDialog = false
    if (interactiveComponents.includes(grid.type)) { // 交互式组件特殊处理
        const slot = grid.type === 'bk-sideslider' ? (((grid.renderSlots || {}).content || {}).val || {}) : (((grid.renderSlots || {}).default || {}).val || {})
        columns = typeof slot === 'string' ? [] : (((slot.renderSlots || {}).default || {}).val || [])
        isLayoutSupportDialog = typeof slot !== 'string'
    }

    columns.forEach((column, columnIndex) => {
        const children = column.children || []
        children.forEach((component, index) => {
            const renderSlots = component.renderSlots || {}
            const slotKeys = Object.keys(renderSlots)
            if (component.type === 'render-grid' || component.type === 'free-layout' || (component.name === 'dialog' && isLayoutSupportDialog)) { // 如果是旧数据，dialog不做遍历，新dialog支持layout插槽，需要遍历
                walkGrid(children, component, childCallBack, parentCallBack, index, columnIndex, grid)
            } else if (Array.isArray(renderSlots.default && renderSlots.default.val)) {
                childCallBack(component, children, index, grid, columnIndex)
                if (renderSlots.default.val.length && renderSlots.default.val[0] && renderSlots.default.val[0].componentId) {
                    renderSlots.default.val.forEach((item, slotIndex) => {
                        walkGrid({}, item, childCallBack, childCallBack, slotIndex)
                    })
                }
            } else if (slotKeys.some(key => renderSlots[key].name === 'layout')) {
                slotKeys.forEach((key) => {
                    const slot = renderSlots[key]
                    childCallBack(component, children, index, grid, columnIndex)
                    walkGrid([], slot.val, childCallBack, parentCallBack, index, columnIndex)
                })
            } else {
                if (childCallBack) childCallBack(component, children, index, grid, columnIndex)
            }
        })

        // form-item, 没有column.children
        if (!column.children && column.componentId) {
            childCallBack(column, columns, columnIndex, grid, index)
        }
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
 * 将html转换为Vnode
 * @param {*} html html字符串
 */
export function transformHtmlToVnode (html) {
    const htmlComponent = Vue.compile(html)
    const globalComponent = global.mainComponent
    const { $options, $createElement } = globalComponent
    const _staticRenderFns = $options.staticRenderFns

    $options.staticRenderFns = htmlComponent.staticRenderFns
    const htmlVnode = htmlComponent.render.call(globalComponent, $createElement)
    $options.staticRenderFns = _staticRenderFns
    return htmlVnode
}

/**
 * 前端下载文件
 * @param {*} source 文件内容
 * @param {*} filename 文件名
 */
export function downloadFile (source, filename = 'lesscode.txt') {
    const downloadEl = document.createElement('a')
    const blob = new Blob([source])
    downloadEl.download = filename
    downloadEl.href = URL.createObjectURL(blob)
    downloadEl.style.display = 'none'
    document.body.appendChild(downloadEl)
    downloadEl.click()
    document.body.removeChild(downloadEl)
}

/**
 * 前端上传文件
 * @param {*} cb 上传成功后的回调函数
 * @param {*} accept 文件类型
 * @param {*} multiple 是否多选
 */
export function uploadFile (accept = '.json', multiple = 'multiple') {
    return new Promise((resolve, reject) => {
        const getUploadData = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    try {
                        resolve(reader.result)
                    } catch (error) {
                        reject(error)
                    }
                }
                reader.onerror = reject
                reader.readAsText(file)
            })
        }

        const uploadEl = document.createElement('input')
        uploadEl.style.display = 'none'
        uploadEl.type = 'file'
        uploadEl.multiple = multiple
        uploadEl.accept = accept
        uploadEl.onchange = (event) => {
            const files = event.target.files || []
            Promise.all(Array.from(files).map(file => getUploadData(file))).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        }
        document.body.appendChild(uploadEl)
        uploadEl.click()
        document.body.removeChild(uploadEl)
    })
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
    console.log('from get style ==== ', elem)
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
    if (typeof string !== 'string') {
        string = string.toString()
    }

    // 支持小数和负数
    const reg = /^(-?\d+(\.\d+)?)(\D*)$/
    const match = string.match(reg)
    if (!match) {
        return ''
    }
    const resultMap = {
        'value': Number(match[1]),
        'unit': match[3]
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
        if (!curNode.renderSlots.default) {
            continue
        }
        if (curNode.renderSlots.default.type === 'column' || curNode.renderSlots.default.type === 'free-layout-item') {
            if (curNode.renderSlots.default.val.length > 0) {
                for (let j = 0; j < curNode.renderSlots.default.val.length; j++) {
                    const curColumn = curNode.renderSlots.default.val[j]
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

/**
 * 精确加法
 */
export function accAdd (arg1, arg2) {
    let r1 = 0
    let r2 = 0
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const c = Math.abs(r1 - r2)
    const m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
        const cm = Math.pow(10, c)
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace('.', ''))
            arg2 = Number(arg2.toString().replace('.', '')) * cm
        } else {
            arg1 = Number(arg1.toString().replace('.', '')) * cm
            arg2 = Number(arg2.toString().replace('.', ''))
        }
    } else {
        arg1 = Number(arg1.toString().replace('.', ''))
        arg2 = Number(arg2.toString().replace('.', ''))
    }
    return (arg1 + arg2) / m
}

/**
 * 精确减法
 */
export function accSub (arg1, arg2) {
    let r1 = 0
    let r2 = 0
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    const n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export const execCopy = (value, message = '复制成功') => {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.value = value
    textarea.select()
    if (document.execCommand('copy')) {
        document.execCommand('copy')
        messageSuccess(message)
    }
    document.body.removeChild(textarea)
}

/**
 * 循环嵌套对象转Str
 * @param {*} obj 需要转换的对象
 */
export const circleJSON = obj => {
    let cache = []
    const str = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return
            }
            cache.push(value)
        }
        return value
    }, 4)
    cache = null
    return str
}

/** 树结构深度优先遍历（非递归方法） */
export const deepSearchStack = (tree, key) => {
    let stack = []
    const result = []
    stack = stack.concat(tree)
    while (stack.length > 0) {
        const node = stack.pop()
        result.push(node[key])
        if (node.children) {
            stack = stack.concat(node.children.reverse())
        }
    }
    return result
}

/**
 * 反转义 html 特殊字符
 *
 * @param {string} html 要反转义的字符串
 *
 * @return {string} 结果
 */
export const unescapeHtml = html => {
    const el = document.createElement('div')
    return html.replace(/\&[#0-9a-z]+;/gi, function (enc) {
        el.innerHTML = enc
        return el.innerText
    })
}

/**
 * 更新 canvas context
 *
 * @param {Object} ctx canvas context
 * @param {number} width canvas width
 * @param {number} height canvas height
 */
export const updateCanvasContext = function (ctx, width, height) {
    const canvas = ctx.canvas
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.imageSmoothingEnabled = true
    ctx.webkitImageSmoothingEnabled = true
    ctx.setTransform(1, 0, 0, 1, 0, 0)
}

/**
 * html to xml
 *
 * @param {string} html html
 *
 * @return {string} xml
 */
export const html2Xml = html => {
    const doc = document.implementation.createHTMLDocument('')
    doc.write(html)

    // You must manually set the xmlns if you intend to immediately serialize
    // the HTML document to a string as opposed to appending it to a
    // <foreignObject> in the DOM
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI)

    // Get well-formed markup
    html = (new XMLSerializer()).serializeToString(doc.body)
    return html
}

/**
 * node 节点转为图片（截图）
 *
 * @param {Object} domNode 要截图的 node 节点
 * @param {Function} cb 生成截图后的回调，图片加载失败时，会设置一张默认的图片
 */
export const dom2Img = (domNode, cb) => {
    domToImage.toPng(domNode).then(dataUrl => {
        cb(dataUrl)
    }).catch(err => {
        console.warn('dom to image error: ', err)
        cb(null)
    })

    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')
    // updateCanvasContext(ctx, domNode.offsetWidth, domNode.offsetHeight)

    // const PIXEL_RATIO = (() => {
    //     const ctx = document.createElement('canvas').getContext('2d')
    //     const dpr = window.devicePixelRatio || 1
    //     const bsr = (
    //         ctx.webkitBackingStorePixelRatio
    //             || ctx.mozBackingStorePixelRatio
    //             || ctx.msBackingStorePixelRatio
    //             || ctx.oBackingStorePixelRatio
    //             || ctx.backingStorePixelRatio
    //             || 1
    //     )
    //     const ratio = dpr / bsr
    //     return ratio
    // })()

    // const PIXEL_RATIO = 1

    // const width = ctx.canvas.width
    // const height = ctx.canvas.height

    // xml 没有样式，这里把当前页面的样式全部拉过来
    // const pageCssList = []
    // const styleNodeList = document.getElementsByTagName('style')
    // const styleMap = {}
    // Array.from(styleNodeList).forEach(s => {
    //     if (!styleMap[s.innerText]) {
    //         styleMap[s.innerText] = 1
    //         pageCssList.push(s.innerText)
    //     }
    // })

    // const data = 'data:image/svg+xml;charset=utf-8,'
    //     + '<svg xmlns="http://www.w3.org/2000/svg" width="1233" height="819">'
    //     + '<foreignObject x="0" y="0" width="100%" height="100%">'
    //     + '<style type="text/css">'
    //     + pageCssList.join(' ')
    //     + '</style>'
    //     + html2Xml(domNode.innerHTML)
    //     + '</foreignObject>'
    //     + '</svg>'

    // const img = new Image()
    // img.addEventListener('load', () => {
    //     cb(img)
    // })
    // img.addEventListener('error', (err) => {
    //     console.warn('dom to image error: ', err)
    //     cb(null)
    // })
    // // 有如下符号时，图片会加载失败
    // img.src = data.replace(/\:checked/g, 'checked')
    //     .replace(/"/g, "'")
    //     .replace(/%/g, '%25')
    //     .replace(/#/g, '%23')
    //     .replace(/{/g, '%7B')
    //     .replace(/}/g, '%7D')
    //     .replace(/</g, '%3C')
    //     .replace(/>/g, '%3E')
}

/**
 * 根据父节点是否是交互式组件，计算context的偏移
 * @param {*} node HTMLNode
 * @returns {x: 0, y:0}
 */
export const getContextOffset = node => {
    let isInteractiveParent = false
    let curNode = node
    while (curNode.parentNode && curNode.parentNode.className !== 'target-drag-area') {
        if (curNode.className === 'interactive-component') {
            isInteractiveParent = true
            break
        }
        curNode = curNode.parentNode
    }

    return isInteractiveParent ? {
        x: -parseInt(curNode.style.left),
        y: -parseInt(curNode.style.top)
    }
        : {
            x: 0,
            y: 0
        }
}

export const isJsKeyWord = (val) => {
    const jsKeyWords = [
        'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
        'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'implements',
        'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private', 'protected',
        'public', 'return', 'super', 'switch', 'static', 'this', 'throw', 'try', 'true', 'typeof', 'var', 'void',
        'while', 'with', 'yield', 'array', 'boolean', 'number', 'string', 'object', 'symbol', 'undefined'
    ]
    return jsKeyWords.includes((val || '').toLowerCase())
}

export const isInteractiveCompActive = () => {
    const components = document.querySelectorAll('.interactive-component')
    const target = Array.from(components).find(el => el.style.display !== 'none')
    return target !== undefined
}
