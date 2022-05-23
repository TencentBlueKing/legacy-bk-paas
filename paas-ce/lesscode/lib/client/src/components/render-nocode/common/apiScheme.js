/**
 * 将scheme协议中的array类型的数据筛选出来转换为tree，使用场景：表单字段api配置返回数据时选择的数组字段
 * @param {Array} scheme 接口scheme协议
 * @returns 筛选后的tree
 */
export function transSchemeToArrayTypeTree (scheme, treeData = [], fieldPath = []) {
    if (scheme.type === 'object') {
        Object.keys(scheme.properties).forEach((key) => {
            const prop = scheme.properties[key]
            const pathKeys = fieldPath.map(item => item.key)
            pathKeys.push(key)
            const field = { key, name: key, id: pathKeys.join('.'), type: prop.type }
            if (prop.type === 'array' && prop.items) {
                const propArray = Object.keys(prop.items.properties).map(key => prop.items.properties[key])
                if (propArray.some(p => ['string', 'number', 'boolean', 'object'].includes(p.type))) {
                    const parentField = fieldPath.reduce((acc, crt) => {
                        let crtField = acc.find(fieldItem => fieldItem.id === crt.id)
                        if (!crtField) {
                            crtField = Object.assign({}, crt, { disabled: true, children: [] })
                        }
                        acc.push(crtField)
                        return crtField.children
                    }, treeData)
                    parentField.push(field)
                }
            } else if (prop.type === 'object') {
                transSchemeToArrayTypeTree(prop, treeData, [...fieldPath, field])
            }
        })
    }
    return treeData
}

// 由接口的scheme协议得到默认value
export function getSchemeDefaultValue (scheme) {
    const val = {}
    if (scheme.type === 'object') {
        Object.keys(scheme.properties).forEach((key) => {
            const prop = scheme.properties[key]
            if (prop.type === 'object') {
                val[key] = getSchemeDefaultValue(prop)
            } else if (prop.type === 'array') {
                if ('items' in prop) {
                    if ('properties' in prop.items) {
                        val[key] = [getSchemeDefaultValue(prop.items)]
                    } else {
                        val[key] = 'default' in prop.items ? prop.items.default : []
                    }
                } else {
                    val[key] = 'default' in prop ? [prop.default] : []
                }
            } else {
                val[key] = prop.default
            }
        })
    }

    return val
}

// 将接口的scheme协议转换为一维数组
export function transSchemeToList (scheme, list = [], parentId = '', level = 0) {
    if (scheme.type === 'object') {
        Object.keys(scheme.properties).forEach((key) => {
            const prop = scheme.properties[key]
            const { type, description } = prop
            const id = parentId ? `${parentId}-${key}` : key
            const required = scheme.required ? scheme.required.includes(key) : false
            const param = { id, key, parentId, type, required, description, level }
            if (prop.type === 'object' || (prop.type === 'array' && prop.items)) {
                param.extend = true
            }
            list.push(param)
            if (prop.type === 'object') {
                transSchemeToList(prop, list, id, level + 1)
            } else if (prop.type === 'array' && prop.items) {
                transSchemeToList(prop.items, list, id, level + 1)
            }
        })
    }
}
