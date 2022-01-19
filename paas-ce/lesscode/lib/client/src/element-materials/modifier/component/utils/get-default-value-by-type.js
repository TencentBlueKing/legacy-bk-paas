export const getDefaultValueByType = (() => {
    const typeValueMap = {
        'string': '',
        'array': [],
        'object': {},
        'boolean': false,
        'number': 0,
        'json': {}
    }
    return type => {
        if (typeValueMap.hasOwnProperty(type)) {
            return typeValueMap[type]
        }
        return ''
    }
})()
