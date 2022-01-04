/**
 * @desc 切换交互组件的显示状态
 * @param { Node } node
 * @param { Boolean } state
 * @returns { Boolean }
 */
export default function (node, state) {
    if (state !== undefined && typeof state !== 'boolean') {
        throw new Error(`toggleInteractive 的参数 ${state} 不是 Boolean 类型`)
    }
    if (!node.isInteractiveComponent) {
        return false
    }
    if (typeof state === 'boolean') {
        node.interactiveShow = state
    } else {
        node.interactiveShow = !node.interactiveShow
    }
    
    return true
}
