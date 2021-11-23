
/**
 * @desc 在指定 node 前面插入一个新 node
 * @param { Node } parentNode
 * @param { Node } childNode
 * @returns { Boolean }
 */
export default function (node, childNode) {
    const parentNode = node.parentNode
    if (!parentNode) {
        return false
    }

    const slotList = parentNode.renderSlots.default
    if (!Array.isArray(slotList)) {
        return false
    }

    const index = slotList.findIndex(_ => _ === node)
    slotList.splice(index, 0, childNode)

    return true
}
