export const findRelatedMethodFromRenderProps = (renderProps) => {
    const methodMap = {}
    // prop 设置为 remote 类型时会使用 method
    Object.keys(renderProps).forEach(propName => {
        const prop = renderProps[propName]
        if (prop.type === 'remote') {
            if (prop.payload
                && prop.payload.methodData
                && prop.payload.methodData.methodCode) {
                methodMap[prop.payload.methodData.methodCode] = true
            }
        }
    })
    // form 组件需要额外检测 rules 的自定义验证规则
    if (renderProps.hasOwnProperty('rules')) {
        const formRuleMap = renderProps.rules.val || {}
        Object.keys(formRuleMap).forEach(propertyName => {
            const propertyRuleList = formRuleMap[propertyName] || []
            propertyRuleList.forEach(rule => {
                if (rule.type && rule.validator) {
                    methodMap[rule.validator] = true
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
        if (slot.type === 'remote') {
            if (slot.payload
                && slot.payload.methodData
                && slot.payload.methodData.methodCode) {
                methodMap[slot.payload.methodData.methodCode] = true
            }
        }
    })
    return methodMap
}

export const findRelatedMethodFromRenderEvent = renderEvents => {
    const methodMap = {}
    Object.keys(renderEvents).forEach(eventName => {
        if (renderEvents[eventName].methodCode) {
            methodMap[renderEvents[eventName].methodCode] = true
        }
    })
    return methodMap
}
