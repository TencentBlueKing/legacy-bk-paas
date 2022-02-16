import Node from '../Node'

export default function (node) {
    return Object.keys(node.renderSlots).reduce((result, key) => {
        const renderSlot = node.renderSlots[key]
        const slots = Array.isArray(renderSlot) ? renderSlot : [renderSlot]
        slots.forEach(slotItem => {
            if (slotItem instanceof Node) {
                result.push(slotItem)
            }
        })
        return result
    }, [])
}
