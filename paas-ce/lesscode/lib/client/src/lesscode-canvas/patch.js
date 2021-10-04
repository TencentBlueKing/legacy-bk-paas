import { instanceMap } from './app'
import request from './request'
import {
    getCurrentAppName, completionPath, defer, rawDocument,
    pureCreateElement, isSupportModuleScript, createNonceStr
} from './util'
import scopedCSS from './scopedcss'
import {
    dispatchOnLoadEvent,
    dispatchOnErrorEvent
} from './load-event'
import { runScript, runDynamicScript } from './scripts'

// Global links, reuse across apps
export const globalLinks = new Map()

// save raw methods
const rawSetAttribute = Element.prototype.setAttribute
const rawAppendChild = Node.prototype.appendChild
const rawInsertBefore = Node.prototype.insertBefore
const rawReplaceChild = Node.prototype.replaceChild
const rawRemoveChild = Node.prototype.removeChild
const rawAppend = Element.prototype.append
const rawPrepend = Element.prototype.prepend

const rawCreateElement = Document.prototype.createElement
const rawCreateElementNS = Document.prototype.createElementNS
const rawCreateDocumentFragment = Document.prototype.createDocumentFragment
const rawQuerySelector = Document.prototype.querySelector
const rawQuerySelectorAll = Document.prototype.querySelectorAll
const rawGetElementById = Document.prototype.getElementById
const rawGetElementsByClassName = Document.prototype.getElementsByClassName
const rawGetElementsByTagName = Document.prototype.getElementsByTagName
const rawGetElementsByName = Document.prototype.getElementsByName

/**
 * Mark the newly created element in the micro application
 * @param element new element
 */
function markElement (element) {
    const appName = getCurrentAppName()
    if (appName) {
        element.__MICRO_APP_NAME__ = appName
    }
    return element
}

// methods of document
function patchDocument () {
    // create element 👇
    Document.prototype.createElement = function createElement (tagName, options) {
        const element = rawCreateElement.call(rawDocument, tagName, options)
        return markElement(element)
    }
    Document.prototype.createElementNS = function createElementNS (namespaceURI, name, options) {
        const element = rawCreateElementNS.call(rawDocument, namespaceURI, name, options)
        return markElement(element)
    }
    Document.prototype.createDocumentFragment = function createDocumentFragment () {
        const element = rawCreateDocumentFragment.call(rawDocument)
        return markElement(element)
    }
    // query element👇
    function querySelector (selectors) {
        const appName = getCurrentAppName()
        if (!appName || selectors === 'head' || selectors === 'body' || selectors === 'html') {
            return rawQuerySelector.call(rawDocument, selectors)
        }
        return (
            instanceMap.get(appName)
                && instanceMap.get(appName).container
                && instanceMap.get(appName).container.querySelector(selectors)
        ) || null
    }

    function querySelectorAll (selectors) {
        const appName = getCurrentAppName()
        if (!appName || selectors === 'head' || selectors === 'body' || selectors === 'html') {
            return rawQuerySelectorAll.call(rawDocument, selectors)
        }
        return (
            instanceMap.get(appName)
                && instanceMap.get(appName).container
                && instanceMap.get(appName).container.querySelectorAll(selectors)
        ) || []
    }

    Document.prototype.querySelector = querySelector
    Document.prototype.querySelectorAll = querySelectorAll
    // querySelector does not support the beginning of a number
    Document.prototype.getElementById = function getElementById (key) {
        const appName = getCurrentAppName()
        if (!appName || /^\d/.test(key)) {
            return rawGetElementById.call(rawDocument, key)
        }
        return querySelector(`#${key}`)
    }
    Document.prototype.getElementsByClassName = function getElementsByClassName (key) {
        const appName = getCurrentAppName()
        if (!appName || /^\d/.test(key)) {
            return rawGetElementsByClassName.call(rawDocument, key)
        }
        return querySelectorAll(`.${key}`)
    }
    Document.prototype.getElementsByTagName = function getElementsByTagName (key) {
        let _a
        const appName = getCurrentAppName()
        if (!appName
            || /^body$/i.test(key)
            || /^head$/i.test(key)
            || /^html$/i.test(key)
            || (!((_a = instanceMap.get(appName)) === null || _a === void 0 ? void 0 : _a.inline) && /^script$/i.test(key))) {
            return rawGetElementsByTagName.call(rawDocument, key)
        }
        return querySelectorAll(key)
    }
    Document.prototype.getElementsByName = function getElementsByName (key) {
        const appName = getCurrentAppName()
        if (!appName || /^\d/.test(key)) {
            return rawGetElementsByName.call(rawDocument, key)
        }
        return querySelectorAll(`[name=${key}]`)
    }
}

/**
 * Extract link elements
 * @param link link element
 * @param parent parent element of link
 * @param app app
 * @param microAppHead #lesscode-canvas-header element
 * @param isDynamic dynamic insert
 */
function extractLinkFromHtml (link, parent, app, microAppHead, isDynamic = false) {
    const rel = link.getAttribute('rel')
    let href = link.getAttribute('href')
    let replaceComment = null
    if (rel === 'stylesheet' && href) {
        href = completionPath(href, app.url)
        if (!isDynamic) {
            replaceComment = document.createComment(`the link with href=${href} move to #lesscode-canvas-header as style element`)
            const placeholderComment = document.createComment(`placeholder for link with href=${href}`)
            // all style elements insert into microAppHead
            microAppHead.appendChild(placeholderComment)
            app.source.links.set(href, {
                code: '',
                placeholder: placeholderComment,
                isGlobal: link.hasAttribute('global')
            })
        } else {
            return {
                url: href,
                info: {
                    code: '',
                    isGlobal: link.hasAttribute('global')
                }
            }
        }
    } else if (href) {
    // preload prefetch modulepreload icon ....
        link.setAttribute('href', completionPath(href, app.url))
    }

    if (isDynamic) {
        return { replaceComment }
    } else if (replaceComment) {
        return parent.replaceChild(replaceComment, link)
    }
}

/**
 * get css from dynamic link
 * @param url link address
 * @param info info
 * @param app app
 * @param originLink origin link element
 * @param replaceStyle style element which replaced origin link
 */
function foramtDynamicLink (url, info, app, originLink, replaceStyle) {
    if (app.source.links.has(url)) {
        replaceStyle.textContent = app.source.links.get(url).code
        scopedCSS(replaceStyle, app.name)
        defer(() => dispatchOnLoadEvent(originLink))
        return
    }

    if (globalLinks.has(url)) {
        const code = globalLinks.get(url)
        info.code = code
        app.source.links.set(url, info)
        replaceStyle.textContent = code
        scopedCSS(replaceStyle, app.name)
        defer(() => dispatchOnLoadEvent(originLink))
        return
    }

    request(url, app.name).then((data) => {
        info.code = data
        app.source.links.set(url, info)
        if (info.isGlobal) globalLinks.set(url, data)
        replaceStyle.textContent = data
        scopedCSS(replaceStyle, app.name)
        dispatchOnLoadEvent(originLink)
    }).catch((err) => {
        console.error(err)
        dispatchOnErrorEvent(originLink)
    })
}

const supportModuleScript = isSupportModuleScript()

/**
 * Extract script elements
 * @param script script element
 * @param parent parent element of script
 * @param app app
 * @param isDynamic dynamic insert
 */
function extractScriptElement (script, parent, app, isDynamic = false) {
    let replaceComment = null
    let src = script.getAttribute('src')
    if (script.hasAttribute('exclude')) {
        replaceComment = document.createComment('script element with exclude attribute ignored by micro-app')
    } else if (script.type && !['text/javascript', 'text/ecmascript', 'application/javascript', 'application/ecmascript', 'module'].includes(script.type)) {
        return null
    } else if ((supportModuleScript && script.noModule) || (!supportModuleScript && script.type === 'module')) {
        replaceComment = document.createComment(`${script.noModule ? 'noModule' : 'module'} script ignored by micro-app`)
    } else if (src) { // remote script
        src = completionPath(src, app.url)
        const info = {
            code: '',
            isExternal: true,
            isDynamic: isDynamic,
            async: script.hasAttribute('async'),
            defer: script.defer || script.type === 'module',
            module: script.type === 'module',
            isGlobal: script.hasAttribute('global')
        }
        if (!isDynamic) {
            app.source.scripts.set(src, info)
            replaceComment = document.createComment(`script with src='${src}' extract by micro-app`)
        } else {
            return { url: src, info }
        }
    } else if (script.textContent) { // inline script
        const nonceStr = createNonceStr()
        const info = {
            code: script.textContent,
            isExternal: false,
            isDynamic: isDynamic,
            async: false,
            defer: script.type === 'module',
            module: script.type === 'module'
        }
        if (!isDynamic) {
            app.source.scripts.set(nonceStr, info)
            replaceComment = document.createComment('inline script extract by micro-app')
        } else {
            return { url: nonceStr, info }
        }
    } else {
        replaceComment = document.createComment('script ignored by micro-app')
    }

    if (isDynamic) {
        return { replaceComment }
    } else if (replaceComment) {
        return parent.replaceChild(replaceComment, script)
    }
}

// Record element and map element
const dynamicElementInMicroAppMap = new WeakMap()

/**
 * Process the new node and format the style, link and script element
 * @param parent parent node
 * @param child new node
 * @param app app
 */
// eslint-disable-next-line no-unused-vars
function handleNewNode (parent, child, app) {
    if (child instanceof HTMLStyleElement) {
        if (child.hasAttribute('exclude')) {
            const replaceComment = document.createComment('style element with exclude attribute ignored by micro-app')
            dynamicElementInMicroAppMap.set(child, replaceComment)
            return replaceComment
        } else if (app.scopecss) {
            return scopedCSS(child, app.name)
        }
        return child
    } else if (child instanceof HTMLLinkElement) {
        if (child.hasAttribute('exclude')) {
            const linkReplaceComment = document.createComment('link element with exclude attribute ignored by micro-app')
            dynamicElementInMicroAppMap.set(child, linkReplaceComment)
            return linkReplaceComment
        } else if (!app.scopecss) {
            return child
        }

        const { url, info } = extractLinkFromHtml(
            child,
            parent,
            app,
            null,
            true
        )

        if (url && info) {
            const replaceStyle = pureCreateElement('style')
            replaceStyle.linkpath = url
            foramtDynamicLink(url, info, app, child, replaceStyle)
            dynamicElementInMicroAppMap.set(child, replaceStyle)
            return replaceStyle
        }
        //  else if (replaceComment) {
        //   dynamicElementInMicroAppMap.set(child, replaceComment)
        //   return replaceComment
        // }
        return child
    } else if (child instanceof HTMLScriptElement) {
        const { replaceComment, url, info } = extractScriptElement(
            child,
            parent,
            app,
            true
        ) || {}

        if (url && info) {
            console.error('1111111', url)
            if (info.code) { // inline script
                const replaceElement = runScript(url, info.code, app, info.module, true)
                dynamicElementInMicroAppMap.set(child, replaceElement)
                return replaceElement
            } else { // remote script
                const replaceElement = runDynamicScript(url, info, app, child)
                dynamicElementInMicroAppMap.set(child, replaceElement)
                return replaceElement
            }
        } else if (replaceComment) {
            dynamicElementInMicroAppMap.set(child, replaceComment)
            return replaceComment
        }

        return child
    }

    return child
}

/**
 * Handle the elements inserted into head and body, and execute normally in other cases
 * @param app app
 * @param method raw method
 * @param parent parent node
 * @param targetChild target node
 * @param passiveChild second param of insertBefore and replaceChild
 */
function invokePrototypeMethod (app, rawMethod, parent, targetChild, passiveChild) {
    /**
     * If passiveChild is not the child node, insertBefore replaceChild will have a problem, at this time, it will be degraded to appendChild
     * E.g: document.head.insertBefore(targetChild, document.head.childNodes[0])
     */
    if (parent === document.head) {
        const microAppHead = app.container.querySelector('#lesscode-canvas-header')
        /**
     * 1. If passivechild exists, it must be insertBefore or replacechild
     * 2. When removeChild, targetChild may not be in microAppHead or head
     */
        if (passiveChild && !microAppHead.contains(passiveChild)) {
            return rawAppendChild.call(microAppHead, targetChild)
        } else if (rawMethod === rawRemoveChild && !microAppHead.contains(targetChild)) {
            if (parent.contains(targetChild)) {
                return rawMethod.call(parent, targetChild)
            }
            return targetChild
        } else if (rawMethod === rawAppend || rawMethod === rawPrepend) {
            return rawMethod.call(microAppHead, targetChild)
        }
        return rawMethod.call(microAppHead, targetChild, passiveChild)
    } else if (parent === document.body) {
        const microAppBody = app.container.querySelector('#lesscode-canvas-body')
        if (passiveChild && !microAppBody.contains(passiveChild)) {
            return rawAppendChild.call(microAppBody, targetChild)
        } else if (rawMethod === rawRemoveChild && !microAppBody.contains(targetChild)) {
            if (parent.contains(targetChild)) {
                return rawMethod.call(parent, targetChild)
            }
            return targetChild
        } else if (rawMethod === rawAppend || rawMethod === rawPrepend) {
            return rawMethod.call(microAppBody, targetChild)
        }
        return rawMethod.call(microAppBody, targetChild, passiveChild)
    } else if (rawMethod === rawAppend || rawMethod === rawPrepend) {
        return rawMethod.call(parent, targetChild)
    }

    return rawMethod.call(parent, targetChild, passiveChild)
}

// Get the map element
function getMappingNode (node) {
    return dynamicElementInMicroAppMap.get(node) || node
}

/**
 * method of handle new node
 * @param parent parent node
 * @param newChild new node
 * @param passiveChild passive node
 * @param rawMethod raw method
 */
function commonElementHander (parent, newChild, passiveChild, rawMethod) {
    if (newChild && newChild.__MICRO_APP_NAME__) {
        const app = instanceMap.get(newChild.__MICRO_APP_NAME__)
        if (app && app.container) {
            return invokePrototypeMethod(
                app,
                rawMethod,
                parent,
                handleNewNode(parent, newChild, app),
                passiveChild && getMappingNode(passiveChild)
            )
        } else if (rawMethod === rawAppend || rawMethod === rawPrepend) {
            return rawMethod.call(parent, newChild)
        }
        return rawMethod.call(parent, newChild, passiveChild)
    } else if (rawMethod === rawAppend || rawMethod === rawPrepend) {
        const appName = getCurrentAppName()
        if (!(newChild instanceof Node) && appName) {
            const app = instanceMap.get(appName)
            if (app && app.container) {
                if (parent === document.head) {
                    return rawMethod.call(app.container.querySelector('#lesscode-canvas-header'), newChild)
                } else if (parent === document.body) {
                    return rawMethod.call(app.container.querySelector('#lesscode-canvas-body'), newChild)
                }
            }
        }
        return rawMethod.call(parent, newChild)
    }

    return rawMethod.call(parent, newChild, passiveChild)
}

/**
 * Rewrite element prototype method
 */
export function patchElementPrototypeMethods () {
    patchDocument()

    // Rewrite setAttribute
    Element.prototype.setAttribute = function setAttribute (key, value) {
        if (/^micro-app(-\S+)?/i.test(this.tagName) && key === 'data') {
            if (toString.call(value) === '[object Object]') {
                const cloneValue = {}
                Object.getOwnPropertyNames(value).forEach((propertyKey) => {
                    if (!(typeof propertyKey === 'string' && propertyKey.indexOf('__') === 0)) {
                        // @ts-ignore
                        cloneValue[propertyKey] = value[propertyKey]
                    }
                })
                this.data = cloneValue
            } else if (value !== '[object Object]') {
                console.warn('property data must be an object')
            }
        } else if (
            (
                (key === 'src' && /^(img|iframe|script)$/i.test(this.tagName))
        || (key === 'href' && /^link$/i.test(this.tagName))
            )
      && this.__MICRO_APP_NAME__
      && instanceMap.has(this.__MICRO_APP_NAME__)
        ) {
            const app = instanceMap.get(this.__MICRO_APP_NAME__)
            rawSetAttribute.call(this, key, completionPath(value, app.url))
        } else {
            rawSetAttribute.call(this, key, value)
        }
    }

    // prototype methods of add element👇
    Node.prototype.appendChild = function appendChild (newChild) {
        return commonElementHander(this, newChild, null, rawAppendChild)
    }
    Node.prototype.insertBefore = function insertBefore (newChild, refChild) {
        return commonElementHander(this, newChild, refChild, rawInsertBefore)
    }
    Node.prototype.replaceChild = function replaceChild (newChild, oldChild) {
        return commonElementHander(this, newChild, oldChild, rawReplaceChild)
    }

    Element.prototype.append = function append (...nodes) {
        let i = 0
        const length = nodes.length
        while (i < length) {
            commonElementHander(this, nodes[i], null, rawAppend)
            i++
        }
    }
    Element.prototype.prepend = function prepend (...nodes) {
        let i = nodes.length
        while (i > 0) {
            commonElementHander(this, nodes[i - 1], null, rawPrepend)
            i--
        }
    }
    // prototype methods of delete element👇
    Node.prototype.removeChild = function removeChild (oldChild) {
        if (oldChild === null || oldChild === void 0 ? void 0 : oldChild.__MICRO_APP_NAME__) {
            const app = instanceMap.get(oldChild.__MICRO_APP_NAME__)
            if (app === null || app === void 0 ? void 0 : app.container) {
                return invokePrototypeMethod(app, rawRemoveChild, this, getMappingNode(oldChild))
            }
            return rawRemoveChild.call(this, oldChild)
        }
        return rawRemoveChild.call(this, oldChild)
    }
}

// Set the style of #lesscode-canvas-header and #lesscode-canvas-body
let hasRejectMicroAppStyle = false
export function rejectMicroAppStyle () {
    if (!hasRejectMicroAppStyle) {
        hasRejectMicroAppStyle = true
        const style = pureCreateElement('style')
        style.setAttribute('type', 'text/css')
        style.textContent = `\nlesscode-canvas, #lesscode-canvas-body { display: block; } \n#lesscode-canvas-header { display: none; }`
        rawDocument.head.appendChild(style)
    }
}
