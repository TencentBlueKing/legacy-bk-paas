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
// import OperationLogger from '../service/operation-logger'
import projectVersionService from '../service/project-version'
const { CODE } = require('../util')

module.exports = {
    async create (ctx) {
        const { projectId, version, versionLog } = ctx.request.body
        try {
            const has = await projectVersionService.has(projectId, version)
            if (has) {
                ctx.throw(400, '项目版本已存在', { code: CODE.BIZ.PROJECT_VERSION_EXISTED })
            }

            const newVersionId = await projectVersionService.create({
                projectId,
                version,
                versionLog
            })

            ctx.send({
                code: 0,
                data: newVersionId,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async update (ctx) {
        const { projectId, id: versionId, ...editData } = ctx.request.body
        try {
            const result = await projectVersionService.update(versionId, editData)
            ctx.send({
                code: 0,
                data: result,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async list (ctx) {
        const { projectId } = ctx.request.query
        try {
            const list = await projectVersionService.getList(projectId)
            ctx.send({
                code: 0,
                data: list,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async optionList (ctx) {
        const { projectId } = ctx.request.query
        try {
            const list = await projectVersionService.getOptionList(projectId)
            ctx.send({
                code: 0,
                data: list,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async releaseEnvMap (ctx) {
        const { versions } = ctx.request.body
        try {
            const envMap = await projectVersionService.getVersionReleaseEnvMap(versions)
            ctx.send({
                code: 0,
                data: envMap,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async recover (ctx) {
        const { id: versionId } = ctx.request.body
        try {
            await projectVersionService.update(versionId, {
                archiveFlag: 0
            })
            ctx.send({
                code: 0,
                data: versionId,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async archive (ctx) {
        const { id: versionId } = ctx.request.body
        try {
            await projectVersionService.update(versionId, {
                archiveFlag: 1
            })
            ctx.send({
                code: 0,
                data: versionId,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    }
}
