
/**
 * @desc 基于当前选中node， 粘贴copyNode
 * @param { Node } parentNode
 * @param { Node } copyNode
 * @returns { Boolean }
 */
import insertAfter from './insert-after'
// import appendChild from './append-child'

export default function (node, copyNode) {
    if (!node.type || !copyNode.type) return
    console.log(node.type, copyNode.type, 443, isContainer(node))
    if (isContainer(node) === isContainer(copyNode)) {
        insertAfter(node, copyNode)
    } else {
        console.log(3334)
    }
}

function isContainer (node) {
    return ['render-grid', 'free-layout'].indexOf(node.type) > -1
}
