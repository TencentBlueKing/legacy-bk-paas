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

const http = require('http')
const { resolve } = require('path')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const json = require('koa-json')
const session = require('koa-session')
const koaStatic = require('koa-static')
const views = require('co-views')
const koaMount = require('koa-mount')
const chalk = require('chalk')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const convert = require('koa-convert')

const { accessLogger, applicationLogger, devLogger } = require('./logger')
const { getIP } = require('./util')
const webpackDevConf = require('../../lib/client/build/webpack.dev.conf')
const { routes, allowedMethods } = require('./router')

const authMiddleware = require('./middleware/auth')
const httpMiddleware = require('./middleware/http')
const errorMiddleware = require('./middleware/error')
const jsonSendMiddleware = require('./middleware/json-send')
const { CODE } = require('./util')
const httpConf = require('./conf/http')

const { createConnection } = require('typeorm')
const dataBaseConf = require('./conf/data-base')

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
    const PORT = httpConf.port
    const IS_DEV = process.env.NODE_ENV === 'development'

    const app = new Koa()

    // session 加密密钥
    app.keys = ['lesscode login secret']

    app.use(session(SESSION_CONFIG, app))

    // 统一处理，
    // @see https://github.com/koajs/koa/wiki/Error-Handling
    app.use(async (ctx, next) => {
        try {
            await next()
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
    })

    const logger = IS_DEV ? devLogger : applicationLogger
    // logger.trace('trace:', +new Date())
    // logger.debug('debug:', +new Date())
    // logger.info('info:', +new Date())
    // logger.warn('warn:', +new Date())
    // logger.error('error:', +new Date())
    // logger.fatal('fatal:', +new Date())
    // logger.mark('mark:', +new Date())
    app.use(async (ctx, next) => {
        ctx.logger = logger
        accessLogger()
        await next()
    })
    app.on('error', (err, ctx) => {
        console.error(err)
        logger.error(err)
    })

    app.use(bodyparser())
    app.use(json())

    app.use(errorMiddleware())
    app.use(httpMiddleware())
    app.use(jsonSendMiddleware())
    app.use(authMiddleware())

    app.use(koaMount(
        '/static', koaStatic(resolve(__dirname, '..', IS_DEV ? 'client/static' : 'client/dist/static')))
    )

    app.use(convert.compose(routes))
    app.use(convert.compose(allowedMethods))

    app.context.render = views(resolve(__dirname, '..', IS_DEV ? 'client' : 'client/dist'), {
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

    if (IS_DEV) {
        const compiler = webpack(webpackDevConf)
        app.use(await koaWebpack({
            compiler: compiler,
            hotClient: {
                allEntries: true,
                host: {
                    client: '*',
                    server: '0.0.0.0'
                }
            },
            devMiddleware: {
                publicPath: webpackDevConf.output.publicPath,
                quiet: true
            }
        }))
    } else {
        // app.use(async (ctx, next) => {
        //     if (ctx.status === 404) {
        //         ctx.body = `${ctx.url} ${ctx.originalUrl} is Not Found`
        //     } else {
        //         await next()
        //     }
        // })
    }

    const server = http.createServer(app.callback())
    server.listen(PORT)

    server.on('error', error => {
        if (error.syscall !== 'listen') {
            throw error
        }

        const bind = typeof PORT === 'string' ? ('Pipe ' + PORT) : 'Port ' + PORT

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges')
                process.exit(1)
            case 'EADDRINUSE':
                console.error(bind + ' is already in use')
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
}

createConnection(dataBaseConf).then(startServer).catch((err) => console.error(err))
