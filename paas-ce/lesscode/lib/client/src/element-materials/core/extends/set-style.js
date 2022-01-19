/**
 * @desc 设置节点 renderStyles 上指定样式名的值
 * @param { Node } node
 * @param { Object | String } params1
 * @param { String } params2
 * @returns { Boolean }
 *
 * - params1 是 Object 时 params2 无效
 * - params1 是 String 时表示属性名，params2 为对应的属性值
 */
export default function (node, params1, params2 = '') {
    if (Object.prototype.toString.call(params1) === '[object Object]') {
        Object.keys(params1).forEach(styleName => {
            node.renderStyles[styleName] = params1[styleName]
        })
    } else if (Object.prototype.toString.call(params1) === '[object String]') {
        node.renderStyles[params1] = params2
    }
    return true
}
