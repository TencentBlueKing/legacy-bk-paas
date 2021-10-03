/**
 * Add address protocol
 * @param url address
 */
export function addProtocol (url) {
    return url.startsWith('//') ? `${location.protocol}${url}` : url
}

/**
 * Get valid address, such as https://xxx/xx/xx.html to https://xxx/xx/
 * @param url app.url
 */
export function getEffectivePath (url) {
    const { origin, pathname } = new URL(url)
    if (/\.(\w+)$/.test(pathname)) {
        const fullPath = `${origin}${pathname}`
        const pathArr = fullPath.split('/')
        pathArr.pop()
        return pathArr.join('/') + '/'
    }

    return `${origin}${pathname}/`.replace(/\/\/$/, '/')
}

/**
* Complete address
* @param path address
* @param baseURI base url(app.url)
*/
export function completionPath (path, baseURI) {
    if (/^((((ht|f)tps?)|file):)?\/\//.test(path) || /^(data|blob):/.test(path)) return path

    return new URL(path, getEffectivePath(addProtocol(baseURI))).toString()
}

/**
 * async execution
 * @param fn callback
 * @param args params
 */
export function defer (fn, ...args) {
    Promise.resolve().then(fn.bind(null, ...args))
}

export function isFunction (target) {
    return typeof target === 'function'
}

// Array deduplication
export function unique (array) {
    return array.filter(function (item) {
        return item in this ? false : (this[item] = true)
    }, Object.create(null))
}
