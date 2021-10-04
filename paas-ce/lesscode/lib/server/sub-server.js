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
require('reflect-metadata')
require('@babel/register')
// 注入自定义全局对象
require('./custom-global')

const http = require('http')
const { resolve } = require('path')
const Koa = require('koa')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const json = require('koa-json')
const session = require('koa-session')
const koaStatic = require('koa-static')
const views = require('co-views')
const koaMount = require('koa-mount')
const chalk = require('chalk')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const convert = require('koa-convert')

const { logger } = require('./logger')
const { getIP } = require('./util')
const { routes, allowedMethods } = require('./router')

const corsMiddleware = require('./middleware/cors')
const httpMiddleware = require('./middleware/http')
const errorMiddleware = require('./middleware/error')
const jsonSendMiddleware = require('./middleware/json-send')
const { requestContextMiddleware } = require('./middleware/request-context')
const permMiddleware = require('./middleware/perm')
const operationLoggerMiddleware = require('./middleware/operation-logger')

const SESSION_CONFIG = {
    // cookie key
    key: 'lesscode-session',
    // cookie 的过期时间，毫秒
    maxAge: 86400000,
    // 自动提交到响应头
    autoCommit: true,
    // 是否允许重写
    overwrite: true,
    httpOnly: true,
    // 是否签名
    signed: true,
    // 每次响应时是否刷新 session 的有效期
    rolling: false,
    // 在 session 快过期时是否刷新 session 的有效期
    renew: false
}

async function startServer () {
    const PORT = 5001

    const app = new Koa()

    // session 加密密钥
    app.keys = ['lesscode login secret']

    app.use(errorMiddleware())
    app.use(session(SESSION_CONFIG, app))

    app.on('error', (err, ctx) => {
        logger.error('app error:')
        logger.error(err.message || '')
        // {"errno":"ECONNRESET","code":"ECONNRESET","syscall":"read","headerSent":true}
        logger.error(err)
    })

    app.use(corsMiddleware())

    app.use(koaBody(
        {
            multipart: true,
            formidable: {
                maxFileSize: 1000 * 1024 * 1024 // 设置上传文件大小最大限制，默认10M
            },
            formLimit: '10mb',
            jsonLimit: '10mb',
            textLimit: '10mb'
        }
    ))
    app.use(json())

    app.use(httpMiddleware())
    app.use(jsonSendMiddleware())
    app.use(requestContextMiddleware())
    app.use(permMiddleware())
    app.use(operationLoggerMiddleware())
    // csp
    // app.use(helmet({
    //     referrerPolicy: { policy: "origin" }
    // }))

    app.use(koaMount(
        '/micro-app/vue3', koaStatic(resolve(__dirname, '..', 'client/src/vue3/vue3')))
    )

    app.use(convert.compose(routes))
    app.use(convert.compose(allowedMethods))

    app.context.render = views(resolve(__dirname, '..', 'client/src/vue3/vue3'), {
        map: { html: 'swig' }
    })

    app.use(historyApiFallback({
        verbose: false,
        whiteList: ['/api'],
        rewrites: [
            {
                // connect-history-api-fallback 默认会对 url 中有 . 的 url 当成静态资源处理而不是当成页面地址来处理
                // from: /\d+\.\d+\.\d+\.\d+$/,
                from: /\/(\d+\.)*\d+$/,
                to: '/'
            },
            {
                // connect-history-api-fallback 默认会对 url 中有 . 的 url 当成静态资源处理而不是当成页面地址来处理
                from: /\/\/+.*\..*\//,
                to: '/'
            }
        ]
    }))

    const server = http.createServer(app.callback())
    server.listen(PORT)

    server.on('error', error => {
        if (error.syscall !== 'listen') {
            throw error
        }

        const bind = typeof PORT === 'string' ? ('Pipe ' + PORT) : 'Port ' + PORT

        switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges')
                process.exit(1)
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use')
                process.exit(1)
            default:
                throw error
        }
    })

    server.on('listening', async () => {
        const addr = server.address()
        console.log(chalk.cyan(
            'Listening at http://localhost:' + addr.port + ' or http://' + getIP() + ':' + addr.port + '\n'
        ))
    })

    // 进程级捕获 ECONNRESET 异常
    process.on('uncaughtException', function (err) {
        logger.error('uncaughtException:')
        logger.error(err.stack)
        logger.error('not exit...')
    })
}

Promise.resolve().then(() => {
    startServer()
}).catch((err) => logger.error(err.message || err))
