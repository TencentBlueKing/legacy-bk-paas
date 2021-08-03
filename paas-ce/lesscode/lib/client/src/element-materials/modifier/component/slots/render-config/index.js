import bkRenderMap from './bk'
import elementRenderMap from './element'

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
                res = `<div v-html="${val}"></div>`
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
    ...baseRenderMap
}

export default renderMap
