import Node from './Node'

import parseData from './parse-data'
import parseTemplate from './parse-template'
import getRoot from './get-root'
import getActiveNode from './get-active-node'
import getNodeById from './get-node-by-id'
import getNodesByType from './get-nodes-by-type'
import createNode from './create-node'
import { registerMaterial, unregisterMaterial } from './get-material'
import isNode from './is-node'
import isInteractiveType from './is-interactive-type'

import cloneNode from './extends/clone-node'
import appendChild from './extends/append-child'
import removeChild from './extends/remove-child'

import {
    addEventListener,
    removeEventListener,
    triggerEventListener
} from './event'

import {
    showMenu,
    clearMenu
} from './menu'

import {
    getPageStyle,
    setPageStyle
} from './page-style'

export const root = new Node({
    name: 'targetData',
    type: 'root'
})

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

// isReady 标记 api 数据加载完毕
core.isReady = false
// 数据解析 JSON -> NodeTree
core.parseData = parseData
core.parseTemplate = parseTemplate
// 扩展 material 注册
core.registerMaterial = registerMaterial
// NodeTree 操作 api
core.getRoot = getRoot
core.getActiveNode = getActiveNode
core.getNodeById = getNodeById
core.getNodesByType = getNodesByType
core.isNode = isNode
core.isInteractiveType = isInteractiveType
core.createNode = createNode
core.cloneNode = cloneNode
core.appendChild = appendChild
core.removeChild = removeChild

core.addEventListener = addEventListener
core.removeEventListener = removeEventListener
core.triggerEventListener = triggerEventListener

core.showMenu = showMenu
core.clearMenu = clearMenu

core.addEventListener('ready', () => {
    core.isReady = true
})

core.addEventListener('unload', () => {
    core.isReady = false
    // 重置 Node Tree
    parseData([])
    // 卸载时需要移除所有动态注册的 material
    unregisterMaterial()
})

Object.defineProperty(core, 'pageStyle', {
    set (value) {
        setPageStyle(value)
    },
    get () {
        return getPageStyle()
    }
})

export default core
