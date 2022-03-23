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
import { getRepository, getConnection } from 'typeorm'
import routeModel from '../model/route'
import Route from '../model/entities/route'
import PageRoute from '../model/entities/page-route'
import { flattenListPath } from '../util'

async function hasRoute ({ path, id }, projectId, versionId) {
    const routeList = await routeModel.findProjectRoute(projectId, versionId)

    let fullPath = path
    if (id) {
        const layoutPath = (routeList.find(item => item.id === id) || {}).layoutPath
        fullPath = `${layoutPath}/${path}`
    }

    const routeMap = flattenListPath(routeList, -1, 'layoutPath')
    return routeMap.has(fullPath)
}

function formatRoutePath (path) {
    // 去除路由path中的前后“/”，便于后期统一识别和拼接
    return path.replace(/^\/+|\/+$/g, '')
}

module.exports = {
    // 查询项目下页面的路由，基于页面查询可包含无路由的页面layout信息
    async queryProjectPageRoute (ctx) {
        try {
            const { projectId } = ctx.params
            const { versionId } = ctx.query
            const routeList = await routeModel.queryProjectPageRoute(projectId, versionId)

            ctx.send({
                code: 0,
                message: 'success',
                data: routeList
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getPageRoute (ctx) {
        try {
            const { id: pageId } = ctx.params
            const route = await routeModel.queryPageRoute(pageId)
            ctx.send({
                code: 0,
                message: 'success',
                data: route
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async savePageRoute (ctx) {
        try {
            const { projectId, versionId, pageRoute } = ctx.request.body

            pageRoute.path = formatRoutePath(pageRoute.path)
            if (await hasRoute({ path: pageRoute.path, id: pageRoute.id }, projectId, versionId)) {
                throw Error('该页面路由已存在')
            }

            const route = await routeModel.savePageRoute(pageRoute)
            ctx.send({
                code: 0,
                message: 'success',
                data: route
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getProjectRoute (ctx) {
        try {
            const { id: projectId } = ctx.params
            const routeList = await routeModel.findProjectRoute(projectId)
            const routeMap = {}
            routeList.forEach(route => {
                if (routeMap[route.layoutPath]) {
                    routeMap[route.layoutPath].push(route)
                } else {
                    routeMap[route.layoutPath] = [route]
                }
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: routeMap
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    // 获取项目路由树（不包含通过删除页面或删除路由解除关联的路由及无子路由的父路由）
    async getProjectRouteTree (ctx) {
        try {
            const { id: projectId } = ctx.params
            const { versionId } = ctx.query
            const routeList = await routeModel.queryProjectRouteTree(projectId, versionId)
            const routeTree = []
            routeList.forEach(route => {
                const { layoutId, layoutPath, layoutType } = route
                const parentNode = routeTree.find(item => item.layoutPath === layoutPath && item.layoutType === layoutType)
                if (!parentNode) {
                    routeTree.push({
                        layoutId,
                        layoutPath,
                        layoutType,
                        children: route.id ? [route] : []
                    })
                } else {
                    parentNode.children.push(route)
                }
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: routeTree
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async createProjectRoute (ctx) {
        try {
            const { id: projectId } = ctx.params
            const { pageRoute, versionId } = ctx.request.body

            pageRoute.path = formatRoutePath(pageRoute.path)
            const fullPath = `${pageRoute.layoutPath}/${pageRoute.path}`
            if (await hasRoute({ path: fullPath }, projectId, versionId)) {
                throw Error('该页面路由已存在')
            }

            const routeData = { path: pageRoute.path, layoutId: pageRoute.layoutId, versionId }
            const result = await routeModel.createProjectRoute(projectId, {
                routeData
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: {
                    id: result.id,
                    path: result.path
                }
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async updatePageRoute (ctx) {
        try {
            const { projectId, versionId, pageId, pageRoute } = ctx.request.body

            await getConnection().transaction(async transactionalEntityManager => {
                const curPageRouteData = await getRepository(PageRoute).findOne({ pageId })
                if (pageRoute.layoutId) {
                    const fullPath = `${pageRoute.layoutPath}/${pageRoute.path}`
                    if (await hasRoute({ path: fullPath }, projectId, versionId)) {
                        throw Error('该布局模板下存在相同的路由')
                    }
                    await transactionalEntityManager.save(PageRoute, {
                        id: curPageRouteData.id,
                        layoutId: pageRoute.layoutId
                    })
                }

                if (pageRoute.routeId) {
                    const newPageRouteData = await getRepository(PageRoute).findOne({ routeId: pageRoute.routeId })
                    await transactionalEntityManager.save(PageRoute, {
                        id: newPageRouteData.id,
                        pageId
                    })
                    await transactionalEntityManager.save(PageRoute, {
                        id: curPageRouteData.id,
                        pageId: -1
                    })

                    // 页面有了新的路由关联，清除删除路由未删除的关联记录删除
                    const oldPageRouteRows = await getRepository(PageRoute).find({ routeId: -1, pageId })
                    await transactionalEntityManager.remove(oldPageRouteRows)
                }
            })

            ctx.send({
                code: 0,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async bindPageRoute (ctx) {
        try {
            const { routeId, pageId, redirect, remove } = ctx.request.body
            const pageRouteRepo = getRepository(PageRoute)
            const pageRouteRow = await pageRouteRepo.findOne({ routeId })

            const result = await getConnection().transaction(async transactionalEntityManager => {
                const currentBindPageId = pageRouteRow.pageId
                let result = null

                // 绑定页面
                if (pageId) {
                    result = await transactionalEntityManager.save(PageRoute, {
                        id: pageRouteRow.id,
                        pageId,
                        redirect: null
                    })

                    // page绑定了新的route，可以安全的将之前删除路由未删除的关联记录删除
                    const oldPageRouteRows = await pageRouteRepo.find({ routeId: -1, pageId })
                    await transactionalEntityManager.remove(oldPageRouteRows)
                }

                // 绑定跳转路由
                if (redirect) {
                    // 环状检查，客户端已处理，此处暂不处理
                    result = await transactionalEntityManager.save(PageRoute, {
                        id: pageRouteRow.id,
                        redirect,
                        pageId: -1
                    })
                }

                // 解绑当前页面与路由的绑定，变更为另一个页面或路由时，需要将原页面的pr复制以保留与模板的关联（变相解绑）
                if (currentBindPageId !== -1) {
                    const copyPageRouteRow = pageRouteRepo.create({ ...pageRouteRow, id: undefined, routeId: -1 })
                    await transactionalEntityManager.save(PageRoute, copyPageRouteRow)
                }

                // 不绑定（解除绑定，实际上暂时不允许页面与路由解绑因为会丢失模板关联）
                if (remove) {
                    result = await transactionalEntityManager.save(PageRoute, {
                        id: pageRouteRow.id,
                        redirect: null,
                        pageId: -1
                    })
                }

                return result
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: {
                    routeId,
                    pageId: result.pageId,
                    redirect: result.redirect
                }
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async removeRoute (ctx) {
        try {
            const routeId = Number(ctx.query.id)

            await getConnection().transaction(async transactionalEntityManager => {
                // 删除路由记录
                const routeRow = await getRepository(Route).findOneOrFail(routeId)
                await transactionalEntityManager.remove(routeRow)

                // 解绑页面与路由关联或删除关联记录
                const pageRouteRow = await getRepository(PageRoute).findOne({ routeId })
                if (pageRouteRow.pageId !== -1) {
                    // 如果已经绑定页面，不能删除数据因需要保留页面与模板关联
                    await transactionalEntityManager.save(PageRoute, { ...pageRouteRow, routeId: -1 })
                } else {
                    await transactionalEntityManager.remove(pageRouteRow)
                }

                // 重置关联的跳转路由
                const redirectRouteList = await getRepository(PageRoute).find({ redirect: routeId })
                const newRedirectRouteList = redirectRouteList.map(route => ({ ...route, redirect: null }))
                await transactionalEntityManager.save(PageRoute, newRedirectRouteList)
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: routeId
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    hasRoute,
    formatRoutePath
}
