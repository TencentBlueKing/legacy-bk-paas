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
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    PathParams,
    BodyParams,
    QueryParams,
    OutputJson
} from '../decorator'
import dataService from '../service/data-service'
 
@Controller('/api/data-source')
export default class DataSourceController {
    // 获取某张表下数据
    @OutputJson()
    @Get('/user/projectId/:projectId/tableName/:tableName')
    async getPerviewTableData (
        @PathParams({ name: 'tableName', require: true }) tableFileName,
        @PathParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'pageSize' }) pageSize,
        @QueryParams({ name: 'page' }) page
    ) {
        const queryParams = {
            tableFileName,
            page,
            pageSize,
            order: {
                id: 'DESC'
            },
            query: {}
        }
        const result = page && pageSize
            ? await dataService.getByPage(queryParams)
            : await dataService.get(tableFileName, {})
        return result
    }
 
    // 新增数据
    @OutputJson()
    @Post('/user/projectId/:projectId/tableName/:tableName')
    async addPerviewTableData (
         @PathParams({ name: 'tableName', require: true }) tableName,
         @BodyParams() data
    ) {
        const result = await dataService.add(tableName, data)
        return result
    }
 
    // 用户在预览环境更新数据
    @OutputJson()
    @Put('/user/projectId/:projectId/tableName/:tableName')
    async updatePerviewTableData (
         @PathParams({ name: 'tableName', require: true }) tableName,
         @BodyParams() data
    ) {
        const result = await dataService.update(tableName, data)
        return result
    }
 
    // 删除数据
    @OutputJson()
    @Delete('/user/projectId/:projectId/tableName/:tableName')
    async deletePerviewTableData (
         @PathParams({ name: 'tableName', require: true }) tableName,
         @QueryParams({ name: 'id', require: true }) id
    ) {
        const result = await dataService.delete(tableName, id)
        return result
    }
}
