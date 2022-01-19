import _ from 'lodash'

/**
 * @desc 设置节点的 renderEvents（全量覆盖）
 * @param { Node } node
 * @param { Object } events
 * @returns { Boolean }
 */
export default function (node, events) {
    if (Object.prototype.toString.call(events) !== '[object Object]') {
        throw new Error('设置 setRenderEvents 值只支持 Object')
    }
    node.renderEvents = _.cloneDeep(events)
    return true
}
