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

import { getAll, addVariable, editVariable, deleteVariable, findById } from '../model/variable.js'
import { updateVariableRelation } from '../model/variable-relation'
import fileService from '../utils/file-service/index'
import { checkFuncEslint } from '../util'

const variable = {
    async uploadImage (ctx) {
        try {
            const session = ctx.session || {}
            const userInfo = session.userInfo || {}
            const file = ctx.request.files || {}
            const uploadFile = file.upload_file || {}
            const params = {
                filePath: uploadFile.path,
                fileName: uploadFile.name,
                fileType: uploadFile.type,
                uploadKey: userInfo.username + uploadFile.size,
                ACL: 'public-read'
            }
            const res = await fileService.uploadImage(params)
            ctx.send({
                code: 0,
                message: 'success',
                data: res.Location
            })
        } catch (error) {
            ctx.throwError({
                message: error.message
            })
        }
    },

    async getAllVariable (ctx) {
        try {
            const query = ctx.request.query || {}
            const data = await getAll(query)
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

    async addVariable (ctx) {
        try {
            const body = ctx.request.body || {}
            const { valueType, defaultValue } = body
            if (valueType === 6) {
                const func = {
                    funcBody: (defaultValue || {}).all || ''
                }
                const errMessage = await checkFuncEslint(func)
                if (errMessage) {
                    throw new global.BusinessError(errMessage)
                }
            }
            const data = await addVariable(body)
            await updateVariableRelation(data)
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            ctx.throwError(err)
        }
    },

    async editVariable (ctx) {
        try {
            const body = ctx.request.body || {}
            const { valueType, defaultValue } = body
            if (valueType === 6) {
                const func = {
                    funcBody: (defaultValue || {}).all || ''
                }
                const errMessage = await checkFuncEslint(func)
                if (errMessage) {
                    throw new global.BusinessError(errMessage)
                }
            }
            const data = await editVariable(body)
            await updateVariableRelation(data)
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            ctx.throwError(err)
        }
    },

    async deleteVariable (ctx) {
        try {
            const query = ctx.request.query || {}
            // 权限
            const record = await findById(query.id)
            const userInfo = ctx.session.userInfo || {}
            ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
            if (!ctx.hasPerm) return

            const data = await deleteVariable(query.id)
            await updateVariableRelation(data)
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

module.exports = variable
