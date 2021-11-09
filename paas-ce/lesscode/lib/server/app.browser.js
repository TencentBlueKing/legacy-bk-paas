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
const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const convert = require('koa-convert')
const shell = require('shelljs')

const { logger } = require('./logger')
const { getIP } = require('./util')
const { routes, allowedMethods } = require('./router')

const { executeApi } = require('./controller/db-migration-helper')

const authMiddleware = require('./middleware/auth')
const httpMiddleware = require('./middleware/http')
const errorMiddleware = require('./middleware/error')
const jsonSendMiddleware = require('./middleware/json-send')
const { requestContextMiddleware } = require('./middleware/request-context')
const permMiddleware = require('./middleware/perm')
const operationLoggerMiddleware = require('./middleware/operation-logger')
// const helmet = require("koa-helmet")

// const { CODE } = require('./util')
const httpConf = require('./conf/http')

const { createConnection } = require('typeorm')
const dataBaseConf = require('./conf/data-base')
const { OrmLog } = require('./logger')

const componentController = require('./controller/component')

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

    app.use(errorMiddleware())
    app.use(session(SESSION_CONFIG, app))

    app.on('error', (err, ctx) => {
        logger.error('app error:')
        logger.error(err.message || '')
        // {"errno":"ECONNRESET","code":"ECONNRESET","syscall":"read","headerSent":true}
        logger.error(err)
    })

    app.use(errorMiddleware())

    // 自定义组件注册
    app.use(async (ctx, next) => {
        if (/component\/register\.js/.test(ctx.url)) {
            // 编辑页面注册自定义组件
            await componentController.register(ctx)
        } else if (/component\/preview-register\.js/.test(ctx.url)) {
            // 预览页面注册自定义组件
            await componentController.previewRegister(ctx)
        } else {
            await next()
        }
    })

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
    app.use(authMiddleware().unless({ path: [/^\/api\/open\//] }))
    app.use(requestContextMiddleware())
    app.use(permMiddleware())
    app.use(operationLoggerMiddleware())
    // csp
    // app.use(helmet({
    //     referrerPolicy: { policy: "origin" }
    // }))

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
        const webpackDevConf = require('../../lib/client/build/webpack.dev.conf')
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

    // 进程级捕获 ECONNRESET 异常
    process.on('uncaughtException', function (err) {
        logger.error('uncaughtException:')
        logger.error(err.stack)
        logger.error('not exit...')
    })
}

// 自动执行db导入和变更操作,相应配置文件位于lib/server/conf/db-migrate.json
async function execSql (connection, callBack) {
    try {
        const databaseEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
        const prefixPath = '.'
        const migrateUp = `node node_modules/db-migrate/bin/db-migrate up --config ${prefixPath}/lib/server/conf/db-migrate.json --migrations-dir ${prefixPath}/lib/server/model/migrations -e ${databaseEnv}`
        shell.exec(migrateUp)

        // 自动执行接口刷数据
        await executeApi()
        callBack()
        return
    } catch (err) {
        logger.error(err.message || err)
    }
}

const config = process.env.NODE_ENV === 'production' ? dataBaseConf.prod : dataBaseConf.dev
const ormConfig = {
    type: config.dialect,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: [resolve(__dirname, '.', 'model/entities/!(base){.js,.ts}')],
    // 打印日志的类型
    logger: new OrmLog(config.logging),
    // 自动同步数据库表结构，有删除数据风险，推荐关闭
    synchronize: false,
    // 会自动执行更新SQL，推荐手动执行脚本，关闭该选项
    migrationsRun: false,
    extra: {
        connectionLimit: 5
    }
}

createConnection(ormConfig).then((connection) => {
    return execSql(connection, startServer)
}).catch((err) => logger.error(err.message || err))
