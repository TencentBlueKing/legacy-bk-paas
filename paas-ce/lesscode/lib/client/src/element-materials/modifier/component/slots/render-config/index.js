import bkRenderMap from './bk'
import elementRenderMap from './element'
import vantRenderMap from './vant'

const html2Escape = html => {
    return html.replace(/[<>&"]/g, (c) => {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
    })
}

const baseRenderMap = {
    'html' ({ val, type }) {
        let res = ''
        switch (type) {
            case 'value':
                res = val
                break
            case 'variable':
                res = `<render-html :html="${val}" ></render-html>`
                break
        }
        return res
    },
    'text' ({ val, type }) {
        let res = ''
        switch (type) {
            case 'value':
                res = html2Escape(val)
                break
            case 'variable':
                res = `{{${val}}}`
                break
        }
        return res
    }
}

const renderMap = {
    ...bkRenderMap,
    ...elementRenderMap,
    ...vantRenderMap,
    ...baseRenderMap
}

export default renderMap
