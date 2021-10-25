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
import dataTableModifyRecord from '../model/data-table-modify-record'
import OnlineDBService from '../service/online-db-service'
import DBEngineService from '../service/db-engine-service'
import {
    getPreviewDbEngine,
    getPreviewDbConfig
} from '../service/preview-db-service'
import {
    Controller,
    Get,
    Post,
    Put,
    BodyParams,
    QueryParams,
    DeleteAuthorization
} from '../decorator'
const util = require('../util')

@Controller('/api/data-source')
export default class DataSourceController {
    // 开启数据源，需要同步创建项目下的数据库和用户
    @Post('/enable')
    async enable (@BodyParams() body) {
        const { projectId } = body
        const projectInfo = await dataService.findOne('project', { id: projectId })
        projectInfo.isEnableDataSource = 1

        const dbInfo = {
            projectId,
            dbName: projectInfo.projectCode,
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
            await pool.query('FLUSH PRIVILEGES;')
        })

        // 写入数据库
        return Promise.all([
            dataService.update('project', projectInfo),
            dataService.add('preview-db', dbInfo)
        ])
    }

    // 获取项目下的所有表结构
    @Get('/getTableList')
    async getTableList (
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'pageSize', default: 10 }) pageSize,
        @QueryParams({ name: 'page', default: 1 }) page
    ) {
        const queryParams = {
            projectId
        }
        const datas = await dataService.get('data-table', queryParams)
        const sortData = datas.sort((a, b) => (b.updateTime - a.updateTime))
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize
        const filterData = sortData.slice(startIndex, endIndex)
        const list = filterData.map((data) => {
            data.columns = JSON.parse(data.columns)
            return data
        })
        return {
            list,
            count: datas.length
        }
    }

    // 获取表详情
    @Get('/getTableDetail')
    async getTableDetail (
        @QueryParams({ name: 'id' }) id
    ) {
        const queryParams = { id }
        const data = await dataService.findOne('data-table', queryParams)
        data.columns = JSON.parse(data.columns)
        return data
    }

    // 获取表详情
    @Post('/tableRecordList')
    tableRecordList (
        @BodyParams({ name: 'id' }) id,
        @BodyParams({ name: 'createUser' }) createUser,
        @BodyParams({ name: 'timeRange', default: [] }) timeRange
    ) {
        timeRange = timeRange.filter(v => v)
        const queryParams = {
            startTime: timeRange[0],
            endTime: timeRange[1],
            createUser,
            query: {
                tableId: id
            }
        }
        return dataTableModifyRecord.getListByTime(queryParams)
    }

    // 新增表结构
    @Post('/addTable')
    async addTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        dataTable.columns = JSON.stringify(dataTable.columns)
        const data = await dataService.add('data-table', dataTable)
        const tableModifyRecord = {
            ...record,
            tableId: data.id
        }
        await dataService.add('data-table-modify-record', tableModifyRecord)
        return data
    }

    // 修改表结构
    @Put('/updateTable')
    async updateTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        dataTable.columns = JSON.stringify(dataTable.columns)
        const data = await dataService.update('data-table', dataTable)
        await dataService.add('data-table-modify-record', record)
        return data
    }

    // 删除表结构
    @DeleteAuthorization({ perm: 'delete_variable', tableName: 'data-table', getId: ctx => ctx.request.body.id })
    @Put('/deleteTable')
    async deleteTable (
        @BodyParams({ name: 'ids', require: true }) ids,
        @BodyParams({ name: 'records', require: true }) records
    ) {
        const data = await dataService.bulkSoftDelete('data-table', ids)
        await dataService.add('data-table-modify-record', records)
        return data
    }

    // 修改线上环境数据库，包含表结构和表数据修改
    @Put('/modifyOnlineDb')
    async modifyOnlineDb (
        @BodyParams({ name: 'environment', default: 'preview' }) environment,
        @BodyParams({ name: 'projectId', require: true }) projectId,
        @BodyParams({ name: 'sql', require: true }) sql
    ) {
        const dbConfigMap = {
            preview: getPreviewDbConfig
        }
        const previewDbConfig = await dbConfigMap[environment](projectId)
        const dbEngine = new DBEngineService(previewDbConfig)
        return dbEngine.execMultSql(sql)
    }

    // 获取线上表列表
    @Get('/getOnlineTableList')
    async getOnlineTableList (
        @QueryParams({ name: 'environment', require: true }) environment,
        @QueryParams({ name: 'projectId', require: true }) projectId
    ) {
        const dbConfigMap = {
            preview: getPreviewDbConfig
        }
        const previewDbConfig = await dbConfigMap[environment](projectId)
        const dbEngine = new DBEngineService(previewDbConfig)
        const onlineDBService = new OnlineDBService(dbEngine)
        const onlineTables = await onlineDBService.showTables()
        return onlineDBService.describeTables(onlineTables)
    }

    // 获取线上表数据
    @Get('/getOnlineTableDatas')
    async getOnlineTableDatas (
        @QueryParams({ name: 'environment', require: true }) environment,
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'tableName', require: true }) tableName,
        @QueryParams({ name: 'page', require: true }) page,
        @QueryParams({ name: 'pageSize', require: true }) pageSize
    ) {
        const dbConfigMap = {
            preview: getPreviewDbConfig
        }
        const previewDbConfig = await dbConfigMap[environment](projectId)
        const dbEngine = new DBEngineService(previewDbConfig)
        const onlineDBService = new OnlineDBService(dbEngine)
        return onlineDBService.getTableData(tableName, page, pageSize)
    }
}
