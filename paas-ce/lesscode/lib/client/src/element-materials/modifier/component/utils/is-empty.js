export const isEmpty = value => {
    if (value === ''
        || value === null
        || value === undefined) {
        return true
    }
    if (Array.isArray(value) && value.length < 1) {
        return true
    }
    if (Object.prototype.toString.call(value) === '[object Object]'
        && Object.keys(value).length < 1) {
        return true
    }
    return false
}
