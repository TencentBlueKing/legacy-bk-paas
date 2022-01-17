export const findRelatedVariableFromRenderProps = renderProps => {
    return Object.keys(renderProps).reduce((variableMap, propName) => {
        const prop = renderProps[propName]
        if (prop.format === 'variable') {
            variableMap[`prop.${propName}`] = {
                source: 'prop',
                key: propName,
                code: prop.code
            }
        }
        return variableMap
    }, {})
}

export const findRelatedVariableFromRenderDirective = renderDirectives => {
    renderDirectives.reduce((variableMap, directive) => {
        if (directive.format === 'variable') {
            variableMap[`${directive.type}${directive.prop ? '.' + directive.prop : ''}`] = {
                source: directive.type,
                key: directive.prop,
                code: directive.code
            }
        }
        
        return variableMap
    }, {})
}

export const findRelatedVariableFromRenderSlot = renderSlots => {
    return Object.keys(renderSlots).reduce((variableMap, slotName) => {
        const slot = renderSlots[slotName]
        if (slot.format === 'variable') {
            variableMap[`slot.${slotName}`] = {
                source: 'slot',
                key: slotName,
                code: slot.code
            }
        }
        
        return variableMap
    }, {})
}
