
/**
 * @desc 在指定 node 后面插入一个新 node
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

    slotList.splice(index + 1, 0, childNode)

    if (parentNode.type === 'root') {
        console.log(parentNode, 677, slotList)
    }

    return true
}
