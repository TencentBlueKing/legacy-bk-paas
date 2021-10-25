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
const unless = require('koa-unless')
const httpConf = require('../conf/http')
const { CODE, isAjaxReq } = require('../util')
const { findUserByBk, addUser } = require('../controller/user')
const { setRequestContext } = require('./request-context')
const { createDemoProject } = require('../controller/project')
const authWhiteList = [
    '/static/monaco-editor/min/vs/base/worker/workerMain.js',
    '/static/monaco-editor/min//vs/language/typescript/tsWorker.js'
]

module.exports = () => {
    const authMiddleware = async function (ctx, next) {
        try {
            const bkToken = ctx.cookies.get('bk_token')
            const hostUrl = httpConf.hostUrl.replace(/\/$/, '')
            const loginRedirectUrl = `${httpConf.loginUrl}?app_id=${httpConf.appCode}`
            const isInWhiteList = authWhiteList.includes(ctx.originalUrl)
            if (isInWhiteList) {
                await next()
            } else if (!bkToken) {
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
            } else {
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

                const { code, data } = response.data

                if (code !== 0) {
                    ctx.status = 302
                    ctx.redirect(`${loginRedirectUrl}&c_url=${encodeURIComponent(ctx.href)}`)
                    return
                }

                ctx.session.userInfo = { ...data, ...{ loginRedirectUrl } }
                const userData = await findUserByBk(ctx.session.userInfo.bk_username)

                if (!userData) {
                    setRequestContext(ctx)
                    const userId = await addUser({
                        username: ctx.session.userInfo.bk_username,
                        bk: ctx.session.userInfo.bk_username
                    })
                    ctx.session.userInfo.id = userId
                    ctx.session.userInfo.username = ctx.session.userInfo.bk_username
                    await createDemoProject({
                        userInfo: {
                            username: ctx.session.userInfo.bk_username,
                            id: ctx.session.userInfo.id
                        },
                        projectData: {
                            copyFrom: null,
                            projectCode: 'demo',
                            projectName: 'Demo项目',
                            projectDesc: '欢迎使用蓝鲸可视化开发平台，这是为您提供的Demo项目，欢迎体验。'
                        }
                    })
                } else {
                    ctx.session.userInfo.id = userData.id
                    ctx.session.userInfo.username = userData.username
                }

                await next()
            }
        } catch (error) {
            ctx.throwError({
                status: error.status || 401,
                code: error.code,
                message: error.message
            })
        }
    }

    authMiddleware.unless = unless
    return authMiddleware
}
