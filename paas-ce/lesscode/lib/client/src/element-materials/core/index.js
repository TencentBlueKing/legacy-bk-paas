import parseData from './static/parse-data'
import parseTemplate from './static/parse-template'
import getRoot from './static/get-root'
import getMaterial, { registerMaterial, unregisterMaterial } from './static/get-material'
import getActiveNode from './static/get-active-node'
import getNodeById from './static/get-node-by-id'
import getNodesByType from './static/get-nodes-by-type'
import createNode from './static/create-node'
import reset from './static/reset'

import isNode from './static/is-node'
import isInteractiveType from './static/is-interactive-type'
import isLayoutType from './static/is-layout-type'

import cloneNode from './extends/clone-node'
import appendChild from './extends/append-child'
import removeChild from './extends/remove-child'

import {
    resetEventListener,
    addEventListener,
    removeEventListener,
    triggerEventListener
} from './event'

import {
    showMenu,
    clearMenu
} from './menu'

import { execCommand } from './helper/commands'

import {
    getPageStyle,
    setPageStyle
} from './page-style'

function core (id) {
    if (!id) {
        return getRoot()
    }
    
    const node = getNodeById(id)
    if (!node) {
        return undefined
    }
    
    return node
}

core.__isReady = false
core.__isUnloaded = false
core.__isMounted = false
// 数据解析 JSON -> NodeTree
core.parseData = parseData
core.parseTemplate = parseTemplate
// 扩展 material 注册
core.registerMaterial = registerMaterial
// NodeTree 操作 api
core.getRoot = getRoot
core.getMaterial = getMaterial
core.getActiveNode = getActiveNode
core.getNodeById = getNodeById
core.getNodesByType = getNodesByType
core.isNode = isNode
core.isInteractiveType = isInteractiveType
core.isLayoutType = isLayoutType
core.createNode = createNode
core.reset = reset
core.cloneNode = cloneNode
core.appendChild = appendChild
core.removeChild = removeChild

core.addEventListener = addEventListener
core.removeEventListener = removeEventListener
core.triggerEventListener = triggerEventListener

// 右键快捷面板
core.showMenu = showMenu
core.clearMenu = clearMenu

// 执行快捷命令
core.execCommand = execCommand

// platform: 'PC' | 'MOBILE'
core.platform = 'PC'

core._ready = () => {
    core.__isUnloaded = false
    core.__isReady = true
    triggerEventListener('ready')
}

core._unload = () => {
    if (core.__isUnloaded) {
        return
    }
    core.__isReady = false
    core.__isMounted = false
    core.__isUnloaded = true
    // 销毁画布
    reset()
    // 卸载时需要移除所有动态注册的 material
    unregisterMaterial()
    // 卸载时需要移除所有事件监听
    resetEventListener()
    triggerEventListener('unload')
}

core._mounted = () => {
    core.__isMounted = true
    triggerEventListener('mounted')
}

Object.defineProperty(core, 'pageStyle', {
    set (value) {
        setPageStyle(value)
    },
    get () {
        return getPageStyle()
    }
})

export default core
