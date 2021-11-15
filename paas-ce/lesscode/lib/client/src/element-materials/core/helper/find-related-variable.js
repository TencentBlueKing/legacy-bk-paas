export const findRelatedVariableFromRenderDirective = renderDirectives => {
    const variableMap = {}
    renderDirectives.forEach(directive => {
        variableMap[`${directive.type}:${directive.prop}`] = {
            type: 'v-bind',
            prop: directive.prop,
            val: directive.val
        }
    })
    return variableMap
}

export const findRelatedVariableFromRenderSlot = renderSlots => {
    const variableMap = {}
    Object.keys(renderSlots).forEach(slotName => {
        const slot = renderSlots[slotName]
        if (slot.payload && slot.payload.variableData) {
            variableMap[`slot:${slotName}`] = {
                type: 'slots',
                slot: slotName,
                val: slot.payload.variableData.val
            }
        }
    })
    return variableMap
}
