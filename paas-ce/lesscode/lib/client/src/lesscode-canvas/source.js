import request from './request'
import { completionPath, isSupportModuleScript, createNonceStr } from './util'
import scopedCSS from './scopedcss'

const supportModuleScript = isSupportModuleScript()

const REG_HEAD = new RegExp(/(?<=<head[\s\S]*>)([\s\S]+)(?=<\/head>)/g)
const REG_BODY = new RegExp(/(?<=<body[\s\S]*>)([\s\S]+)(?=<\/body>)/g)

export default function loadHtml (app) {
    console.error('loadHtml')
    request(app.entry).then(async res => {
        let html = ''
        const head = res.match(REG_HEAD)
        const body = res.match(REG_BODY)
        if (head && body) {
            html = `<div id="lesscode-canvas-header">${head[0]}</div><div id="lesscode-canvas-body">${body[0]}</div>`
        }
        const elem = document.createElement('div')
        elem.innerHTML = html

        parseDom(app, elem, elem.querySelector('#lesscode-canvas-header'))

        await Promise.all([
            fetchLinksFromHtml(app, elem),
            fetchScriptsFromHtml(app, elem)
        ])

        app.onLoad(elem)
    }).catch(e => {
        console.error('加载 html 出错', e)
    })
}

function parseDom (app, elem, microAppHead) {
    console.error('parseDom')
    const children = Array.from(elem.children)

    children.length && children.forEach(child => {
        parseDom(app, child, microAppHead)
    })

    for (const dom of children) {
        // console.error(dom, dom instanceof HTMLLinkElement, dom instanceof HTMLScriptElement, dom instanceof HTMLStyleElement)
        if (dom instanceof HTMLLinkElement) {
            console.error(dom)
            if (dom.hasAttribute('exclude')) {
                elem.replaceChild(document.createComment('link element with exclude attribute ignored by micro-app'), dom)
            } else {
                // extractLinkFromHtml(dom, elem, app, microAppHead)
                const rel = dom.getAttribute('rel')
                let href = dom.getAttribute('href')
                let replaceComment = null
                if (rel === 'stylesheet' && href) {
                    href = completionPath(href, app.entry)
                    replaceComment = document.createComment(`the link with href=${href} move to micro-app-head as style element`)
                    const placeholderComment = document.createComment(`placeholder for link with href=${href}`)
                    // all style elements insert into microAppHead
                    microAppHead.appendChild(placeholderComment)
                    app.source.links.set(href, {
                        code: '',
                        placeholder: placeholderComment,
                        isGlobal: dom.hasAttribute('global')
                    })
                } else if (href) {
                    // preload prefetch modulepreload icon ....
                    dom.setAttribute('href', completionPath(href, app.entry))
                }
                if (replaceComment) {
                    elem.replaceChild(replaceComment, dom)
                }
            }
        } else if (dom instanceof HTMLStyleElement) {
            if (dom.hasAttribute('exclude')) {
                elem.replaceChild(document.createComment('style element with exclude attribute ignored by micro-app'), dom)
            } else {
                microAppHead.appendChild(scopedCSS(dom, app.name))
            }
        } else if (dom instanceof HTMLScriptElement) {
            // extractScriptElement(dom, elem, app)
            let replaceComment = null
            let src = dom.getAttribute('src')
            if (dom.hasAttribute('exclude')) {
                replaceComment = document.createComment('script element with exclude attribute ignored by micro-app')
            } else if (dom.type && !['text/javascript', 'text/ecmascript', 'application/javascript', 'application/ecmascript', 'module'].includes(dom.type)) {
                return null
            } else if ((supportModuleScript && dom.noModule) || (!supportModuleScript && dom.type === 'module')) {
                replaceComment = document.createComment(`${dom.noModule ? 'noModule' : 'module'} script ignored by micro-app`)
            } else if (src) { // remote script
                src = completionPath(src, app.entry)
                const info = {
                    code: '',
                    isExternal: true,
                    isDynamic: false,
                    async: dom.hasAttribute('async'),
                    defer: dom.defer || dom.type === 'module',
                    module: dom.type === 'module',
                    isGlobal: dom.hasAttribute('global')
                }
                app.source.scripts.set(src, info)
                replaceComment = document.createComment(`script with src='${src}' extract by micro-app`)
            } else if (dom.textContent) { // inline script
                const nonceStr = createNonceStr()
                const info = {
                    code: dom.textContent,
                    isExternal: false,
                    isDynamic: false,
                    async: false,
                    defer: dom.type === 'module',
                    module: dom.type === 'module'
                }
                app.source.scripts.set(nonceStr, info)
                replaceComment = document.createComment('inline script extract by micro-app')
            } else {
                replaceComment = document.createComment('script ignored by micro-app')
            }

            elem.replaceChild(replaceComment, dom)

            // // 并提取js地址
            // const src = dom.getAttribute('src')
            // if (src) { // 远程script
            //     app.source.scripts.set(completionPath(src, app.entry), {
            //         code: '', // 代码内容
            //         isExternal: true // 是否远程script
            //     })
            // } else if (dom.textContent) { // 内联script
            //     const nonceStr = Math.random().toString(36).substr(2, 15)
            //     app.source.scripts.set(nonceStr, {
            //         code: dom.textContent, // 代码内容
            //         isExternal: false // 是否远程script
            //     })
            // }
            // elem.replaceChild(document.createComment(`script with src='${src}' extract by lesscode-canvas`), dom)
        } else if (dom instanceof HTMLMetaElement || dom instanceof HTMLTitleElement) {
            elem.removeChild(dom)
        } else {
            if (/^(img|iframe)$/i.test(dom.tagName) && dom.hasAttribute('src')) {
                dom.setAttribute('src', completionPath(dom.getAttribute('src'), app.entry))
            }
        }
    }
}

async function fetchScriptsFromHtml (app, elem) {
    if (app.source.scripts.size === 0) {
        return
    }

    const scriptEntries = Array.from(app.source.scripts.entries())
    // 通过fetch请求所有js资源
    const fetchScriptPromise = []
    for (const [url, info] of scriptEntries) {
        // 如果是内联script，则不需要请求资源
        fetchScriptPromise.push(info.code ? Promise.resolve(info.code) : request(completionPath(url, app.url)))
    }

    try {
        const ret = await Promise.all(fetchScriptPromise)
        for (let i = 0; i < ret.length; i++) {
            const code = ret[i]
            // 将代码放入缓存，再次渲染时可以从缓存中获取
            scriptEntries[i][1].code = code
        }
        // 处理完成后执行onLoad方法
        // app.onLoad(elem, 'script')
    } catch (e) {
        console.error('加载js出错', e)
    }
}

async function fetchLinksFromHtml (app, elem) {
    if (app.source.links.size === 0) {
        return
    }
    const linkEntries = Array.from(app.source.links.entries())
    // 通过fetch请求所有css资源
    const fetchLinkPromise = []
    for (const [url] of linkEntries) {
        fetchLinkPromise.push(request(url))
    }

    try {
        const ret = await Promise.all(fetchLinkPromise)
        for (let i = 0; i < ret.length; i++) {
            const code = ret[i]
            // 拿到css资源后放入style元素并插入到micro-app-head中
            const link2Style = document.createElement('style')
            link2Style.textContent = code
            scopedCSS(link2Style, app.name)
            elem.appendChild(link2Style)
            // 将代码放入缓存，再次渲染时可以从缓存中获取
            linkEntries[i][1].code = code
        }

        // 处理完成后执行onLoad方法
        // app.onLoad(elem, 'style')
    } catch (e) {
        console.error('加载css出错', e)
    }
}
