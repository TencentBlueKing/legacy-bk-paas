
/**
 * @desc 在指定 referenceNode 后面插入一个新 newNode
 * @param { Node } node
 * @param { Node } newNode
 * @param { Node } referenceNode
 * @returns { Boolean }
 */
export default function (node, newNode, referenceNode) {
    if (newNode.parentNode) {
        newNode.parentNode.removeChild(newNode)
    }
    const slotList = node.renderSlots.default
    
    if (!Array.isArray(slotList)) {
        return false
    }

    const index = slotList.findIndex(_ => _ === referenceNode)

    // 如果 referenceNode 不存在 newNode 将被插入到子节点的末尾
    if (index < 0) {
        slotList.push(newNode)
        return true
    }

    slotList.splice(index + 1, 0, newNode)

    return true
}
