/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

const https = require('https')
const axios = require('axios')
const querystring = require('querystring')
const httpConf = require('../conf/http')
const { CODE, isAjaxReq } = require('../util')
const { findUserByBk, addUser } = require('../controller/user')
const { setRequestContext } = require('./request-context')

module.exports = () => {
    return async function (ctx, next) {
        try {
            // console.error(11111, isAjaxReq(ctx.request))
            const bkToken = ctx.cookies.get('bk_token')
            // console.error('bkToken', bkToken)
            // console.error()
            // console.error(ctx.session)
            // console.error(ctx.url)
            // console.error()
            const hostUrl = httpConf.hostUrl.replace(/\/$/, '')
            if (!bkToken) {
                const loginRedirectUrl = `${hostUrl}/login/?app_id=${httpConf.appCode}`
                // 非 ajax 异步请求，页面跳转到登录
                if (!isAjaxReq(ctx.request)) {
                    ctx.status = 302
                    ctx.redirect(`${loginRedirectUrl}&c_url=${encodeURIComponent(ctx.href)}`)
                } else {
                    ctx.status = 401
                    ctx.send({
                        code: 401,
                        message: 'success',
                        data: {
                            loginUrl: `${loginRedirectUrl}&c_url=${encodeURIComponent(ctx.request.header.referer)}`
                        }
                    })
                }
                return
            } else {
                if (!ctx.session.userInfo) {
                    // 写入 ctx.session
                    const params = querystring.stringify({
                        bk_app_code: httpConf.appCode,
                        bk_app_secret: httpConf.appSecret,
                        bk_token: bkToken
                    })
                    const response = await axios({
                        withCredentials: true,
                        url: `${hostUrl}/api/c/compapi/v2/bk_login/get_user/?${params}`,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        responseType: 'json',
                        httpsAgent: new https.Agent({ rejectUnauthorized: false })
                    })
                    ctx.session.userInfo = { ...response.data.data }
                    const userData = await findUserByBk(ctx.session.userInfo.bk_username)
                    if (!userData) {
                        setRequestContext(ctx)
                        const userId = await addUser({
                            username: ctx.session.userInfo.bk_username,
                            bk: ctx.session.userInfo.bk_username
                        })
                        ctx.session.userInfo.id = userId
                        ctx.session.userInfo.username = ctx.session.userInfo.bk_username
                    } else {
                        ctx.session.userInfo.id = userData.id
                        ctx.session.userInfo.username = userData.username
                    }
                }
                await next()
            }
        } catch (err) {
            const status = err.status
            const message = err.message || '服务器内部出错'

            // 程序出错异常
            if (CODE.HTTP.indexOf(status)) {
                ctx.status = err.status || 500
                ctx.body = {
                    code: err.status,
                    message: message
                }
            } else {
                const code = err.code || CODE.BIZ.NOT_DEFINED
                ctx.body = {
                    code: code,
                    message: message
                }
            }
            ctx.app.emit('error', err, ctx)
        }
    }
}
