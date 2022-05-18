export const findRelatedMethodFromRenderProps = (renderProps) => {
    const methodMap = {}
    // prop 设置为 remote 类型时会使用 method
    Object.keys(renderProps).forEach(propName => {
        const prop = renderProps[propName]

        // prop 的format 配置为 value 并且 valueType 为 remote 表示选择的是远程函数
        if (prop.format === 'value' && prop.valueType === 'remote') {
            if (prop.payload && prop.payload.methodCode) {
                methodMap[`prop.${propName}`] = {
                    source: 'prop',
                    key: propName,
                    code: `${prop.payload.methodCode}`
                }
            }
        }
    })
    // form 组件需要额外检测 rules 的自定义验证规则
    if (renderProps.hasOwnProperty('rules')) {
        const formRuleMap = renderProps.rules.code || {}
        Object.keys(formRuleMap).forEach(propertyName => {
            const propertyRuleList = formRuleMap[propertyName] || []
            
            propertyRuleList.forEach((rule, index) => {
                if (rule.type && rule.validator) {
                    const suffix = index < 1 ? '' : `_${index}`
                    methodMap[`prop.rules.${propertyName}${suffix}`] = {
                        source: 'prop',
                        key: `rules.${propertyName}`,
                        code: `${rule.validator}`
                    }
                }
            })
        })
    }
    return methodMap
}

export const findRelatedMethodFromRenderSlot = (renderSlots) => {
    const methodMap = {}
    Object.keys(renderSlots).forEach(slotName => {
        const slot = renderSlots[slotName]
        const formatSlot = Array.isArray(slot) ? slot : [slot]
        formatSlot.forEach((slot) => {
            // slot 的format 配置为 value 并且 valueType 为 remote 表示选择的是远程函数
            if (slot.format === 'value' && slot.valueType === 'remote') {
                if (slot.payload
                && slot.payload.methodData
                && slot.payload.methodData.methodCode) {
                    methodMap[`slot.${slotName}`] = {
                        source: 'slot',
                        key: slotName,
                        code: `${slot.payload.methodData.methodCode}`
                    }
                }
            }
        })
    })
    return methodMap
}

export const findRelatedMethodFromRenderEvent = renderEvents => {
    const methodMap = {}
    Object.keys(renderEvents).forEach(eventName => {
        if (renderEvents[eventName].methodCode) {
            methodMap[`event.${eventName}`] = {
                source: 'event',
                key: eventName,
                code: `${renderEvents[eventName].methodCode}`
            }
        }
    })
    return methodMap
}
