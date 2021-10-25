export const getNodeId = (data, tree) => {
    const idKey = tree.nodeOptions.idKey
    if (typeof idKey === 'function') {
        return idKey(data)
    }
    return data[idKey]
}

export const getNodeIcon = (data, tree) => {
    const icon = {
        expand: tree.expandIcon,
        collapse: tree.collapseIcon,
        node: tree.nodeIcon
    }
    if (typeof icon.node === 'function') {
        icon.node = icon.node(data)
    }
    return icon
}

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

export const convertToArray = value => {
    return Array.isArray(value) ? value : [value]
}

export const checkIsLazy = (node, tree) => {
    if (typeof tree.lazyMethod !== 'function') {
        return false
    }
    if (typeof tree.lazyDisabled === 'boolean') {
        return !tree.lazyDisabled
    } else if (typeof tree.lazyDisabled === 'function') {
        return !tree.lazyDisabled(node)
    }
    return true
}
