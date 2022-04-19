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
import { LCDataService, TABLE_FILE_NAME } from '../service/data-service'
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    BodyParams,
    QueryParams,
    PlatformAdminAuthorization,
    ProjectAuthorization,
    OutputJson
} from '../decorator'
import {
    checkFuncBody,
    doubleCheckFunction,
    handleRelation,
    handleFunctionIntoDb,
    handleFunctionOutDb
} from '../service/function'

/**
 * 检查函数 name 是否重复
 * @param {*} functionData 待检查数据
 */
const doubleCheck = async (functionData) => {
    // 获取全部市场数据
    const { list } = await LCDataService.get({
        tableFileName: TABLE_FILE_NAME.FUNC_MARKET,
        query: {
            deleteFlag: 0
        }
    })
    // 构建 map
    const nameMap = {}
    list.forEach((item) => {
        nameMap[item.funcName] = item.id
    })
    // 校验
    const checkList = Array.isArray(functionData)
        ? functionData
        : [functionData]
    checkList.forEach(({ funcName, id }) => {
        if (!/^[A-Za-z_][A-Za-z]*[A-Za-z_]?$/.test(funcName)) {
            throw new global.BusinessError(`函数名称由大小写英文字母组成，开头和结尾还可以是下划线。函数名称【${funcName}】不符合规则，请修改后再试`, 400, 400)
        }
        if (
            Reflect.has(nameMap, funcName)
            && nameMap[funcName] !== id
        ) {
            throw new global.BusinessError(`已存在函数名称为【${funcName}】的函数，请修改后再试`, 400, 400)
        }
    })
}

@Controller('/api/function-market')
export default class FunctionMarketController {
    @OutputJson()
    @Get('/getFunctionList')
    async getFunctionList () {
        const { list } = await LCDataService.get({
            tableFileName: TABLE_FILE_NAME.FUNC_MARKET,
            query: {
                deleteFlag: 0
            }
        })
        return handleFunctionOutDb(list)
    }

    @OutputJson()
    @PlatformAdminAuthorization()
    @Post('/createFunction')
    async createFunction (
        @BodyParams() functionData
    ) {
        // 检查 eslint
        await checkFuncBody(functionData)
        // 检查 name 重复
        await doubleCheck(functionData)
        // 入库
        return LCDataService.add(
            TABLE_FILE_NAME.FUNC_MARKET,
            handleFunctionIntoDb(functionData)
        )
    }

    @OutputJson()
    @PlatformAdminAuthorization()
    @Put('/updateFunction')
    async updateFunction (
        @BodyParams() functionData
    ) {
        // 检查 eslint
        await checkFuncBody(functionData)
        // 检查 name 重复
        await doubleCheck(functionData)
        // 更新
        return LCDataService.update(
            TABLE_FILE_NAME.FUNC_MARKET,
            handleFunctionIntoDb(functionData)
        )
    }

    @OutputJson()
    @PlatformAdminAuthorization()
    @Delete('/deleteFunction')
    deleteFunction (
        @QueryParams({ name: 'id', require: true }) id
    ) {
        return LCDataService.delete(TABLE_FILE_NAME.FUNC_MARKET, id)
    }

    @OutputJson()
    @ProjectAuthorization({
        getId: ctx => ctx.request.body.functionData.projectId
    })
    @Post('/createFunctionFromMarket')
    async createFunctionFromMarket (
        @BodyParams({ name: 'functionData', require: true }) functionData,
        @BodyParams({ name: 'funcMarketId', require: true }) funcMarketId
    ) {
        // 检查 code name 是否重复
        await doubleCheckFunction(functionData, functionData.projectId, functionData.versionId)
        // eslint 检查
        await checkFuncBody(functionData)
        // 入库事务
        await LCDataService.transaction(async (transactionalEntityHelper) => {
            // 插入数据库
            const result = await transactionalEntityHelper.add(TABLE_FILE_NAME.FUNC, handleFunctionIntoDb(functionData))
            // 处理关联关系
            await handleRelation(functionData, functionData.projectId, functionData.versionId)
            // 记录关联关系
            await transactionalEntityHelper.add(
                TABLE_FILE_NAME.PROJECT_FUNC_MARKET,
                {
                    funcMarketId,
                    projectId: functionData.projectId,
                    projectFuncId: result.id
                }
            )
        })
        return functionData
    }

    @OutputJson()
    @PlatformAdminAuthorization()
    @Post('/bulkCreateFunction')
    async bulkCreateFunction (
        @BodyParams() marketFuncList
    ) {
        // 检查导入的函数本身是否重复
        const nameMap = {}
        marketFuncList.forEach(({ funcName }) => {
            if (nameMap[funcName]) {
                throw new global.BusinessError(`批量添加的函数中，存在重复的函数名【${funcName}】，请修改后再试`, 400, 400)
            } else {
                nameMap[funcName] = true
            }
        })
        // 检查 eslint
        await checkFuncBody(marketFuncList)
        // 检查 name 重复
        await doubleCheck(marketFuncList)
        // 入库
        return LCDataService.bulkAdd(
            TABLE_FILE_NAME.FUNC_MARKET,
            handleFunctionIntoDb(marketFuncList)
        )
    }
}
