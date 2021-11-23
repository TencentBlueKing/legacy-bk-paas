import Node from '../Node'

import isNode from '../is-node'

/**
 * @desc 删除指定节点的子节点
 * @param { Node } node
 * @param { Node } childNode
 * @returns { Boolean }
 */
export default function (node, childNode) {
    // layout 类型的组件节点才支持删除子元素
    if (!node.layoutType) {
        return false
    }
    if (!isNode(childNode)) {
        throw new Error('childNode 不是 Node 类型')
    }
    const slotList = node.renderSlots.default
    const childIndex = slotList.findIndex(_ => _ === childNode)
    if (childIndex > -1) {
        slotList.splice(childIndex, 1)
        return true
    }
    return false
}
