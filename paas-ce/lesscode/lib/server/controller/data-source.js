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
import { getPreviewDbEngine } from '../service/preview-service'
import dataTableModifyRecord from '../model/data-table-modify-record'
import { Controller, Get, Post, Put, BodyParams, QueryParams, DeleteAuthorization } from '../decorator'
const util = require('../util')

@Controller('/api/data-source')
export default class DataSourceController {
    // 开启数据源，需要同步创建项目下的数据库和用户
    @Post('/enable')
    async enable (@BodyParams() body) {
        const { projectId, projectCode } = body
        const dbInfo = {
            projectId,
            dbName: projectCode,
            userName: util.uuid(),
            passWord: util.uuid()
        }

        // 创建用于预览的DB
        const previewDbEngine = await getPreviewDbEngine()
        await previewDbEngine.execCb(async (pool) => {
            // 创建项目对应的预览数据库
            await pool.query(`CREATE DATABASE ${dbInfo.dbName};`)
            // 创建用户并授权对应的库
            await pool.query(`CREATE USER '${dbInfo.userName}'@'%' IDENTIFIED BY '${dbInfo.passWord}';`)
            await pool.query(`GRANT ALL ON ${dbInfo.dbName}.* TO '${dbInfo.userName}'@'%';`)
            await pool.query(`FLUSH PRIVILEGES;`)
        })
    
        // 写入数据库
        return dataService.add('preview-db', dbInfo)
    }

    // 修改预览环境数据库，包含表结构和表数据修改
    @Put('/modifyPreviewDb')
    async modifyPreviewDb (@BodyParams() body) {
        const { projectId, sql } = body
        const previewDbEngine = await getPreviewDbEngine(projectId)
        await previewDbEngine.execMultSql(sql)
        return true
    }

    // 获取项目下的所有表结构
    @Get('/getTableList')
    async getTableList (
        @QueryParams({ name: 'projectId', require: true }) projectId
    ) {
        return dataService.get('data-table', { projectId })
    }

    // 新增表结构
    @Post('/addTable')
    async addTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        const data = await dataService.add('data-table', dataTable)
        await dataService.add('data-table-modify-record', record)
        return data
    }

    // 修改表结构
    @Put('/updateTable')
    async updateTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        const data = await dataService.update('data-table', dataTable)
        await dataService.add('data-table-modify-record', record)
        return data
    }

    // 删除表结构
    @DeleteAuthorization({ perm: 'delete_variable', tableName: 'data-table', getId: ctx => ctx.request.body.id })
    @Put('/deleteTable')
    async deleteTable (
        @BodyParams({ name: 'id', require: true }) id,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        const data = await dataService.delete('data-table', id)
        await dataService.add('data-table-modify-record', record)
        return data
    }

    // 获取sql变更历史
    @Get('/getSqlRecord')
    async getSqlRecord (
        @QueryParams({ name: 'projectId', require: true }) projectId
    ) {
        return dataTableModifyRecord.getListByTime({ projectId })
    }
}
