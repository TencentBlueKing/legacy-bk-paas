import LC from '../index'

/**
 * @desc 设置节点的激活状态
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node, state) {
    if (state !== undefined && typeof state !== 'boolean') {
        throw new Error(`toggleActive 的参数 ${state} 不是 Boolean 类型`)
    }
    const activeNode = LC.getActiveNode()
    if (activeNode) {
        activeNode.isActived = false
    }
    if (typeof state === 'boolean') {
        node.isActived = state
    } else {
        node.isActived = !node.isActived
    }
    return true
}
