import { rawWindow, defer, pureCreateElement } from './util'

import {
    dispatchOnLoadEvent,
    dispatchOnErrorEvent
} from './load-event'

import request from './request'

// Global scripts, reuse across apps
export const globalScripts = new Map()

/**
 * Execute js in the mount lifecycle
 * @param scriptList script list
 * @param app app
 */
export function execScripts (scriptList, app) {
    const scriptListEntries = Array.from(scriptList.entries())
    const deferScriptPromise = []
    const deferScriptInfo = []
    for (const [url, info] of scriptListEntries) {
        if (!info.isDynamic) {
            if (info.defer || info.async) {
                if (info.isExternal && !info.code) {
                    deferScriptPromise.push(request(url, app.name))
                } else {
                    deferScriptPromise.push(info.code)
                }
                deferScriptInfo.push([url, info])
            } else {
                runScript(url, info.code, app, info.module, false)
            }
        }
    }

    if (deferScriptPromise.length) {
        Promise.all(deferScriptPromise).then(res => {
            res.forEach((code, index) => {
                const [url, info] = deferScriptInfo[index]
                runScript(url, info.code = info.code || code, app, info.module, false)
            })
        }).catch((err) => {
            console.error(err)
        })
    }
}

/**
 * Get dynamically created remote script
 * @param url script address
 * @param info info
 * @param app app
 * @param originScript origin script element
 */
export function runDynamicScript (url, info, app, originScript) {
    if (app.source.scripts.has(url)) {
        const existInfo = app.source.scripts.get(url)
        defer(() => dispatchOnLoadEvent(originScript))
        return runScript(url, existInfo.code, app, info.module, true)
    }

    if (globalScripts.has(url)) {
        const code = globalScripts.get(url)
        info.code = code
        app.source.scripts.set(url, info)
        defer(() => dispatchOnLoadEvent(originScript))
        return runScript(url, code, app, info.module, true)
    }

    let replaceElement
    if (app.inline) {
        replaceElement = pureCreateElement('script')
    } else {
        replaceElement = document.createComment(`dynamic script with src='${url}' extract by micro-app`)
    }

    request(url, app.name).then((data) => {
        info.code = data
        app.source.scripts.set(url, info)
        if (info.isGlobal) globalScripts.set(url, data)
        try {
            data = bindScope(url, data, app)
            if (app.inline) {
                if (info.module) (replaceElement).setAttribute('type', 'module')
                replaceElement.textContent = data
            } else {
                // eslint-disable-next-line no-new-func
                Function(data)()
            }
        } catch (e) {
            console.error('[micro-app from runDynamicScript]', e, url)
        }
        dispatchOnLoadEvent(originScript)
    }).catch((err) => {
        console.error(err)
        dispatchOnErrorEvent(originScript)
    })

    return replaceElement
}

/**
 * run code
 * @param url script address
 * @param code js code
 * @param app app
 * @param module type='module' of script
 * @param isDynamic dynamically created script
 */
export function runScript (
    url,
    code,
    app,
    module,
    isDynamic
) {
    try {
        code = bindScope(url, code, app)
        if (app.inline) {
            const script = pureCreateElement('script')
            if (module) script.setAttribute('type', 'module')
            script.textContent = code
            if (isDynamic) return script
            app.container && app.container.querySelector('#lesscode-canvas-body').appendChild(script)
        } else {
            // eslint-disable-next-line no-new-func
            Function(code)()
            if (isDynamic) return document.createComment('dynamic script extract by micro-app')
        }
    } catch (e) {
        console.error('[micro-app from runScript]', e)
    }
}

/**
 * bind js scope
 * @param url script address
 * @param code code
 * @param app app
 */
function bindScope (
    url,
    code,
    app
) {
    rawWindow.__MICRO_APP_PROXY_WINDOW__ = app.sandbox.proxyWindow
    return `;(function(window, self){with(window){;${code}\n}}).call(window.__MICRO_APP_PROXY_WINDOW__, window.__MICRO_APP_PROXY_WINDOW__, window.__MICRO_APP_PROXY_WINDOW__);`
}
