/**
 * @desc 设置节点 renderEvents 上指定 event 的值
 * @param { Node } node
 * @param { Object | String } params1
 * @param { String } params2
 * @returns { Boolean }
 *
 * - params1 是 Object 时 params2 无效
 * - params1 是 String 时表示属性名，params2 为对应的属性值
 *
 * ep.
 *
 * 1,
 * node.setEvent('click', {
 *  methodCode: '',
 *  params: []
 * })
 *
 * 2,
 * node.setEvent({
 *  click: {
 *    methodCode: '',
 *    params: []
 *  }
 * })
 */
export default function (node, params1, params2 = '') {
    let eventData = {}
    if (Object.prototype.toString.call(params1) === '[object String]') {
        eventData[params1] = params2
    } else {
        eventData = params1
    }
    
    Object.keys(eventData).forEach(eventName => {
        node.renderEvent[eventName] = eventData[eventName]
    })
    
    return true
}
