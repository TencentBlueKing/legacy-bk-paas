import _ from 'lodash'

/**
 * @desc 设置节点的 renderEvents（增量添加）
 * @param { Node } node
 * @param { Object } events
 * @returns { Boolean }
 */
export default function (node, events) {
    const isObject = (val) => {
        return Object.prototype.toString.call(val) === '[object Object]'
    }
    if (!isObject(events)) {
        throw new Error('设置 mergeRenderEvents 值只支持 Object')
    }
    const customizer = (a, b) => {
        if (isObject(a) && isObject(b)) {
            return _.mergeWith(a, b, customizer)
        } else {
            return b
        }
    }
    node.renderEvents = _.mergeWith(node.renderEvents, events, customizer)
    return true
}
