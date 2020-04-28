/**
 * @file dom util
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

/**
 * 判断是否是虚拟 node
 *
 * @param {Object} node 待判断节点
 *
 * @return {boolean} 判断结果
 */
export function isVNode (node) {
    return node && typeof node === 'object' && node.hasOwnProperty('componentOptions')
}

/**
 * 绑定事件
 *
 * @param {Object} elem DOM 元素
 * @param {string} type 事件名称
 * @param {Function} handler 事件处理函数
 */
export function addEvent (elem, type, handler) {
    if (!elem) {
        return
    }
    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false)
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, handler)
    } else {
        elem['on' + type] = handler
    }
}

/**
 * 移除事件
 *
 * @param {Object} elem DOM 元素
 * @param {string} type 事件名称
 * @param {Function} handler 事件处理函数
 */
export function removeEvent (elem, type, handler) {
    if (!elem) {
        return
    }
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handler, false)
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, handler)
    } else {
        elem['on' + type] = null
    }
}

let cachedScrollBarSize

/**
 * 获取滚动条的宽度
 *
 * @param {boolean} fromCache 是否从缓存中获取数据
 *
 * @return {number} 滚动条宽度
 */
export function getScrollBarWidth (fromCache) {
    if (fromCache && cachedScrollBarSize !== undefined) {
        return cachedScrollBarSize
    }

    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style
    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '100px'
    outerStyle.overflowY = 'scroll'
    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
        widthScroll = outer.clientWidth
    }
    document.body.removeChild(outer)

    cachedScrollBarSize = widthContained - widthScroll
    return cachedScrollBarSize
}

export const requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    }

export const cancelAnimationFrame = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame
    || function (id) {
        window.clearTimeout(id)
    }

/**
 * 寻找子组件
 *
 * @param {Object} context 上下文
 * @param {string} componentName 要找的组件类型名称
 *
 * @return {Array} 组件集合
 */
export function findChildComponents (context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) {
            components.push(child)
        }
        const foundChilds = findChildComponents(child, componentName)
        return components.concat(foundChilds)
    }, [])
}

/**
 * 寻找父组件
 *
 * @param {Object} context 上下文
 * @param {string} componentName 要找的组件类型名称
 *
 * @return {Array} 组件集合
 */
export function findParentComponents (context, componentName) {
    const parents = []
    const parent = context.$parent
    if (parent) {
        if (parent.$options.name === componentName) {
            parents.push(parent)
        }
        return parents.concat(findParentComponents(parent, componentName))
    }
    return []
}

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
const camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter
    }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/**
 *  对元素添加样式类
 *
 *  @param {Object} el 指定的 DOM 元素
 *  @param {string} cls 类名
 */
export function hasClass (el, cls) {
    if (!el || !cls) return false
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
    if (el.classList) {
        return el.classList.contains(cls)
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
    }
}

/**
 *  对元素添加样式类
 *
 *  @param {Object} el 指定的 DOM 元素
 *  @param {string} cls 类名
 */
export function addClass (el, cls) {
    if (!el) return
    let curClass = el.className
    const classes = (cls || '').split(' ')

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i]
        if (!clsName) continue
        if (el.classList) {
            el.classList.add(clsName)
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName
        }
    }
    if (!el.classList) {
        el.className = curClass
    }
}

/**
 *  对元素删除样式类
 *
 *  @param {Object} el 指定的 DOM 元素
 *  @param {string} cls 类名
 */
export function removeClass (el, cls) {
    if (!el || !cls) return
    const classes = cls.split(' ')
    let curClass = ' ' + el.className + ' '

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i]
        if (!clsName) continue
        if (el.classList) {
            el.classList.remove(clsName)
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ')
        }
    }
    if (!el.classList) {
        el.className = trim(curClass)
    }
}

export const getStyle = Number(document.documentMode) < 9 ? function (element, styleName) {
    if (!element || !styleName) return null
    styleName = camelCase(styleName)
    if (styleName === 'float') {
        styleName = 'styleFloat'
    }
    try {
        switch (styleName) {
            case 'opacity':
                try {
                    return element.filters.item('alpha').opacity / 100
                } catch (e) {
                    return 1.0
                }
            default:
                return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null)
        }
    } catch (e) {
        return element.style[styleName]
    }
} : function (element, styleName) {
    if (!element || !styleName) return null
    styleName = camelCase(styleName)
    if (styleName === 'float') {
        styleName = 'cssFloat'
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '')
        return element.style[styleName] || computed ? computed[styleName] : null
    } catch (e) {
        return element.style[styleName]
    }
}

// scrollTop animation
export function scrollTop (el, from = 0, to, duration = 500, endCallback) {
    const difference = Math.abs(from - to)
    const step = Math.ceil(difference / duration * 50)

    function scroll (start, end, step) {
        if (start === end) {
            endCallback && endCallback()
            return
        }

        let d = (start + step > end) ? end : start + step
        if (start > end) {
            d = (start - step < end) ? end : start - step
        }

        if (el === window) {
            window.scrollTo(d, d)
        } else {
            el.scrollTop = d
        }
        window.requestAnimationFrame(() => scroll(d, end, step))
    }
    scroll(from, to, step)
}
