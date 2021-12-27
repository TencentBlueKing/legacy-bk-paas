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
    let propData = {}
    if (Object.prototype.toString.call(params1) === '[object String]') {
        propData[params1] = params2
    } else {
        propData = params1
    }
    const materialProps = node.material.props
    Object.keys(propData).forEach(propName => {
        if (materialProps.hasOwnProperty(propName)) {
            node.renderProps[propName] = {
                format: 'value',
                code: propData[propName],
                valueType: materialProps[propName].type,
                renderValue: propData[propName],
                payload: {}
            }
        }
    })
    
    return true
}
