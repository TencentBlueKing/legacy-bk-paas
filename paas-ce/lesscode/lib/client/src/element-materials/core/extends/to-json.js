import _ from 'lodash'
import isNode from '../is-node'

const getChild = slot => {
    return isNode(slot) ? slot.toJSON() : slot
}

/**
 * @desc 判断 renderProps 的配置值是否有效
 * @param { Any } value
 * @param { Any } configValue
 * @returns { Boolean }
 */
const isValidPropValue = (value, configValue) => {
    // 值为空
    if (value === ''
         || value === null
         || value === undefined) {
        return false
    }
    // prop 有配置值，但是值不为默认
    return value !== configValue
}

/**
 * @desc 判断 renderStyles 的配置时候有效
 * @param { String | Number } value
 * @returns { Boolean }
 */
const isValidStyleValue = value => {
    if (value === ''
        || value === undefined
        || value === null
        || value === 'unset'
        || value === 'initial'
        || value === 'px') {
        return false
    }
    return true
}

/**
 * @desc 获取节点的 JSON 结构
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    const {
        componentId,
        type,
        isComplexComponent,
        isCustomComponent,
        isInteractiveComponent,
        renderDirectives,
        renderEvents,
        renderProps,
        renderSlots,
        renderStyles,
        material
    } = node

    const renderSlotsJSON = Object.keys(renderSlots).reduce((result, slotName) => {
        const curSlot = renderSlots[slotName]
        if (Array.isArray(curSlot)) {
            result[slotName] = curSlot.map(data => getChild(data))
        } else {
            result[slotName] = getChild(curSlot)
        }

        return result
    }, {})

    const renderPropsJSON = Object.keys(renderProps).reduce((result, propName) => {
        const curProp = renderProps[propName]
        // prop 为 remote 类型，或者 prop 的值等于默认值时在 JSON 结构中过滤掉
        if (curProp.type === 'remote'
            || isValidPropValue(curProp.val, material.props[propName] && material.props[propName].val)) {
            result[propName] = {
                type: curProp.type,
                val: curProp.val
            }
        }
        return result
    }, {})
    
    const renderStylesJSON = Object.keys(renderStyles).reduce((result, styleName) => {
        if (isValidStyleValue(renderStyles[styleName])) {
            result[styleName] = renderStyles[styleName]
        }
        return result
    }, {})

    return _.cloneDeep({
        id: componentId,
        type,
        isComplex: isComplexComponent,
        isCustom: isCustomComponent,
        isInteractive: isInteractiveComponent,
        directive: renderDirectives,
        event: renderEvents,
        prop: renderPropsJSON,
        slot: renderSlotsJSON,
        style: renderStylesJSON
    })
}
