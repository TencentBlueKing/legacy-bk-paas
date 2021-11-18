import LC from '../index'

/**
 * @desc 设置节点的激活状态
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    const activeNode = LC.getActiveNode()
    activeNode && activeNode.activeClear()
    node.isActived = true
    return true
}
