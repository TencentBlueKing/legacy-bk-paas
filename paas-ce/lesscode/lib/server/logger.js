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

const IS_DEV = process.env.NODE_ENV === 'development'

log4js.configure({
    appenders: {
        access: IS_DEV
            ? { type: 'console' }
            : {
                type: 'dateFile',
                // 生成文件的规则
                pattern: '-yyyy-MM-dd.log',
                // 生成文件名
                filename: resolve(__dirname, '../../logs', 'access.log')
            },
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: resolve(__dirname, '../../logs', 'application.log')
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'all' },
        dev: { appenders: ['out'], level: 'all' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'WARN' }
    }
})

/**
 * access 级别的日志
 */
exports.accessLogger = () => {
    return log4js.koaLogger(log4js.getLogger('access'))
}

/**
 * application 级别的日志
 */
exports.applicationLogger = log4js.getLogger('application')

/**
 * dev 级别的日志
 */
exports.devLogger = log4js.getLogger('dev')
