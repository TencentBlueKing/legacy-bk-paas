/**
 * @desc 清除节点的激活状态
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    node.isActived = false
    return true
}
