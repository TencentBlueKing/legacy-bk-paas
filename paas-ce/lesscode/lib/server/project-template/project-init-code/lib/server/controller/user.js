import {
    Controller,
    Get,
    Ctx,
    OutputJson
} from '../decorator'
const axios = require('axios')
const querystring = require('querystring')
const https = require('https')
const { setRequestContext } = require('../middleware/request-context')

@Controller('/api/user')
export default class UserController {
    @OutputJson()
    @Get('/getUser')
    async getUser (@Ctx() ctx) {
        try {
            const bkToken = ctx.cookies.get('bk_token')
            const params = querystring.stringify({
                bk_app_code: process.env.BKPAAS_APP_ID,
                bk_app_secret: process.env.BKPAAS_APP_SECRET,
                bk_token: bkToken
            })
            const response = await axios({
                withCredentials: true,
                url: `${process.env.BK_PAAS2_INNER_URL}/api/c/compapi/v2/bk_login/get_user/?${params}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: ctx.cookies.request.headers.cookie || ''
                },
                responseType: 'json',
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
            if (response.data.code > 0) {
                ctx.status = 401
                ctx.send(response.data)
                return
            } else {
                Object.assign(response.data.data, {
                    username: response.data.data.bk_username
                })
                setRequestContext(ctx)
                ctx.session.userInfo = { ...response.data.data }
                ctx.send(response.data || {})
            }
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}
