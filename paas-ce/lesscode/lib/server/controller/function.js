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
import { allGroupFuncDetail, getGroupList, addFuncGroup, editFuncGroups, deleteFuncGroup, addFunction, getFuncList, editFunction, deleteFunction, getFuncRelatePageList, getFuncGroupById, getFuncById } from '../model/function'
import OperationLogger from '../service/operation-logger'
const { checkFuncEslint } = require('../util')

module.exports = {
    async getAllGroupFunc (ctx) {
        try {
            const query = ctx.request.query || {}
            const projectId = query.projectId
            const groupList = await allGroupFuncDetail(projectId)
            ctx.send({
                code: 0,
                message: 'success',
                data: groupList
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getGroupList (ctx) {
        try {
            const query = ctx.request.query || {}
            const projectId = query.projectId
            const groupName = query.searchGroupStr
            const data = await getGroupList(projectId, groupName)
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async addFuncGroup (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const postData = ctx.request.body
            const data = await addFuncGroup(postData)
            operationLogger.success({
                operateTarget: `分类名称：${postData.inputStr}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `分类名称：${ctx.request.body.inputStr}`
            })
            ctx.throwError({
                message: err.message
            })
        }
    },

    async editFuncGroups (ctx) {
        const operationLogger = new OperationLogger(ctx)
        const postData = ctx.request.body
        const group = postData[0]
        const projectId = group.projectId
        let operateTarget = ''
        if (group) {
            operateTarget = `分类名称：${group.groupName}`
        }

        try {
            const data = await editFuncGroups(postData)

            operationLogger.success({ projectId, operateTarget })

            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, { projectId, operateTarget })
            ctx.throwError({
                message: err.message
            })
        }
    },

    async deleteFuncGroup (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const query = ctx.request.query || {}
            // 权限
            const record = await getFuncGroupById(query.id)
            const userInfo = ctx.session.userInfo || {}
            ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
            if (!ctx.hasPerm) return

            const data = await deleteFuncGroup(query)
            operationLogger.success({
                projectId: query.projectId,
                operateTarget: `分类名称：${query.name}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, {
                projectId: ctx.request.query.projectId,
                operateTarget: `分类名称：${ctx.request.query.name}`
            })
            ctx.throwError({
                message: err.message
            })
        }
    },

    async bulkAddFunction (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const { funcList, varWhere } = ctx.request.body
            // 使用eslint做检查
            let errMessage = ''
            const checkFunc = async (func) => {
                errMessage = await checkFuncEslint(func)
            }
            await Promise.all(funcList.map(func => checkFunc(func)))
            if (errMessage) {
                ctx.throwBusinessError(errMessage)
                // throw new global.BusinessError(errMessage)
            }
            await addFunction(funcList, varWhere)
            operationLogger.success({
                operateTarget: '批量添加函数'
            })
            ctx.send({
                code: 0,
                message: 'success'
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: '批量添加函数'
            })
            ctx.throwError(err)
        }
    },

    async addFunction (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const { func, varWhere } = ctx.request.body
            // 使用eslint做检查
            const errMessage = await checkFuncEslint(func)
            if (errMessage) {
                // throw new global.BusinessError(errMessage)
                ctx.throwBusinessError(errMessage)
            }
            const [data] = await addFunction([func], varWhere)
            data.funcParams = data.funcParams.split(',').filter(x => x !== '')
            data.remoteParams = data.remoteParams.split(',').filter(x => x !== '')
            operationLogger.success({
                operateTarget: `函数名称：${func.funcName}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `函数名称：${ctx.request.body.funcName}`
            })
            ctx.throwError(err)
        }
    },

    async getFuncList (ctx) {
        try {
            const query = ctx.request.query || {}
            const id = query.id
            const funcName = query.funcName
            const funcList = await getFuncList([id], funcName)
            const funcIds = funcList.map(x => x.id)
            let pageList = []
            if (funcIds.length) pageList = await getFuncRelatePageList(funcIds)
            funcList.forEach((func) => {
                const pages = pageList.filter(x => x.funcId === func.id)
                func.pages = pages
                func.funcParams = func.funcParams.split(',').filter(x => x !== '')
                func.remoteParams = func.remoteParams.split(',').filter(x => x !== '')
            })
            ctx.send({
                code: 0,
                message: 'success',
                data: funcList
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async editFunction (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const { func, varWhere } = ctx.request.body
            // 使用eslint做检查
            const errMessage = await checkFuncEslint(func)
            if (errMessage) {
                // throw new global.BusinessError(errMessage)
                ctx.throwBusinessError(errMessage)
            }
            const data = await editFunction([func], varWhere)
            data.forEach((func) => {
                func.funcParams = func.funcParams.split(',').filter(x => x !== '')
                func.remoteParams = func.remoteParams.split(',').filter(x => x !== '')
            })
            operationLogger.success({
                operateTarget: `函数名称：${func.funcName}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, {
                operateTarget: `函数名称：${ctx.request.body.funcName}`
            })
            ctx.throwError(err)
        }
    },

    async deleteFunction (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const query = ctx.request.query || {}
            const id = query.id

            // 权限
            const record = await getFuncById(id)
            const userInfo = ctx.session.userInfo || {}
            ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
            if (!ctx.hasPerm) return

            const data = await deleteFunction(id)
            operationLogger.success({
                projectId: query.projectId,
                operateTarget: `函数名称：${query.funcName}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            operationLogger.error(err, {
                projectId: ctx.request.query.projectId,
                operateTarget: `函数名称：${ctx.request.query.funcName}`
            })
            ctx.throwError({
                message: err.message
            })
        }
    },

    async generateToken (ctx) {
        
    },

    async getTokenList (ctx) {
    
    }
}
