import tokenConf from '../conf/token'

function strToJson (str) {
    // eslint-disable-next-line no-new-func
    const json = (new Function('return ' + str))()
    return json
}

const data = {
    async getApiData (ctx) {
        try {
            const axiosParam = []
            const body = ctx.request.body || {}
            const url = body.url
            axiosParam.push(url)
            const type = body.type || 'get'
            const methodsWithData = ['post', 'put', 'patch']
            if (methodsWithData.includes(type)) {
                let apiData = body.apiData
                if (typeof apiData === 'string') apiData = strToJson(apiData || '{}')
                axiosParam.push(apiData)
            }
            // 携带 cookie
            ctx.http.defaults.withCredentials = true
            if (ctx.cookies.request.headers.cookie) ctx.http.defaults.headers.Cookie = ctx.cookies.request.headers.cookie
            // 判断是否携带 token
            const withToken = body.withToken || 0
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
            ctx.send(re.data)
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}

module.exports = data
