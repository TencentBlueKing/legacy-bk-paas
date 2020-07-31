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
const presetUser = {
    id: 1,
    name: 'admin'
}

module.exports = {
    async createProject (ctx) {
        const projectData = ctx.request.body
        projectData.createUser = presetUser.name
        const userProjectRoleData = {
            userId: presetUser.id,
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

        let projectList = []
        switch (filter) {
            case 'my':
                query.condition.push('project.createUser = :user')
                query.params.user = presetUser.name
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryMyCreateProject(query)
                break
            case 'favorite':
                query.condition.push('favourite.userId = :userId')
                query.params.userId = presetUser.id
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryMyFavoriteProject(query)
                break
            case 'share':
                query.condition.push('user_project_role.userId = :userId')
                query.params.userId = presetUser.id
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryShareWithProject(query)
                break
            default:
                query.condition.push('user_project_role.userId = :userId')
                query.params.userId = presetUser.id
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryAllProject(query)
                break
        }

        // 获取项目下的页面
        let pageList = []
        if (projectList.length) {
            const projectIds = projectList.map(project => project.id)
            pageList = await projectModel.queryProjectPage({
                condition: 'project_page.projectId IN (:...projectIds)',
                params: { projectIds }
            })
        }

        // 获取已收藏的项目
        const favoritetList = await projectModel.queryMyFavoriteProject({
            condition: 'favourite.userId = :userId',
            params: { userId: presetUser.id }
        })

        // 按projectId分组
        const pageMap = {}
        pageList.forEach((page) => {
            if (pageMap[page.projectId]) {
                pageMap[page.projectId].push(page)
            } else {
                pageMap[page.projectId] = [page]
            }
        })

        // 按页面更新时间和创建时间倒序
        projectList.forEach(project => {
            const projectId = project.id
            if (pageMap[projectId]) {
                project['pageUpdateTime'] = pageMap[projectId][0].updateTime
            }
            project['favorite'] = favoritetList.find(item => item.id === projectId) ? 1 : 0
        })
        projectList.sort((a, b) => {
            if (!a.pageUpdateTime && !b.pageUpdateTime) {
                return 0
            } else if (!a.pageUpdateTime && b.pageUpdateTime) {
                return 1
            } else if (a.pageUpdateTime && !b.pageUpdateTime) {
                return -1
            }
            return new Date(b.pageUpdateTime) - new Date(a.pageUpdateTime)
        })

        ctx.send({
            code: 0,
            message: '',
            data: {
                projectList,
                pageMap
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

    async deleteProject (ctx) {
        try {
            const { id } = ctx.request.body
            const fields = { status: 2 }
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
            userId: presetUser.id,
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
    },

    async projectDetail (ctx) {
        try {
            const { projectId } = ctx.request.query
            const detail = await projectModel.findProjectDetail({ id: projectId })
            ctx.send({
                code: 0,
                message: 'OK',
                data: detail
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}
