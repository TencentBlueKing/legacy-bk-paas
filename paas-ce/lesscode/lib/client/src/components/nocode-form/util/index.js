export function deepClone (obj) {
    if (obj === null) return null
    if (['string', 'number', 'boolean', 'undefined', 'symbol'].includes(typeof obj)) {
        return obj
    }
    const clone = Object.assign({}, obj)
    Object.keys(clone).forEach(
        key =>
            (clone[key]
            = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
    )
    if (Array.isArray(obj)) {
        clone.length = obj.length
        return Array.from(clone)
    }
    return clone
}
