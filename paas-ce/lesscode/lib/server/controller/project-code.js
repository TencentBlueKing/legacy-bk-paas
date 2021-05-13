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
import ProjectCodeModel from '../model/project-code'
import OperationLogger from '../service/operation-logger'
const fse = require('fs-extra')
const path = require('path')
const send = require('koa-send')
const compressing = require('compressing')

const DIR_PATH = '.'
const STATIC_URL = `${DIR_PATH}/lib/server/project-template/`

const ProjectCode = {
    async downloadCode (ctx) {
        const operationLogger = new OperationLogger(ctx)
        const { projectId } = ctx.request.query

        try {
            const pathName = `bklesscode-proj-${projectId}`
            await ProjectCodeModel.generateCode(projectId, pathName)

            const sourcePath = path.join(STATIC_URL, pathName)
            const targetPath = path.join(STATIC_URL, `${pathName}.zip`)
            await compressing.zip.compressDir(sourcePath, targetPath)
                .then(async () => {
                    ctx.attachment(targetPath)
                    await send(ctx, targetPath)
                    fse.remove(sourcePath)
                    fse.remove(targetPath)
                    operationLogger.success({
                        operateTarget: `项目ID：${projectId}`
                    })
                }).catch((err) => {
                    operationLogger.error(err, {
                        operateTarget: `项目ID：${projectId}`
                    })
                    console.log(err)
                })
        } catch (error) {
            operationLogger.error(error, {
                operateTarget: `项目ID：${projectId}`
            })
            ctx.throw(error)
        }
    },

    async previewCode (ctx) {
        const operationLogger = new OperationLogger(ctx)
        const { projectId } = ctx.request.query
        try {
            const data = await ProjectCodeModel.previewCode(projectId)
            operationLogger.success({
                operateTarget: `项目ID：${projectId}`
            })
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (error) {
            operationLogger.error(error, {
                operateTarget: `项目ID：${projectId}`
            })
            ctx.throw(error)
        }
    }
}

module.exports = ProjectCode
