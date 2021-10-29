import Node from './Node'

import parseData from './parse-data'
import getRoot from './get-root'
import getActiveNode from './get-active-node'
import getNodeById from './get-node-by-id'
import getNodesByType from './get-nodes-by-type'
import createNode from './create-node'
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

core.parseData = parseData
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

export default core
