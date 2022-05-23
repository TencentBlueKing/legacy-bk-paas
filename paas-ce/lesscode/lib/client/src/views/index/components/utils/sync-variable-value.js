import LC from '@/element-materials/core'
import { VARIABLE_TYPE, VARIABLE_VALUE_TYPE } from 'shared/variable/index.js'

const getVariableValue = ({ valueType, defaultValueType, defaultValue }) => {
    if (valueType === VARIABLE_TYPE.COMPUTED.VAL) {
        return undefined
    }

    let value
    if (defaultValueType === VARIABLE_VALUE_TYPE.SAME) {
        value = defaultValue.all
    } else if (defaultValueType === VARIABLE_VALUE_TYPE.DIFFERENT) {
        value = defaultValue.stag
    }
    if ([VARIABLE_TYPE.ARRAY.VAL, VARIABLE_TYPE.OBJECT.VAL].includes(valueType)) {
        return JSON.parse(value)
    }
    return value
}

export const syncVariableValue = (data, variableList) => {
    const variableValueMap = variableList.reduce((result, item) => {
        result[item.variableCode] = getVariableValue(item)
        return result
    }, {})
    
    const traverse = (componentData) => {
        const materialConfig = LC.getMaterial(componentData.type)
        componentData.renderDirectives.forEach(directive => {
            if (directive.format === 'variable') {
                directive.renderValue = variableValueMap[directive.code] || ''
            }
        })
        Object.keys(componentData.renderProps).forEach(propKey => {
            const prop = componentData.renderProps[propKey]
            if (prop.format === 'variable') {
                prop.renderValue = variableValueMap[prop.code] || materialConfig.props[propKey].val
            }
        })
        if (LC.isLayoutType(componentData.type)) {
            // 布局类型的组件
            Object.keys(componentData.renderSlots).forEach(slotKey => {
                componentData.renderSlots[slotKey].forEach(traverse)
            })
        } else {
            Object.keys(componentData.renderSlots).forEach(slotKey => {
                const slot = componentData.renderSlots[slotKey]
                if (Object.prototype.hasOwnProperty.call(slot, 'componentId')) {
                    // slot 为布局组件
                    traverse(slot)
                } else {
                    if (slot.format === 'variable') {
                        slot.renderValue = variableValueMap[slot.code] || materialConfig.slots[slotKey].val
                    }
                }
            })
        }
    }
    data.forEach(componentData => traverse(componentData))
    return data
}
