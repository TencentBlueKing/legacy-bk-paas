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
import { getRepository } from 'typeorm'
import LayoutModel from '../model/layout'
import LayoutInst from '../model/entities/layout-inst'
import PageRoute from '../model/entities/page-route'
import { whereVersionLiteral } from '../model/common'

const Layout = {
    async getPlatformList (ctx) {
        const defaultList = await LayoutModel.getDefaultList()
        ctx.send({
            code: 0,
            message: 'success',
            data: defaultList
        })
    },

    async getList (ctx) {
        const { projectId, versionId } = ctx.request.query
        const list = await LayoutModel.getList(projectId, versionId)
        ctx.send({
            code: 0,
            message: 'success',
            data: list
        })
    },

    async getFullList (ctx) {
        try {
            const { projectId, versionId } = ctx.request.query
            const list = await LayoutModel.getList(projectId, versionId)
            if (!list || !list.length) {
                ctx.throwError({
                    message: 'Layout instance data not found'
                })
            }
            const layoutIdList = list.map(item => item.id)
            const layoutPageList = await getRepository(PageRoute).createQueryBuilder()
                .select(['pageId', 'layoutId'])
                .where('layoutId IN (:...layoutIdList)', { layoutIdList })
                .andWhere('(deleteFlag IS NULL OR deleteFlag = 0)')
                .getRawMany()
            ctx.send({
                code: 0,
                message: 'success',
                data: {
                    list: list || [],
                    pageList: layoutPageList || []
                }
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getPageLayout (ctx) {
        try {
            const { id: pageId } = ctx.request.query
            const result = await LayoutModel.getLayoutByPageId(pageId)
            if (result && result.layoutContent) {
                result.layoutContent = JSON.parse(result.layoutContent)
            } else {
                result.layoutContent = {}
            }

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

    async create (ctx) {
        try {
            const { projectId, versionId = null, layoutData } = ctx.request.body

            const layoutInstRepo = getRepository(LayoutInst)
            const layoutInst = layoutInstRepo.create({
                projectId,
                versionId,
                content: layoutData.content,
                layoutId: layoutData.layoutId,
                routePath: layoutData.routePath,
                showName: layoutData.showName,
                layoutCode: layoutData.layoutCode
            })
            const { id } = await layoutInstRepo.save(layoutInst)

            ctx.send({
                code: 0,
                message: 'success',
                data: id
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async update (ctx) {
        try {
            const { layoutData } = ctx.request.body

            const layoutInstRepo = getRepository(LayoutInst)
            const { id } = await layoutInstRepo.save(layoutData)

            ctx.send({
                code: 0,
                message: 'success',
                data: id
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async deleteLayout (ctx) {
        try {
            const { id } = await getRepository(LayoutInst).save({
                id: parseInt(ctx.request.query.id),
                deleteFlag: 1
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: id
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async setDefault (ctx) {
        const { id: layoutId, projectId, versionId } = ctx.request.body
        try {
            await getRepository(LayoutInst).update({ projectId: parseInt(projectId), versionId: whereVersionLiteral(versionId) }, { isDefault: 0 })
            const { id } = await getRepository(LayoutInst).save({
                id: parseInt(layoutId),
                isDefault: 1
            })

            ctx.send({
                code: 0,
                message: 'success',
                data: id
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async setRoutePath (ctx) {
        const { id, projectId, versionId, routePath, layoutType = 'PC' } = ctx.request.body
        try {
            const existRoutePath = await getRepository(LayoutInst).findOne({ projectId, versionId, routePath })
            if (existRoutePath) {
                throw Error('该模板路由已存在')
            }
            if (layoutType !== 'MOBILE' && routePath.startsWith('/mobile')) {
                ctx.throwError({
                    message: 'web端路由不能以/mobile开头'
                })
            }

            await getRepository(LayoutInst).update(id, { routePath })

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

    async checkName (ctx) {
        const { showName, routePath, layoutCode, projectId, versionId, layoutType } = ctx.request.body
        try {
            if (showName) {
                const existShowName = await getRepository(LayoutInst).findOne({ projectId, versionId, showName, deleteFlag: 0 })
                if (existShowName) {
                    ctx.throwError({
                        message: '该模板名称已存在'
                    })
                }
            }

            if (layoutCode) {
                const existLayoutCode = await getRepository(LayoutInst).findOne({ projectId, versionId, layoutCode, deleteFlag: 0 })
                if (existLayoutCode) {
                    ctx.throwError({
                        message: '该模板ID已存在'
                    })
                }
            }

            if (routePath) {
                const existRoutePath = await getRepository(LayoutInst).findOne({ projectId, versionId, routePath, deleteFlag: 0 })
                if (existRoutePath) {
                    ctx.throwError({
                        message: '该模板路由已存在'
                    })
                }
                if (layoutType !== 'MOBILE' && routePath.startsWith('/mobile')) {
                    ctx.throwError({
                        message: 'web端路由不能以/mobile开头'
                    })
                }
            }

            ctx.send({
                code: 0,
                message: 'OK',
                data: null
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}

module.exports = Layout
