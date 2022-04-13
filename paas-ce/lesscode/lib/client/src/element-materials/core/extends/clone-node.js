import _ from 'lodash'
import isNode from '../is-node'
import { createNode } from '../create-node'

const mergeData = (newNode, oldNode, deep) => {
    newNode.renderStyles = _.cloneDeep(oldNode.renderStyles)
    newNode.renderProps = _.cloneDeep(oldNode.renderProps)
    newNode.renderDirectives = _.cloneDeep(oldNode.renderDirectives)
    newNode.renderEvents = _.cloneDeep(oldNode.renderEvents)
    newNode.isInteractiveComponent = oldNode.isInteractiveComponent
    newNode.isComplexComponent = oldNode.isComplexComponent
    newNode.isCustomComponent = oldNode.isCustomComponent

    // 深度克隆，处理层级
    if (deep) {
        if (oldNode.layoutType) {
            // 本身是布局类型组件
            newNode.renderSlots = {
                default: oldNode.renderSlots.default.map(childNode => {
                    const dupNode = createNode(childNode.type)
                    mergeData(dupNode, childNode, deep)
                    return dupNode
                })
            }
        } else if (oldNode.layoutSlot) {
            // 组件的 slot 是布局类型组件
            newNode.renderSlots = Object.keys(oldNode.renderSlots).reduce((renderSlots, slotName) => {
                const curSlot = oldNode.renderSlots[slotName]
                if (isNode(curSlot)) {
                    const dupNode = createNode(curSlot.type)
                    mergeData(dupNode, curSlot)
                    renderSlots[slotName] = dupNode
                } else {
                    renderSlots[slotName] = _.cloneDeep(curSlot)
                }
                return renderSlots
            }, {})
        } else {
            newNode.renderSlots = _.cloneDeep(oldNode.renderSlots)
        }
    }
}

/**
 * @desc 克隆节点
 * @param { Node } node
 * @param { Boolean } deep 是否采用深度克隆,如果为true,则该节点的所有后代节点也都会被克隆,如果为false,则只克隆该节点本身
 * @returns { Node }
 */
export default function (node, deep = true) {
    if (!isNode(node)) {
        throw new Error('node 不是 Node 类型')
    }
    const dupNode = createNode(node.type)
    mergeData(dupNode, node, deep)
    return dupNode
}
