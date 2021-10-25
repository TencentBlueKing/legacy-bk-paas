import getRoot from './get-root'
import getActiveNode from './get-active-node'
import getNodeById from './get-node-by-id'
import getNodesByType from './get-nodes-by-type'
import createNode from './create-node'
import isNode from './is-node'

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

core.getRoot = getRoot
core.getActiveNode = getActiveNode
core.getNodeById = getNodeById
core.getNodesByType = getNodesByType
core.isNode = isNode
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
