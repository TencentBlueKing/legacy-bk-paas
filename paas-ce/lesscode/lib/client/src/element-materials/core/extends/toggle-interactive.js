/**
 * @desc 切换交互组件的显示状态
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    node.interactiveShow = !node.interactiveShow
    return true
}
