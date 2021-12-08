/**
 * @desc 隐藏交互组件
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    if (node.isInteractiveComponent) {
        node.interactiveShow = false
    }
    return true
}
