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
import operateLogModel from '../model/operate-log'
const operateLogConf = require('../conf/operate-log')
const { PUT_PAGE_UPDATE } = operateLogConf

function getType (obj) {
    return Object.prototype.toString.call(obj)
}

function isFunction (obj) {
    return getType(obj) === '[object Function]'
}

function isString (obj) {
    return getType(obj) === '[object String]'
}

function isObject (obj) {
    return getType(obj) === '[object Object]'
}

function isObjectError (obj) {
    return getType(obj) === '[object Error]'
}

class OperationLogger {
    constructor (ctx, options = {}) {
        this.ctx = ctx
        this.options = options
    }

    async error (error, data = {}) {
        const result = await this.log({
            ...data,
            operateStatus: 0
        }, error)
        return result
    }

    async success (data = {}) {
        const result = await this.log({
            ...data,
            operateStatus: 1
        })
        return result
    }

    async log (data = {}, error = {}) {
        const request = this.ctx.request || {}
        const response = this.ctx.response || {}
        const currentUserId = this.ctx.session.userInfo.id

        const logConf = this.getLogConf(request)

        if (!logConf) {
            return
        }

        const operateCode = logConf.code
        const operateCodeText = logConf.codeText
        const operateUserId = currentUserId
        const operateObj = operateCode.slice(operateCode.indexOf('_') + 1)
        const operateTarget = this.getOperateTarget(request, response, logConf.target)
        const operateRaw = this.getOperateRaw(request, response)
        const projectId = this.getProjectId(logConf)
        const operateDesc = data.operateStatus ? `${operateCodeText}成功` : `${this.getErrorMessage(error)}`
        const logData = {
            projectId,
            operateObj,
            operateCode,
            operateCodeText,
            operateUserId,
            operateTarget,
            operateRaw,
            operateDesc,
            operateTime: new Date()
        }
        const operateLog = { ...logData, ...data }
        operateLog.operateTarget = operateLog.operateTarget || 'unknown'

        const result = await operateLogModel.add(operateLog)

        return result
    }

    getLogConf (request) {
        if (this.options.apiKey) {
            return operateLogConf.locations[this.options.apiKey]
        }

        const apiKey = this.getApiKey(request)

        const locations = operateLogConf.locations
        const logConf = locations[apiKey]

        return logConf
    }

    getOperateTarget (request, response, target) {
        if (isFunction(target)) {
            return target(request, response)
        }
        return target || 'unknown'
    }

    getOperateRaw (request, response) {
        const apiKey = this.getApiKey(request)
        if (apiKey === PUT_PAGE_UPDATE) {
            if (request.body.pageData) {
                request.body.pageData.previewImg = 'data:image/...'
            }
        }
        const operateRaw = {
            req: {
                url: request.url,
                method: request.method,
                query: request.query,
                body: request.body
            },
            res: this.getBodyJSON(response.body)
        }
        return JSON.stringify(operateRaw)
    }

    getProjectId (conf) {
        const { request, response } = this.ctx
        let projectId = ['POST', 'PUT', 'DELETE'].includes(request.method)
            ? (request.body.projectId || request.body.belongProjectId || request.body.id)
            : (request.query.projectId || request.query.belongProjectId || request.query.id)

        if (!projectId && request.query) {
            projectId = request.query.belongProjectId
        }
        if (!projectId && request.body) {
            projectId = request.body.belongProjectId
        }

        if (conf.code === 'create_project') {
            projectId = this.getBodyJSON(response.body).data
        }

        return projectId
    }

    getErrorMessage (error) {
        if (isString(error)) {
            return error
        }
        if (isObject(error) || isObjectError(error)) {
            return error.message || error.msg
        }
        return 'unknown'
    }

    getBodyJSON (resBody) {
        let body = {}
        try {
            body = JSON.parse(resBody)
        } catch (e) {
            // ignore
        }
        return body
    }

    getApiKey (request) {
        const apiPath = request.path
        const apiMethod = request.method
        const apiKey = `${apiMethod}-${apiPath}`
        return apiKey
    }
}

export default OperationLogger
