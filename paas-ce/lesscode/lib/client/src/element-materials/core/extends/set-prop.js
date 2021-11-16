/**
 * @desc 设置节点 renderProps 上指定 prop 的值
 * @param { Node } node
 * @param { Object | String } params1
 * @param { String } params2
 * @returns { Boolean }
 *
 * - params1 是 Object 时 params2 无效
 * - params1 是 String 时表示属性名，params2 为对应的属性值
 */
export default function (node, params1, params2 = '') {
    let tempProp = {}
    if (Object.prototype.toString.call(params1) === '[object String]') {
        tempProp[params1] = params2
    } else {
        tempProp = params1
    }
    const materialProps = node.material.props
    Object.keys(tempProp).forEach(propName => {
        if (materialProps.hasOwnProperty(propName)) {
            node.renderProps[propName] = {
                val: tempProp[propName],
                type: materialProps[propName].type
            }
        }
    })
    
    return true
}
