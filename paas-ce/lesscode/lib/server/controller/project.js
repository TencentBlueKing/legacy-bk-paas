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

import projectModel from '../model/project'
const { CODE } = require('../util')

module.exports = {
    async createProject (ctx) {
        const projectData = ctx.request.body
        const userProjectRoleData = {
            userId: 1,
            roleId: 1
        }

        try {
            const res = {
                code: 0,
                message: 'OK',
                data: null
            }

            const { projectName, projectCode } = projectData

            // 检查名称和英文ID的唯一性
            const [foundNameProject, foundCodeProject] = await Promise.all([
                projectModel.findOneProjectByName(projectName),
                projectModel.findOneProjectByCode(projectCode)
            ])

            if (foundNameProject) {
                ctx.throw(200, '项目名称已经存在', { code: CODE.BIZ.PROJECT_NAME_EXISTED })
            }

            if (foundCodeProject) {
                ctx.throw(200, '项目ID已经存在', { code: CODE.BIZ.PROJECT_ID_EXISTED })
            }

            const { projectId } = await projectModel.createProject(projectData, userProjectRoleData)

            res.data = projectId

            ctx.send(res)
        } catch (e) {
            ctx.throw(e)
        }
    },

    async queryProject (ctx) {
        const { filter = '', q } = ctx.request.query
        const query = {
            condition: [],
            params: {}
        }

        if (q) {
            query.condition.push('(project.projectName LIKE :q OR project.projectDesc LIKE :q)')
            query.params = { q: `%${q}%` }
        }

        switch (filter) {
            case 'my':
                query.condition.push('project.createUser = :user')
                query.params.user = 'test'
                break
            case 'favorite':
                query.condition.push('project.favorite = :favorite')
                query.params.favorite = 1
                break
            case 'share':
                break
            default:
        }

        if (Array.isArray(query.condition) && query.condition.length) {
            query.condition = query.condition.join(' AND ')
        }

        const projectList = await projectModel.qeuryProject(query)
        const pageList = await projectModel.queryProjectPage()

        // 按projectId分组
        const pageMap = {}
        pageList.forEach((page) => {
            if (pageMap[page.projectId]) {
                pageMap[page.projectId].push(page)
            } else {
                pageMap[page.projectId] = [page]
            }
        })

        // 按页面更新时间倒序
        projectList.forEach(project => {
            if (pageMap[project.id]) {
                project['pageUpdateTime'] = pageMap[project.id][0].updateTime
            }
        })
        projectList.sort((a, b) => {
            return b.pageUpdateTime - a.pageUpdateTime
        })

        ctx.send({
            code: 0,
            message: '',
            data: {
                projectList,
                pageMap,
                ctx: { filter, q }
            }
        })
    },

    async updateProject (ctx) {
        try {
            const { id, fields } = ctx.request.body
            const { affected } = await projectModel.updateProject(id, fields)
            ctx.send({
                code: 0,
                message: 'OK',
                data: affected
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async favorite (ctx) {
        const { id, favorite } = ctx.request.body
        const data = {
            userId: 1,
            projectId: id
        }

        try {
            if (favorite) {
                await projectModel.addFavorite(data)
            } else {
                await projectModel.removeFavorite(data)
            }
            ctx.send({
                code: 0,
                message: 'OK',
                data: null
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async checkname (ctx) {
        const { name } = ctx.request.body
        const res = {
            code: 0,
            message: 'OK',
            data: null
        }
        try {
            const foundNameProject = await projectModel.findOneProjectByName(name)
            if (foundNameProject) {
                ctx.throw(200, '项目名称已经存在', { code: CODE.BIZ.PROJECT_NAME_EXISTED })
            }
            ctx.send(res)
        } catch (e) {
            ctx.throw(e)
        }
    }
}
