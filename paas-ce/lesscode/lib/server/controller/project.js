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
import { invalidProjectIds } from '../conf/system'
import { pages } from '../conf/demo-page-code'
import { createDemoPage, createDefaultPage } from './page'
import LayoutModel from '../model/layout'
const { CODE } = require('../util')

module.exports = {
    async createProject (ctx) {
        const { layouts: layoutData, ...projectData } = ctx.request.body
        const userInfo = ctx.session.userInfo
        projectData.createUser = userInfo.username
        const userProjectRoleData = {
            userId: userInfo.id,
            roleId: 1
        }

        try {
            const res = {
                code: 0,
                message: 'OK',
                data: null
            }

            const { projectName, projectCode } = projectData

            if (invalidProjectIds.includes(projectCode)) {
                ctx.throw(200, '项目ID不能为内置关键字', { code: CODE.BIZ.PROJECT_ID_INVALID })
            }

            // 检查名称和英文ID的唯一性
            const [foundNameProject, foundCodeProject] = await Promise.all([
                projectModel.findOneProjectByNameAndUserId(projectName, userInfo.id),
                projectModel.findOneProjectByCodeAndUserId(projectCode, userInfo.id)
            ])

            if (foundNameProject && foundNameProject.length) {
                ctx.throw(400, '项目名称已经存在', { code: CODE.BIZ.PROJECT_NAME_EXISTED })
            }

            if (foundCodeProject && foundCodeProject.length) {
                ctx.throw(400, '项目ID已经存在', { code: CODE.BIZ.PROJECT_ID_EXISTED })
            }

            const { projectId } = await projectModel.createProject(projectData, userProjectRoleData, layoutData)

            // 创建默认home页面，复制时不创建
            if (!projectData.copyFrom) {
                await createDefaultPage(projectId)
            }

            res.data = projectId

            ctx.send(res)
        } catch (e) {
            ctx.throw(e)
        }
    },

    async queryProject (ctx) {
        const userInfo = ctx.session.userInfo
        const { filter = '', q, officialType } = ctx.request.query
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
                query.params.user = userInfo.username
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryMyCreateProject(query)
                break
            case 'favorite':
                query.condition.push('favourite.userId = :userId')
                query.params.userId = userInfo.id
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryMyFavoriteProject(query)
                break
            case 'share':
                query.condition.push('user_project_role.userId = :userId')
                query.params.userId = userInfo.id
                query.condition = query.condition.join(' AND ')
                projectList = await projectModel.queryShareWithProject(query)
                break
            case 'official':
                const params = { where: { isOffcial: 1 }, order: { id: 'DESC' } }
                if (officialType !== '') {
                    params.where.offcialType = officialType
                }
                projectList = await projectModel.findProjects(params)
                break
            default:
                query.condition.push('user_project_role.userId = :userId')
                query.params.userId = userInfo.id
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
            params: { userId: userInfo.id }
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

                // 找到第一个有效页面的缩略图作为项目的缩略图，如果第一个有效页面缩略图为空，那么项目缩略图就为空
                const len = pageMap[projectId].length
                for (let i = 0; i < len; i++) {
                    if (String(pageMap[projectId][i].deleteFlag) !== '1') {
                        project['previewImg'] = pageMap[projectId][i].previewImg
                        break
                    }
                }
            }
            project['favorite'] = favoritetList.find(item => item.id === projectId) ? 1 : 0
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
            // 权限
            const record = await projectModel.findProjectDetail({ id })
            const userInfo = ctx.session.userInfo || {}
            ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
            if (!ctx.hasPerm) return

            const fields = { deleteFlag: 1 }
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
        const userInfo = ctx.session.userInfo
        const data = {
            userId: userInfo.id,
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
            const foundNameProject = await projectModel.findOneProjectByNameAndUserId(name, ctx.session.userInfo.id)
            if (foundNameProject && foundNameProject.length) {
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
    },

    async getTemplateIds (ctx) {
        try {
            const params = { where: { isOffcial: 1 }, order: { id: 'DESC' } }
            const projectList = await projectModel.findProjects(params)
            const data = projectList.map(item => item.id)
            ctx.send({
                code: 0,
                message: 'OK',
                data
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
        
    },

    async verify (ctx) {
        try {
            const id = ctx.request.body.id
            const userInfo = ctx.session.userInfo
            const project = await projectModel.findUserProjectById(userInfo.id, id)
            ctx.send({
                code: 0,
                message: 'OK',
                data: project && project.id
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    // 用户所拥有的项目，包含通过添加成员共享的项目，用于项目下拉与列表选择
    async my (ctx) {
        try {
            const userInfo = ctx.session.userInfo
            const query = {
                condition: [],
                params: {},
                select: ['project.id', 'project.projectCode', 'project.projectName']
            }
            query.condition.push('user_project_role.userId = :userId')
            query.params.userId = userInfo.id
            query.condition = query.condition.join(' AND ')
            const projectList = await projectModel.queryAllProject(query)

            ctx.send({
                code: 0,
                message: 'OK',
                data: projectList
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async createDemoProject (data) {
        const { userInfo, projectData } = data
        projectData.createUser = userInfo.username
        const userProjectRoleData = {
            userId: userInfo.id,
            roleId: 1
        }

        try {
            const layoutData = await LayoutModel.getDefaultList()
            const layoutList = layoutData.reduce((pre, cur) => {
                pre.push({
                    layoutId: cur.id,
                    content: cur.defaultContent,
                    routePath: cur.defaultPath,
                    showName: cur.defaultName,
                    layoutCode: cur.defaultCode,
                    isDefault: cur.type === 'top-bottom'
                })
                return pre
            }, [])

            const { projectId } = await projectModel.createProject(projectData, userProjectRoleData, layoutList)
            return Promise.all(pages.map(page => createDemoPage({
                projectId: projectId,
                pageData: page.pageConfig,
                pageContent: {
                    content: page.content,
                    previewImg: page.preview
                }
            })))
        } catch (e) {
            console.error(e)
        }
    }
}
