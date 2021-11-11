require('reflect-metadata')
require('@babel/register')
require('./custom-global')
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

const { logger } = require('./logger')
const { getIP } = require('./util')
const webpackDevConf = require('../../lib/client/build/webpack.dev.conf')
const conf = require('../client/build/conf')
const { routes, allowedMethods } = require('./router')

const httpMiddleware = require('./middleware/http')
const errorMiddleware = require('./middleware/error')
const jsonSendMiddleware = require('./middleware/json-send')
const { requestContextMiddleware } = require('./middleware/request-context')

${dbImport}
const { CODE } = require('./util')

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
    const IS_DEV = process.env.NODE_ENV === 'development'
    const PORT = IS_DEV ? conf.dev.port : conf.build.port

    const app = new Koa()

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
    app.on('error', (err, ctx) => {
        logger.error(err.message || err)
    })

    app.use(errorMiddleware())
    app.keys = ['lesscode login secret']
    app.use(session(SESSION_CONFIG, app))
    app.use(bodyparser())
    app.use(json())
    app.use(requestContextMiddleware())

    app.use(httpMiddleware())
    app.use(jsonSendMiddleware())

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
}

${startStr}
