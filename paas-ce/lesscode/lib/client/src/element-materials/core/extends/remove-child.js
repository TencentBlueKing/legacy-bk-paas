import Node from '../Node'

/**
 * @desc 删除指定节点的子节点
 * @param { Node } parentNode
 * @param { Node } childNode
 * @returns { Boolean }
 */
export default function (parentNode, childNode) {
    // layout 类型的组件节点才支持删除子元素
    if (!parentNode.layoutType) {
        return false
    }
    if (!(childNode instanceof Node)) {
        throw new Error('childNode 不是 Node 类型')
    }

    const childrens = parentNode.renderSlots.default
    let childIndex = -1
    for (let i = 0; i < childrens.length; i++) {
        if (childrens[i] === childNode) {
            childIndex = i
        }
    }
    if (childIndex > -1) {
        parentNode.renderSlots.default.splice(childIndex, 1)
    }
    return true
}
