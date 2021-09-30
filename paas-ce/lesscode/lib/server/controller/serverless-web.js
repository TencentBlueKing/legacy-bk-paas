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

import { getPreviewDataService } from '../service/preview-service'
import func from '../model/function'
import { Controller, All, Ctx } from '../decorator'

// 用于 serverless web function 在预览环境使用
@Controller('/api/serverless')
export default class ServerlessController {
    @All('/projectId/:projectId/funcCode/:funcCode')
    async serverlessWebApi (@Ctx() ctx) {
        let dataService
        try {
            const { projectId, funcCode } = ctx.params || {}
            dataService = await getPreviewDataService(projectId)

            const funcGroupList = await func.allGroupFuncDetail(projectId)
            const curFunc = funcGroupList.reduce((acc, group) => {
                const funcList = group.functionList || []
                const func = funcList.find((func) => (func.funcCode === funcCode))
                if (func) acc = func
                return acc
            }, {})
            const funcBody = curFunc.funcBody || ''

            const Fn = Function
            const asyncFunction = new Fn('return Object.getPrototypeOf(async function(){}).constructor')()
            return await asyncFunction('ctx', 'dataService', funcBody)(ctx, dataService)
        } catch (error) {
            throw error
        } finally {
            if (dataService) await dataService.close()
        }
    }
}
