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
import { getGroupList, addFuncGroup, editFuncGroups, deleteFuncGroup, addFunction, getFuncList, editFunction, deleteFunction, getFuncRelatePageList } from '../model/function'

module.exports = {
    async getAllGroupFunc (ctx) {
        try {
            const query = ctx.request.query || {}
            const projectId = query.projectId
            const groupList = await getGroupList(projectId, '')
            const groupIds = groupList.map(x => x.id)
            let allFuncList = []
            if (groupIds.length) allFuncList = await getFuncList(groupIds, '')
            const funcIds = allFuncList.map(x => x.id)
            let pageList = []
            if (funcIds.length) pageList = await getFuncRelatePageList(funcIds)
            groupList.forEach((group) => {
                const functionList = allFuncList.filter((func) => (func.funcGroupId === group.id))
                group.functionList = functionList.map((func) => {
                    const pages = pageList.filter(x => x.funcId === func.id)
                    func.pages = pages
                    func.funcParams = (func.funcParams || '').split(',').filter(x => x !== '')
                    return func
                })
            })
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
        try {
            const postData = ctx.request.body
            const data = await addFuncGroup(postData)
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

    async editFuncGroups (ctx) {
        try {
            const postData = ctx.request.body
            const data = await editFuncGroups(postData)
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

    async deleteFuncGroup (ctx) {
        try {
            const query = ctx.request.query || {}
            const data = await deleteFuncGroup(query)
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

    async addFunction (ctx) {
        try {
            const postData = ctx.request.body
            const data = await addFunction(postData)
            data.funcParams = data.funcParams.split(',').filter(x => x !== '')
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
        try {
            const postData = ctx.request.body
            const data = await editFunction([postData])
            data.forEach((func) => {
                func.funcParams = func.funcParams.split(',').filter(x => x !== '')
            })
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

    async deleteFunction (ctx) {
        try {
            const query = ctx.request.query || {}
            const id = query.id
            const data = await deleteFunction(id)
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
    }
}
