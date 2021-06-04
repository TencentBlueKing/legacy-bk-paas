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
import operateLogModel from '../model/operate-log'
const operateLogConf = require('../conf/operate-log')

const Perm = {
    async getList (ctx) {
        try {
            const operateUserId = ctx.session.userInfo.id
            const { projectId } = ctx.params
            const query = ctx.request.query || {}
            const params = { projectId, operateUserId }

            // 组装查询条件
            const where = []
            if (query.code) {
                where.push('operateCode = :operateCode')
                params.operateCode = query.code
            }
            if (query.obj) {
                where.push('operateObj = :operateObj')
                params.operateObj = query.obj
            }
            if (query.status) {
                where.push('operateStatus = :operateStatus')
                params.operateStatus = Number(query.status)
            }
            if (query.timeStart && query.timeEnd) {
                where.push('operateTime >= :timeStart AND operateTime <= :timeEnd')
                params.timeStart = isNaN(Number(query.timeStart)) ? new Date() : new Date(Number(query.timeStart))
                params.timeEnd = isNaN(Number(query.timeEnd)) ? new Date() : new Date(Number(query.timeEnd))
            }
            const andWhere = where.join(' AND ')

            // 分页设置
            const pageSize = isNaN(Number(query.pageSize)) ? 10 : Math.min(query.pageSize, 100)
            const pageCurrent = isNaN(Number(query.pageNum)) ? 1 : Math.max(query.pageNum, 1)
            const page = {
                skip: pageSize * (pageCurrent - 1),
                take: pageSize
            }

            // 查询数据
            const res = await operateLogModel.getAll(params, andWhere, page)

            ctx.send({
                code: 0,
                message: 'success',
                data: res
            })
        } catch (err) {
            ctx.throw({
                message: err.message
            })
        }
    },

    getOptions (ctx) {
        const { objNameMap, locations } = operateLogConf
        const locationValues = Object.values(locations)
        const objList = []
        const actions = {}
        for (const [key, value] of Object.entries(objNameMap)) {
            actions[key] = []
            locationValues.forEach(item => {
                if (item.code.endsWith(`_${key}`)) {
                    actions[key].push({
                        id: item.code,
                        name: item.codeText
                    })
                }
            })
            objList.push({
                id: key,
                name: value
            })
        }

        ctx.send({
            code: 0,
            message: 'success',
            data: { objList, actions }
        })
    }
}

module.exports = Perm
