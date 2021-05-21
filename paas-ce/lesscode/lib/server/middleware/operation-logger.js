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
import createError from 'http-errors'
import OperationLogger from '../service/operation-logger'
const operateLogConf = require('../conf/operate-log')

module.exports = () => {
    return async function (ctx, next) {
        const request = ctx.request || {}
        // const response = ctx.response || {}
        const apiPath = request.path
        const apiMethod = request.method
        const apiKey = `${apiMethod}-${apiPath}`
        const locations = operateLogConf.locations
        const operationLogger = new OperationLogger(ctx)
        const logConf = locations[apiKey]
        try {
            await next()
            if (!logConf) {
                return
            }
            const ignore = logConf.ignore && logConf.ignore(request)
            if (!logConf.manualSuccess && !ignore) {
                operationLogger.success()
            }
        } catch (error) {
            if (error instanceof createError.HttpError && logConf && !logConf.manualFail) {
                operationLogger.error(error)
            }
            ctx.throw(error)
        }
    }
}
