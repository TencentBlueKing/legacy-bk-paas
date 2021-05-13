const { resolve } = require('path')
const log4js = require('koa-log4')
const jsonLayout = require('log4js-json-layout')
const dayjs = require('dayjs')
const IS_DEV = process.env.NODE_ENV === 'development'
const logCatalog = '../../v3logs'
const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')

// 使用时区插件，设置时间为上海时区
dayjs.extend(utc)
dayjs.extend(timezone)
log4js.addLayout('json', jsonLayout)
log4js.configure({
    appenders: {
        access: {
            type: 'dateFile',
            layout: {
                type: 'json',
                dynamic: {
                    asctime (item) {
                        const date = Date.now()
                        return dayjs(date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss,SSS')
                    }
                },
                include: ['asctime', 'levelname', 'message', 'url', 'method']
            },
            pattern: '-yyyy-MM-dd.log',
            filename: resolve(__dirname, logCatalog, 'web-access-json.log')
        },
        application: {
            type: 'dateFile',
            layout: {
                type: 'json',
                dynamic: {
                    asctime (item) {
                        const date = Date.now()
                        return dayjs(date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss,SSS')
                    }
                },
                include: ['asctime', 'levelname', 'message']
            },
            pattern: '-yyyy-MM-dd.log',
            filename: resolve(__dirname, logCatalog, `web-application-json.log`)
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'all' },
        dev: { appenders: ['out'], level: 'all' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'info' }
    }
})

/**
 * access 级别的日志
 */
exports.accessLogger = () => {
    return async function (ctx, next) {
        const loger = log4js.getLogger('access')
        loger.info({
            levelname: 'INFO',
            method: ctx.request.method,
            url: ctx.request.url,
            message: ctx.request.header['user-agent']
        })
        await next()
    }
}

/**
 * application 级别的日志
 */
const logType = IS_DEV ? 'dev' : 'application'
const appLog = log4js.getLogger(logType)
const logTypes = ['info', 'warn', 'error']
const logger = {}
logTypes.forEach((type) => {
    const levelname = type.toUpperCase()
    logger[type] = (message) => {
        if (!IS_DEV) {
            console[type](message)
        }
        appLog[type](
            {
                levelname,
                message: JSON.stringify(message)
            }
        )
    }
})
exports.logger = logger
