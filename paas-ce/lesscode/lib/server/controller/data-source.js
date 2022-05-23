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
    LCDataService,
    TABLE_FILE_NAME
} from '../service/data-service'
import dataTableModifyRecord from '../model/data-table-modify-record'
import OnlineDBService from '../service/online-db-service'
import DBEngineService from '../service/db-engine-service'
import {
    enablePerviewDb,
    getPreviewDbConfig,
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
    QueryParams,
    DeleteAuthorization,
    ProjectAuthorization,
    OutputJson,
    OutputZip
} from '../decorator'
import {
    generateExportDatas,
    generateExportStruct
} from '../../shared/data-source'
import {
    PERM_CODE
} from '../../shared/perm/constant.js'

@Controller('/api/data-source')
export default class DataSourceController {
    // 开启数据源，需要同步创建项目下的数据库和用户
    @OutputJson()
    @Post('/enable')
    async enable (@BodyParams() body) {
        const { projectId } = body
        const projectInfo = await LCDataService.findOne(TABLE_FILE_NAME.PROJECT, { id: projectId, deleteFlag: 0 })
        if (projectInfo.isEnableDataSource <= 0) {
            // 如果未开启，则开启
            projectInfo.isEnableDataSource = 1
            await enablePerviewDb(projectId, projectInfo.projectCode + projectInfo.id)
            await LCDataService.update(TABLE_FILE_NAME.PROJECT, projectInfo)
        } else {
            throw new Error('已开启数据源的项目，不能重复开启！')
        }
    }

    // 获取项目下的所有表结构
    @OutputJson()
    @Get('/getTableList')
    async getTableList (
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'pageSize' }) pageSize,
        @QueryParams({ name: 'page' }) page
    ) {
        const result = await LCDataService.get({
            tableFileName: TABLE_FILE_NAME.DATA_TABLE,
            page,
            pageSize,
            query: {
                projectId,
                deleteFlag: 0
            }
        })
        result.list.forEach((data) => {
            data.columns = JSON.parse(data.columns)
            return data
        })
        return result
    }

    // 获取表详情
    @OutputJson()
    @Get('/getTableDetail')
    async getTableDetail (
        @QueryParams({ name: 'id' }) id
    ) {
        const queryParams = { id, deleteFlag: 0 }
        const data = await LCDataService.findOne(TABLE_FILE_NAME.DATA_TABLE, queryParams)
        data.columns = JSON.parse(data.columns)
        return data
    }

    // 获取表详情
    @OutputJson()
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
    @OutputJson()
    @Post('/addTable')
    async addTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        dataTable.columns = JSON.stringify(dataTable.columns)
        const data = await LCDataService.add(TABLE_FILE_NAME.DATA_TABLE, dataTable)
        const tableModifyRecord = {
            ...record,
            tableId: data.id
        }
        await LCDataService.add(TABLE_FILE_NAME.DATA_TABLE_MODIFY_RECORD, tableModifyRecord)
        return data
    }

    // 修改表结构
    @OutputJson()
    @Put('/updateTable')
    async updateTable (
        @BodyParams({ name: 'dataTable', require: true }) dataTable,
        @BodyParams({ name: 'record', require: true }) record
    ) {
        dataTable.columns = JSON.stringify(dataTable.columns)
        const data = await LCDataService.update(TABLE_FILE_NAME.DATA_TABLE, dataTable)
        await LCDataService.add(TABLE_FILE_NAME.DATA_TABLE_MODIFY_RECORD, record)
        return data
    }

    // 删除表结构
    @OutputJson()
    @DeleteAuthorization({ perm: PERM_CODE.DELETE_TABLE, tableName: TABLE_FILE_NAME.DATA_TABLE, getId: ctx => ctx.request.body.id })
    @Put('/deleteTable')
    async deleteTable (
        @BodyParams({ name: 'ids', require: true }) ids,
        @BodyParams({ name: 'records', require: true }) records
    ) {
        const data = await LCDataService.bulkSoftDelete(TABLE_FILE_NAME.DATA_TABLE, ids)
        await LCDataService.add(TABLE_FILE_NAME.DATA_TABLE_MODIFY_RECORD, records)
        return data
    }

    // 修改线上环境数据库，包含表结构和表数据修改
    @OutputJson()
    @ProjectAuthorization({ getId: ctx => ctx.request.body.projectId })
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
    @OutputJson()
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
    @OutputJson()
    @Get('/getOnlineTableDatas')
    async getOnlineTableDatas (
        @QueryParams({ name: 'environment', require: true }) environment,
        @QueryParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'tableName', require: true }) tableName,
        @QueryParams({ name: 'page' }) page,
        @QueryParams({ name: 'pageSize' }) pageSize
    ) {
        const dbConfigMap = {
            preview: getPreviewDbConfig
        }
        const previewDbConfig = await dbConfigMap[environment](projectId)
        const dbEngine = new DBEngineService(previewDbConfig)
        const onlineDBService = new OnlineDBService(dbEngine)
        const result = page && pageSize
            ? await onlineDBService.getTableData(tableName, page, pageSize)
            : await onlineDBService.getTableAllData(tableName)
        return result
    }

    // 用户获取预览环境某张表下数据
    @OutputJson()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Get('/user/projectId/:projectId/tableName/:tableName')
    async getPerviewTableData (
        @PathParams({ name: 'tableName', require: true }) tableFileName,
        @PathParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'pageSize' }) pageSize,
        @QueryParams({ name: 'page' }) page
    ) {
        let dataService
        try {
            dataService = await getPreviewDataService(projectId)
            const result = await dataService.get({
                tableFileName,
                page,
                pageSize,
                order: {
                    id: 'DESC'
                },
                query: {}
            })
            return result
        } catch (error) {
            throw new global.BusinessError(error.message || error, -1, 500, error.stack)
        } finally {
            if (dataService) await dataService.close()
        }
    }

    // 用户在预览环境新增数据
    @OutputJson()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Post('/user/projectId/:projectId/tableName/:tableName')
    async addPerviewTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @PathParams({ name: 'projectId', require: true }) projectId,
        @BodyParams() data
    ) {
        let dataService
        try {
            dataService = await getPreviewDataService(projectId)
            const result = await dataService.add(tableName, data)
            return result
        } catch (error) {
            throw new global.BusinessError(error.message || error, -1, 500, error.stack)
        } finally {
            if (dataService) await dataService.close()
        }
    }

    // 用户在预览环境更新数据
    @OutputJson()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Put('/user/projectId/:projectId/tableName/:tableName')
    async updatePerviewTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @PathParams({ name: 'projectId', require: true }) projectId,
        @BodyParams() data
    ) {
        let dataService
        try {
            dataService = await getPreviewDataService(projectId)
            const result = await dataService.update(tableName, data)
            return result
        } catch (error) {
            throw new global.BusinessError(error.message || error, -1, 500, error.stack)
        } finally {
            if (dataService) await dataService.close()
        }
    }

    // 用户在预览环境删除数据
    @OutputJson()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Delete('/user/projectId/:projectId/tableName/:tableName')
    async deletePerviewTableData (
        @PathParams({ name: 'tableName', require: true }) tableName,
        @PathParams({ name: 'projectId', require: true }) projectId,
        @QueryParams({ name: 'id', require: true }) id
    ) {
        let dataService
        try {
            dataService = await getPreviewDataService(projectId)
            const result = await dataService.delete(tableName, id)
            return result
        } catch (error) {
            throw new global.BusinessError(error.message || error, -1, 500, error.stack)
        } finally {
            if (dataService) await dataService.close()
        }
    }

    // 导出项目下所有表结构
    @OutputZip()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Get('/exportStruct/projectId/:projectId/fileType/:fileType')
    async exportStruct (
        @PathParams({ name: 'projectId', require: true }) projectId,
        @PathParams({ name: 'fileType', require: true }) fileType
    ) {
        const { list = [] } = await LCDataService.get({
            tableFileName: TABLE_FILE_NAME.DATA_TABLE,
            query: {
                projectId,
                deleteFlag: 0
            }
        })
        if (list.length <= 0) {
            // 未查询到数据提示
            throw new Error('暂无表结构')
        }
        const tables = list.map((table) => {
            return {
                ...table,
                columns: JSON.parse(table.columns || '[]')
            }
        })
        const fileName = fileType === 'sql' ? `lesscode-struct-${projectId}.sql` : ''
        const zipName = `lesscode-struct-${projectId}`
        const fileList = generateExportStruct(tables, fileType, fileName)
        return { fileList, zipName }
    }

    // 导出项目下所有表数据
    @OutputZip()
    @ProjectAuthorization({ getId: ctx => ctx.params.projectId })
    @Get('/exportDatas/projectId/:projectId/fileType/:fileType/tableName/:tableName/environment/:environment')
    async exportDatas (
        @PathParams({ name: 'projectId', require: true }) projectId,
        @PathParams({ name: 'fileType', require: true }) fileType,
        @PathParams({ name: 'tableName', require: true }) tableName,
        @PathParams({ name: 'environment', require: true }) environment
    ) {
        const dbConfigMap = {
            preview: getPreviewDbConfig
        }
        const previewDbConfig = await dbConfigMap[environment](projectId)
        const dbEngine = new DBEngineService(previewDbConfig)
        const onlineDBService = new OnlineDBService(dbEngine)
        const { list } = await onlineDBService.getTableAllData(tableName)
        if (list.length <= 0) {
            // 未查询到数据提示
            throw new Error(`${tableName} 表暂无数据`)
        }
        const datas = [{ tableName, list }]
        const fileName = fileType === 'sql' ? `lesscode-data-${projectId}.sql` : ''
        const zipName = `lesscode-data-${projectId}`
        const fileList = generateExportDatas(datas, fileType, fileName)
        return { fileList, zipName }
    }
}
