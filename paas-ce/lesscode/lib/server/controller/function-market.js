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

import OperationLogger from '../service/operation-logger'
import { checkFuncEslint } from '../util'
import { addFunction } from '../model/function'
import funcMarket from '../model/func-market'
import projectFuncMarket from '../model/project-func-market'

module.exports = {
    async getFuncList (ctx) {
        try {
            const data = await funcMarket.getList()

            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError(err)
        }
    },

    async addFunc (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const postData = ctx.request.body
            // 使用eslint做检查
            const errMessage = await checkFuncEslint(postData)
            if (errMessage) {
                ctx.throwBusinessError(errMessage)
            }
            const data = await funcMarket.add(postData)
            operationLogger.success({
                operateTarget: `市场函数名称: ${data.funcName}`
            })
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `市场函数名称：${ctx.request.body.funcName}`
            })
            ctx.throwError(err)
        }
    },

    async updateFunc (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const postData = ctx.request.body
            // 使用eslint做检查
            const errMessage = await checkFuncEslint(postData)
            if (errMessage) {
                ctx.throwBusinessError(errMessage)
            }
            const data = await funcMarket.update(postData)
            operationLogger.success({
                operateTarget: `市场函数名称: ${data.funcName}`
            })
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `市场函数名称：${ctx.request.body.funcName}`
            })
            ctx.throwError(err)
        }
    },

    async deleteFunc (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const query = ctx.request.query || {}
            const id = query.id
            const data = await funcMarket.delete(id)
            operationLogger.success({
                operateTarget: `市场函数名称: ${data.funcName}`
            })
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `市场函数名称：${ctx.request.body.funcName}`
            })
            ctx.throwError(err)
        }
    },

    async addFuncToProject (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const { func, projectId, funcMarketId } = ctx.request.body
            // 使用eslint做检查
            const errMessage = await checkFuncEslint(func)
            if (errMessage) {
                ctx.throwBusinessError(errMessage)
            }
            const [funcData] = await addFunction([func])

            const relationData = {
                funcMarketId,
                projectId,
                projectFuncId: funcData.id
            }
            const data = await projectFuncMarket.add(relationData)

            operationLogger.success({
                operateTarget: `从函数市场添加函数: ${funcData.funcName}`
            })
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (error) {
            operationLogger.error(error, {
                operateTarget: `从函数市场添加函数`
            })
            ctx.throwError(error)
        }
    }
}
