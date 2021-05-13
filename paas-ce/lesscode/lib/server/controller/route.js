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
import PageRoute from '../model/entities/page-route'
import { list2tree, flattenListPath } from '../util'

async function hasRoute ({ path, id }, projectId) {
    const routeList = await routeModel.findProjectRoute(projectId)

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
    async queryRoute (ctx) {
        try {
            const { projectId } = ctx.query
            let routeList = await routeModel.queryProjectRoute(projectId)

            routeList = list2tree(routeList)

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
            const { projectId, pageRoute } = ctx.request.body

            pageRoute.path = formatRoutePath(pageRoute.path)
            if (await hasRoute({ path: pageRoute.path, id: pageRoute.id }, projectId)) {
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

    async createProjectRoute (ctx) {
        try {
            const { id: projectId } = ctx.params
            const { pageRoute } = ctx.request.body

            pageRoute.path = formatRoutePath(pageRoute.path)
            const fullPath = `${pageRoute.layoutPath}/${pageRoute.path}`
            if (await hasRoute({ path: fullPath }, projectId)) {
                throw Error('该页面路由已存在')
            }

            const routeData = { path: pageRoute.path, layoutId: pageRoute.layoutId }
            const result = await routeModel.createProjectRoute(projectId, {
                routeData
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: result
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async updatePageRoute (ctx) {
        try {
            const { projectId, pageId, pageRoute } = ctx.request.body

            await getConnection().transaction(async transactionalEntityManager => {
                const curPageRouteData = await getRepository(PageRoute).findOne({ pageId })
                if (pageRoute.layoutId) {
                    const fullPath = `${pageRoute.layoutPath}/${pageRoute.path}`
                    if (await hasRoute({ path: fullPath }, projectId)) {
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

    async getLayoutPageList (ctx) {
        try {
            const { id: pageId } = ctx.params
            const result = await routeModel.findLayoutPageRoute(pageId)
            ctx.send({
                code: 0,
                message: 'success',
                data: result
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
