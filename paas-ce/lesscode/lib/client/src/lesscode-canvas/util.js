/**
 * Record the currently running app.name
 */
let currentMicroAppName = null
export function setCurrentAppName (appName) {
    currentMicroAppName = appName
}

// get the currently running app.name
export function getCurrentAppName () {
    return currentMicroAppName
}

// Clear appName
export function removeDomScope () {
    setCurrentAppName(null)
}

/* eslint-disable no-new-func */
export const rawWindow = new Function('return window')()
export const rawDocument = new Function('return document')()

/**
 * Add address protocol
 * @param url address
 */
export function addProtocol (url) {
    return url.startsWith('//') ? `${location.protocol}${url}` : url
}

/**
 * Create pure elements
 */
export function pureCreateElement (tagName, options) {
    const element = rawDocument.createElement(tagName, options)
    if (element.__MICRO_APP_NAME__) delete element.__MICRO_APP_NAME__
    return element
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

// Check whether the browser supports module script
export function isSupportModuleScript () {
    const s = document.createElement('script')
    return 'noModule' in s
}

// Create a random symbol string
export function createNonceStr () {
    return Math.random().toString(36).substr(2, 15)
}
