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
const util = require('../util')

// 开启数据源，需要同步创建项目下的数据库和用户
export const enable = async (ctx) => {
    try {
        const { projectId, projectCode } = ctx.request.body || {}
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
        await dataService.add('preview-db', dbInfo)

        ctx.send({
            code: 0,
            message: 'success',
            data: true
        })
    } catch (error) {
        ctx.throwError(error)
    }
}

// 修改预览环境数据库，包含表结构和表数据修改
export const modifyPreviewDb = async (ctx) => {
    try {
        const { projectId, sql } = ctx.request.body || {}
        const previewDbEngine = await getPreviewDbEngine(projectId)
        await previewDbEngine.execMultSql(sql)

        ctx.send({
            code: 0,
            message: 'success',
            data: true
        })
    } catch (error) {
        ctx.throwError(error)
    }
}

// 获取项目下的所有表结构
export const getTableList = async (ctx) => {
    try {
        const { projectId } = ctx.request.query || {}
        const data = await dataService.get('data-table', { projectId })
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.throwError(error)
    }
}

// 新增表结构
export const addTable = async (ctx) => {
    try {
        const { dataTable, record } = ctx.request.body || {}
        const data = await dataService.add('data-table', dataTable)
        await dataService.add('data-table-modify-record', record)
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.throwError(error)
    }
}

// 修改表结构
export const updateTable = async (ctx) => {
    try {
        const { dataTable, record } = ctx.request.body || {}
        const data = await dataService.update('data-table', dataTable)
        await dataService.update('data-table-modify-record', record)
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.throwError(error)
    }
}

// 获取sql变更历史
export const getSqlRecord = async (ctx) => {
    try {
        const { projectId } = ctx.request.query || {}
        const data = await dataTableModifyRecord.getListByTime({ projectId })
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.throwError(error)
    }
}
