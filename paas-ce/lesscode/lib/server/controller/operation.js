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

import { getManager } from 'typeorm'

const TIME_TYPES = ['YEAR', 'MONTH', 'DAY']
const getDateFormatDes = (type) => {
    const descriptor = {
        YEAR: "'%Y'",
        MONTH: "'%Y-%m'",
        DAY: "'%Y-%m-%d'"
    }
    return descriptor[type]
}
const isValidTimeType = (type) => {
    return TIME_TYPES.includes(type)
}

/**
 * 按分页获取用户
 * @returns 用户列表与总数
 */
export const getUserBaseList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    const where = []
    const escaped = []
    if (params.time) {
        const [timeStart, timeEnd] = params.time
        where.push(`(createTime >= ? AND createTime <= ?)`)
        escaped.push(new Date(Number(timeStart)), new Date(Number(timeEnd)))
    }

    if (params.user) {
        where.push(`username LIKE ?`)
        escaped.push(`%${params.user}%`)
    }

    const pageSize = isNaN(Number(params.pageSize)) ? 10 : Math.min(params.pageSize, 100)
    const pageCurrent = isNaN(Number(params.pageNum)) ? 1 : Math.max(params.pageNum, 1)

    let rowSql = `select * from user`
    let countSql = `select count(*) as total from user`

    if (where.length) {
        const whereCond = ` WHERE ${where.join(' AND ')}`
        rowSql += whereCond
        countSql += whereCond
    }

    rowSql += ` ORDER BY id DESC`
    rowSql += ` LIMIT ${pageSize * (pageCurrent - 1)}, ${pageSize}`

    try {
        const [list, [count]] = await Promise.all([
            manager.query(rowSql, escaped),
            manager.query(countSql, escaped)
        ])
        ctx.send({
            code: 0,
            message: 'success',
            data: [list, Number(count.total)]
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取用户项目数，未排除 demo 项目
 */
export const getUserProjectCountList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()
    try {
        const result = await manager.query(
            `select count(*) as count, user.username from project left join user on user.username = project.createUser WHERE username in (?) GROUP BY project.createUser`,
            [params.users || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取用户页面数，未排除默认 home 页面
 */
export const getUserPageCountList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()
    try {
        const result = await manager.query(
            `select count(*) as count, user.username from page left join user on user.username = page.createUser WHERE username in (?) GROUP BY page.createUser`,
            [params.users || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按时间获取用户数
 */
export const getUserCountByTime = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    if (!isValidTimeType(params.timeType)) {
        ctx.throw(400, '无效的时间类型参数')
    }

    try {
        const result = await manager.query(
            `select
                DATE_FORMAT(createTime, ${getDateFormatDes(params.timeType)}) as time,
                count(*) as count
            from user
            where createTime >= ? AND createTime <= ?
            GROUP BY time
            ORDER BY time`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按分页获取项目
 * @returns 项目列表与总数
 */
export const getProjectBaseList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    // 默认去除demo项目
    const where = [`projectCode != 'demo'`, `deleteFlag = 0`]

    const escaped = []
    if (params.time) {
        const [timeStart, timeEnd] = params.time
        where.push(`(createTime >= ? AND createTime <= ?)`)
        escaped.push(new Date(Number(timeStart)), new Date(Number(timeEnd)))
    }

    if (params.q) {
        where.push(`(projectName LIKE ? OR projectCode LIKE ?)`)
        escaped.push(`%${params.q}%`, `%${params.q}%`)
    }

    const pageSize = isNaN(Number(params.pageSize)) ? 10 : Math.min(params.pageSize, 100)
    const pageCurrent = isNaN(Number(params.pageNum)) ? 1 : Math.max(params.pageNum, 1)

    let rowSql = `select id, projectCode, projectName from project`
    let countSql = `select count(*) as total from project`

    if (where.length) {
        const whereCond = ` WHERE ${where.join(' AND ')}`
        rowSql += whereCond
        countSql += whereCond
    }

    rowSql += ` ORDER BY id DESC`
    rowSql += ` LIMIT ${pageSize * (pageCurrent - 1)}, ${pageSize}`

    try {
        const [list, [count]] = await Promise.all([
            manager.query(rowSql, escaped),
            manager.query(countSql, escaped)
        ])
        ctx.send({
            code: 0,
            message: 'success',
            data: [list, Number(count.total)]
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取指定项目页面数，在项目中已去除demo项目，此处无需再去除demo页面
 */
export const getProjectPageCount = async (ctx) => {
    const params = ctx.request.body || {}

    if (!params.projectIds || !params.projectIds.length) {
        ctx.throw(400, '无效的参数')
    }

    const manager = getManager()

    try {
        const result = await manager.query(
            `select count(*) as count, projectId from r_project_page where projectId in (?) and deleteFlag = 0 GROUP BY projectId`,
            [params.projectIds || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按时间获取项目数
 */
export const getProjectCountByTime = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    if (!isValidTimeType(params.timeType)) {
        ctx.throw(400, '无效的时间类型参数')
    }

    try {
        const result = await manager.query(
            `select
                DATE_FORMAT(createTime, ${getDateFormatDes(params.timeType)}) as time,
                count(*) as count
            from project
            where (createTime >= ? AND createTime <= ?) AND projectCode != 'demo' AND deleteFlag = 0
            GROUP BY time
            ORDER BY time`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取项目总数
 */
export const getProjectTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `select count(*) as total from project where projectCode != 'demo' AND (createTime >= ? AND createTime <= ?) AND deleteFlag = 0`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取页面总数
 */
export const getPageTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `select count(*) as total from page where pageCode != 'demo' AND (createTime >= ? AND createTime <= ?) AND deleteFlag = 0`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按分页获取函数
 * @returns 函数列表与总数
 */
export const getFuncBaseList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    // 去除默认函数
    const where = [`funcName NOT IN ( 'getApiData', 'getMockData' )`, `func.deleteFlag = 0`]

    const escaped = []
    if (params.time) {
        const [timeStart, timeEnd] = params.time
        where.push(`(func.createTime >= ? AND func.createTime <= ?)`)
        escaped.push(new Date(Number(timeStart)), new Date(Number(timeEnd)))
    }

    if (params.q) {
        where.push(`(func.funcName LIKE ?)`)
        escaped.push(`%${params.q}%`, `%${params.q}%`)
    }

    const pageSize = isNaN(Number(params.pageSize)) ? 10 : Math.min(params.pageSize, 100)
    const pageCurrent = isNaN(Number(params.pageNum)) ? 1 : Math.max(params.pageNum, 1)

    let rowSql = `
        SELECT
            func.id,
            func.funcName,
            func.funcCode,
            r_project_func_group.projectId,
            project.projectName
        FROM
            func
            LEFT JOIN r_project_func_group ON r_project_func_group.funcGroupId = func.funcGroupId
            LEFT JOIN project ON r_project_func_group.projectId = project.id
    `
    let countSql = `select count(*) as total from func`

    if (where.length) {
        const whereCond = ` WHERE ${where.join(' AND ')}`
        rowSql += whereCond
        countSql += whereCond
    }

    rowSql += ` ORDER BY id DESC`
    rowSql += ` LIMIT ${pageSize * (pageCurrent - 1)}, ${pageSize}`

    try {
        const [list, [count]] = await Promise.all([
            manager.query(rowSql, escaped),
            manager.query(countSql, escaped)
        ])
        ctx.send({
            code: 0,
            message: 'success',
            data: [list, Number(count.total)]
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取指定函数页面引用数
 */
export const getFuncPageUsedCount = async (ctx) => {
    const params = ctx.request.body || {}

    if (!params.funcIds || !params.funcIds.length) {
        ctx.throw(400, '无效的参数')
    }

    const manager = getManager()

    try {
        // r_page_func中一个页面一个函数只会存一条记录（使用多次也是一条记录）
        const result = await manager.query(
            `select count(*) as count, funcId from r_page_func where funcId in (?) and deleteFlag = 0 GROUP BY funcId`,
            [params.funcIds || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按时间获取函数数
 */
export const getFuncCountByTime = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    if (!isValidTimeType(params.timeType)) {
        ctx.throw(400, '无效的时间类型参数')
    }

    try {
        const result = await manager.query(
            `select
                DATE_FORMAT(createTime, ${getDateFormatDes(params.timeType)}) as time,
                count(*) as count
            from func
            where (createTime >= ? AND createTime <= ?) AND funcName NOT IN ('getApiData', 'getMockData') AND deleteFlag = 0
            GROUP BY time
            ORDER BY time`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取函数总数
 */
export const getFuncTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `select count(*) as total from func where funcName NOT IN ('getApiData', 'getMockData') AND (createTime >= ? AND createTime <= ?) AND deleteFlag = 0`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取被页面使用的函数总数
 * 未限制在指定函数范围内
 */
export const getFuncPageUsedTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `
            SELECT
                count(*) AS total
            FROM
                (
                SELECT funcId
                FROM
                    r_page_func
                    LEFT JOIN func ON func.id = r_page_func.funcId
                WHERE
                    func.funcName NOT IN ( 'getApiData', 'getMockData' ) AND (r_page_func.createTime >= ? AND r_page_func.createTime <= ?) AND func.deleteFlag = 0
                GROUP BY funcId
                ) AS t
            `,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按分页获取自定义组件
 * @returns 自定义组件列表与总数
 */
export const getCompBaseList = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    const where = [`deleteFlag = 0`]

    const escaped = []
    if (params.time) {
        const [timeStart, timeEnd] = params.time
        where.push(`(createTime >= ? AND createTime <= ?)`)
        escaped.push(new Date(Number(timeStart)), new Date(Number(timeEnd)))
    }

    if (params.q) {
        where.push(`(name LIKE ? OR displayName LIKE ? OR type LIKE ?)`)
        escaped.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`)
    }

    const pageSize = isNaN(Number(params.pageSize)) ? 10 : Math.min(params.pageSize, 100)
    const pageCurrent = isNaN(Number(params.pageNum)) ? 1 : Math.max(params.pageNum, 1)

    let rowSql = `select id, type, name, displayName, belongProjectId from comp`
    let countSql = `select count(*) as total from comp`

    if (where.length) {
        const whereCond = ` WHERE ${where.join(' AND ')}`
        rowSql += whereCond
        countSql += whereCond
    }

    rowSql += ` ORDER BY id DESC`
    rowSql += ` LIMIT ${pageSize * (pageCurrent - 1)}, ${pageSize}`

    try {
        const [list, [count]] = await Promise.all([
            manager.query(rowSql, escaped),
            manager.query(countSql, escaped)
        ])
        ctx.send({
            code: 0,
            message: 'success',
            data: [list, Number(count.total)]
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取指定组件项目引用数
 */
export const getCompProjectUsedCount = async (ctx) => {
    const params = ctx.request.body || {}

    if (!params.compIds || !params.compIds.length) {
        ctx.throw(400, '无效的参数')
    }

    const manager = getManager()

    try {
        // 得到是组件被项目的使用记录
        const result = await manager.query(
            `select compId, projectId from r_page_comp where compId in (?) and deleteFlag = 0 GROUP BY compId, projectId`,
            [params.compIds || []]
        )
        // 再次处理同一项目只能计作一次
        const newResult = []
        result.forEach(item => {
            const found = newResult.find(newItem => newItem.compId === item.compId)
            if (found) {
                found.count += 1
            } else {
                newResult.push({
                    compId: item.compId,
                    count: 1
                })
            }
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: newResult
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}
/**
 * 获取指定组件页面引用数
 */
export const getCompPageUsedCount = async (ctx) => {
    const params = ctx.request.body || {}

    if (!params.compIds || !params.compIds.length) {
        ctx.throw(400, '无效的参数')
    }

    const manager = getManager()

    try {
        // r_page_comp中一个页面一个组件一个版本只会存一条记录
        const result = await manager.query(
            `select count(*) as count, compId from r_page_comp where compId in (?) and deleteFlag = 0 GROUP BY compId`,
            [params.compIds || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取指定组件版本数
 */
export const getCompVersionCount = async (ctx) => {
    const params = ctx.request.body || {}

    if (!params.compIds || !params.compIds.length) {
        ctx.throw(400, '无效的参数')
    }

    const manager = getManager()

    try {
        // version为组件版本记录表
        const result = await manager.query(
            `select count(*) as count, componentId from version where componentId in (?) and deleteFlag = 0 GROUP BY componentId`,
            [params.compIds || []]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 按时间获取组件数
 */
export const getCompCountByTime = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    if (!isValidTimeType(params.timeType)) {
        ctx.throw(400, '无效的时间类型参数')
    }

    try {
        const result = await manager.query(
            `select
                DATE_FORMAT(createTime, ${getDateFormatDes(params.timeType)}) as time,
                count(*) as count
            from comp
            where (createTime >= ? AND createTime <= ?) AND deleteFlag = 0
            GROUP BY time
            ORDER BY time`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取组件总数
 */
export const getCompTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `select count(*) as total from comp where (createTime >= ? AND createTime <= ?) AND deleteFlag = 0`,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}

/**
 * 获取被项目使用的组件总数
 * 未限制在指定组件范围内
 */
export const getCompProjectUsedTotalCount = async (ctx) => {
    const params = ctx.request.body || {}
    const manager = getManager()

    if (!params.time || !Array.isArray(params.time)) {
        ctx.throw(400, '无效的时间参数')
    }

    try {
        const result = await manager.query(
            `
            SELECT
                count(*) AS total
            FROM
                ( SELECT compId FROM r_page_comp WHERE (r_page_comp.createTime >= ? AND r_page_comp.createTime <= ?) AND r_page_comp.deleteFlag = 0 GROUP BY compId ) AS t
            `,
            [new Date(Number(params.time[0])), new Date(Number(params.time[1]))]
        )
        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw({
            message: err.message
        })
    }
}
