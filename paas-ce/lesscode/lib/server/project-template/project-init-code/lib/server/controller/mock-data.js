import tokenConf from '../conf/token'
import {
    Controller,
    Post,
    Ctx,
    OutputJson
} from '../decorator'

function strToJson (str) {
    // eslint-disable-next-line no-new-func
    const json = (new Function('return ' + str))()
    return json
}

@Controller('/api/data')
export default class DataController {
    @OutputJson()
    @Post('/user/projectId/:projectId/tableName/:tableName')
    async getPerviewTableData (@Ctx() ctx) {
        const axiosParam = []
        const { url, type = 'get', withToken = 0, apiData } = ctx.request.body || {}
        axiosParam.push(url)
        const methodsWithData = ['post', 'put', 'patch']
        const httpData = typeof apiData === 'string' ? strToJson(apiData || '{}') : apiData
        if (methodsWithData.includes(type)) {
            axiosParam.push(httpData)
        } else {
            const urlObj = new URL(url)
            const keys = Object.keys(httpData)
            keys.forEach((key) => {
                urlObj.searchParams.delete(key)
                urlObj.searchParams.append(key, httpData[key])
            })
            axiosParam[0] = urlObj.href
        }
        // 携带 cookie
        ctx.http.defaults.withCredentials = true
        if (ctx.cookies.request.headers.cookie) ctx.http.defaults.headers.Cookie = ctx.cookies.request.headers.cookie
        // 判断是否携带 token
        const options = {}
        if (withToken) {
            const bkTicket = ctx.cookies.get('bk_ticket')
            const token = {
                ...tokenConf,
                bk_ticket: bkTicket
            }
            options.headers = {
                'X-BKAPI-AUTHORIZATION': JSON.stringify(token)
            }
        }
        axiosParam.push(options)
        const re = await ctx.http[type](...axiosParam)
        return re.data
    }
}
