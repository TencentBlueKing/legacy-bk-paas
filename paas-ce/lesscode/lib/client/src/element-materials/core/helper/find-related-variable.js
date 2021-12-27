export const findRelatedVariableFromRenderDirective = renderDirectives => {
    renderDirectives.reduce((variableMap, directive) => {
        if (directive.format === 'value') {
            return
        }
        variableMap[`${directive.type}${directive.prop ? '.' + directive.prop : ''}`] = {
            type: directive.type,
            key: directive.prop,
            code: directive.code
        }
        return variableMap
    }, {})
}

export const findRelatedVariableFromRenderSlot = renderSlots => {
    return Object.keys(renderSlots).reduce((variableMap, slotName) => {
        const slot = renderSlots[slotName]
        if (slot.format === 'value') {
            return
        }
        variableMap[`slot.${slotName}`] = {
            type: 'slot',
            key: slotName,
            code: slot.code
        }
        return variableMap
    }, {})
}
