import LC from '../../index'

let copyNode = null

/**
 * @desc 复制节点
 * @param { Boolean } newCopy 是否重新复制节点，如果为true重新复制选中的节点并返回，false直接返回缓存的复制结果
 * @returns { Node }
 */
export const copy = (newCopy = true) => {
    if (newCopy) {
        copyNode = LC.getActiveNode()
        return copyNode
    } else {
        return copyNode
    }
}

export const paste = () => {
    const activeNode = LC.getActiveNode()
    
    if (!activeNode) {
        return
    }
    
    const newNode = copyNode.cloneNode(true)
    if (activeNode === copyNode) {
        activeNode.parentNode.insertAfert(newNode, activeNode)
    } else if (activeNode.layoutType) {
        activeNode.appendChild(newNode)
    }
}

export const cut = () => {
    const activeNode = LC.getActiveNode()
    
    if (!activeNode) {
        return
    }
    copyNode = activeNode
    activeNode.parentNode.removeChild(activeNode)
}
