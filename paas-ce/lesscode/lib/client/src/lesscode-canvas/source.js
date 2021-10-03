import request from './request'
import { completionPath } from './util'
import scopedCSS from './scopedcss'

const REG_HEAD = new RegExp(/(?<=<head[\s\S]*>)([\s\S]+)(?=<\/head>)/g)
const REG_BODY = new RegExp(/(?<=<body[\s\S]*>)([\s\S]+)(?=<\/body>)/g)

export default function loadHtml (app) {
    request(app.entry).then(async res => {
        let html = ''
        const head = res.match(REG_HEAD)
        const body = res.match(REG_BODY)
        if (head && body) {
            html = (head[0] + body[0])
        }
        const elem = document.createElement('div')
        elem.innerHTML = html

        parseDom(app, elem)

        await Promise.all([
            fetchLinksFromHtml(app, elem),
            fetchScriptsFromHtml(app, elem)
        ])

        app.onLoad(elem)
    }).catch(e => {
        console.error('加载 html 出错', e)
    })
}

function parseDom (app, elem) {
    const children = Array.from(elem.children)

    children.length && children.forEach(child => {
        parseDom(app, child)
    })

    for (const dom of children) {
        console.error(dom, dom instanceof HTMLLinkElement, dom instanceof HTMLScriptElement, dom instanceof HTMLStyleElement)
        if (dom instanceof HTMLLinkElement) {
            // 提取css地址
            const href = dom.getAttribute('href')
            if (dom.getAttribute('rel') === 'stylesheet' && href) {
                // 计入source缓存中
                app.source.links.set(completionPath(href, app.entry), {
                    code: '' // 代码内容
                })
            }

            // elem.removeChild(dom)
        } else if (dom instanceof HTMLScriptElement) {
            // 并提取js地址
            const src = dom.getAttribute('src')
            if (src) { // 远程script
                app.source.scripts.set(completionPath(src, app.entry), {
                    code: '', // 代码内容
                    isExternal: true // 是否远程script
                })
            } else if (dom.textContent) { // 内联script
                const nonceStr = Math.random().toString(36).substr(2, 15)
                app.source.scripts.set(nonceStr, {
                    code: dom.textContent, // 代码内容
                    isExternal: false // 是否远程script
                })
            }
            elem.replaceChild(document.createComment(`script with src='${src}' extract by lesscode-canvas`), dom)
        } else if (dom instanceof HTMLStyleElement) {
            // 进行样式隔离
            scopedCSS(dom, app.name)
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
