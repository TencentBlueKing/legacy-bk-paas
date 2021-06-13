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

const { resolve } = require('path')
const log4js = require('koa-log4')
const jsonLayout = require('log4js-json-layout')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')

const logPath = require('./conf/logger-path')

const IS_DEV = process.env.NODE_ENV === 'development'

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
            filename: resolve(__dirname, logPath, 'web-access-json.log')
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
            filename: resolve(__dirname, logPath, `web-application-json.log`)
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

/***
 * orm 日志
 */
class OrmLog {
    constructor (logging) {
        this.logging = logging
    }
    /**
     * Allow curret log
     */
    allowLogType (type) {
        const loggingType = typeof this.logging
        let res = true
        switch (loggingType) {
            case 'string':
                res = this.logging === 'all'
                break
            default:
                res = this.logging.includes(type)
                break
        }
        return res
    }
    /**
     * Logs query
     */
    logQuery (query, parameters) {
        const message = `query: ${query} -- parameters: ${parameters}`
        if (this.allowLogType('info')) logger.info(message)
    }
    /**
     * Logs query that is failed.
     */
    logQueryError (error, query, parameters) {
        const message = `Error when query, error: ${error}, query: ${query} -- parameters: ${parameters}`
        if (this.allowLogType('error')) logger.error(message)
    }
    /**
     * Logs query that is slow.
     */
    logQuerySlow (time, query, parameters) {
        const message = `logQuerySlow, time: ${time}, query: ${query} -- parameters: ${parameters}`
        if (this.allowLogType('warn')) logger.warn(message)
    }
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild (message) {
        if (this.allowLogType('info')) logger.info(message)
    }
    /**
     * Logs events from the migrations run process.
     */
    logMigration (message) {
        if (this.allowLogType('info')) logger.info(message)
    }
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log (level, message) {
        const logMap = {
            log: 'info',
            info: 'info',
            warn: 'warn',
            error: 'error'
        }
        const logType = logMap[level] || 'info'
        if (this.allowLogType(logType)) logger[logType](message)
    }
}
exports.OrmLog = OrmLog
