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
import dataService from '../service/data-service'
import {
    getPreviewDataService
} from '../service/preview-db-service'
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    PathParams,
    BodyParams,
    QueryParams
} from '../decorator'

@Controller('/api/common')
export default class CommonController {
    // 获取数据
    @Get('/data/tableName/:tableName')
    async getTableData (
        @PathParams({ name: 'tableName', require: true }) tableFileName,
        @QueryParams({ name: 'pageSize', default: 10 }) pageSize,
        @QueryParams({ name: 'page', require: true }) page
    ) {
        const queryParams = {
            tableFileName,
            page,
            pageSize
        }
        return dataService.getByPage(queryParams)
    }

    // 新增数据
    @Post('/data/tableName/:tableName')
    async addTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @BodyParams() data
    ) {
        const dataService = await getPreviewDataService(projectId)
        const result = await dataService.add(tableName, data)
        await dataService.close()
        return result
    }

    // 更新数据
    @Put('/data/tableName/:tableName')
    async updateTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @BodyParams() data
    ) {
        const dataService = await getPreviewDataService(projectId)
        const result = dataService.update(tableName, data)
        await dataService.close()
        return result
    }

    // 删除数据
    @Delete('/data/tableName/:tableName')
    async deleteTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'id', require: true }) id
    ) {
        const dataService = await getPreviewDataService(projectId)
        const result = await dataService.delete(tableName, id)
        await dataService.close()
        return result
    }
}
