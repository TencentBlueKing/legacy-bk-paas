import _ from 'lodash'
import { uuid } from '@/common/util'
import isNode from '../is-node'
import { createNode } from '../create-node'

const mergeData = (newNode, oldNode) => {
    newNode.tabPanelActive = oldNode.tabPanelActive
    newNode.componentId = `${oldNode.name}-${uuid()}`
    newNode.renderKey = oldNode.renderKey
    newNode.name = oldNode.name
    newNode.type = oldNode.type
    newNode.renderStyles = _.cloneDeep(oldNode.renderStyles)
    newNode.renderProps = _.cloneDeep(oldNode.renderProps)
    newNode.renderDirectives = _.cloneDeep(oldNode.renderDirectives)
    newNode.renderEvents = _.cloneDeep(oldNode.renderEvents)
    newNode.interactiveShow = false
    newNode.isInteractiveComponent = oldNode.isInteractiveComponent
    newNode.isComplexComponent = oldNode.isComplexComponent
    newNode.isCustomComponent = oldNode.isCustomComponent
    newNode.isActived = false
    newNode.attributes = {}

    if (oldNode.layoutType) {
        // 本身是布局类型组件
        newNode.renderSlots = {
            default: oldNode.renderSlots.default.map(childNode => {
                const dupNode = createNode(childNode.type)
                mergeData(dupNode, childNode)
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
    }
}

export default function (node, deep = true) {
    const dupNode = createNode(node.type)
    mergeData(dupNode, node)
    return dupNode
}
