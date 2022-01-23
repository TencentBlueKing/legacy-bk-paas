/**
 * 获取组件样式属性
 *
 * @param {array | Object} props 组件所有样式属性
 * @param {array} include 包含样式属性
 * @param {array} exclude 不包含样式属性
 *
 * @return {Array | Object} 样式属性
 */
export function getCssProperties (props, include, exclude) {
    let propsValue
    if (Array.isArray(props)) {
        propsValue = props
        if (include && include.length) {
            propsValue = props.filter(item => include.includes(item.key))
        }
        if (exclude) {
            propsValue = propsValue.filter(item => !exclude.includes(item.key))
        }
    } else if (typeof props === 'object') {
        propsValue = include && include.length ? {} : props
        for (const i in props) {
            if (include && include.includes(i)) {
                propsValue[i] = props[i]
            }
            if (exclude && exclude.includes(i)) {
                delete propsValue[i]
            }
        }
    }
    return propsValue
}
