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
import { getConnection, getRepository } from 'typeorm'
import Route from './entities/route'
import PageRoute from './entities/page-route'
import Page from './entities/page'
import LayoutInst from './entities/layout-inst'
import Layout from './entities/layout'
import { whereVersion } from './common'

export default {
    queryProjectPageRoute (projectId, versionId) {
        return getRepository(Page)
            .createQueryBuilder('p')
            .leftJoinAndSelect(PageRoute, 'pr', 'p.id = pr.pageId')
            .leftJoinAndSelect(Route, 'route', 'route.id = pr.routeId')
            .leftJoinAndSelect(LayoutInst, 'layoutinst', 'layoutinst.id = pr.layoutId')
            .where('pr.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId, 'pr'))
            .andWhere('p.deleteFlag = 0')
            .select([
                'route.id as id',
                'route.path as path',
                'p.id as pageId',
                'p.pageCode as pageCode',
                'p.pageName as pageName',
                'layoutinst.id as layoutId',
                'layoutinst.routePath as layoutPath'
            ])
            .getRawMany()
    },

    // 查询页面的路由，未设置路由的页面同样会返回layout信息
    queryPageRoute (pageId) {
        return getRepository(Page)
            .createQueryBuilder('page')
            .leftJoinAndSelect(PageRoute, 'pr', 'page.id = pr.pageId')
            .leftJoinAndSelect(Route, 'route', 'route.id = pr.routeId')
            .leftJoinAndSelect(LayoutInst, 'layoutinst', 'pr.layoutId = layoutinst.id')
            .select([
                'route.id as id',
                'route.path as path',
                'layoutinst.routePath as layoutPath',
                'layoutinst.id as layoutId'
            ])
            .where('page.id = :pageId', { pageId })
            .getRawOne()
    },

    savePageRoute (pageRoute) {
        return getRepository(Route).save(pageRoute)
    },

    // 获取项目下的路由
    findProjectRoute (projectId, versionId) {
        return getRepository(Route)
            .createQueryBuilder('route')
            .leftJoinAndSelect(PageRoute, 'pr', 'route.id = pr.routeId')
            .leftJoinAndSelect(Page, 'page', 'page.id = pr.pageId')
            .leftJoinAndSelect(LayoutInst, 'layoutinst', 'pr.layoutId = layoutinst.id')
            .leftJoinAndSelect(Layout, 'layout', 'layout.id = layoutinst.layoutId')
            .select([
                'route.id as id',
                'route.path as path',
                'route.parentId as parentId',
                'page.pageCode as pageCode',
                'page.pageName as pageName',
                'page.content as content',
                'page.deleteFlag as pageDeleteFlag',
                'page.lifeCycle as lifeCycle',
                'page.styleSetting as styleSetting',
                'pr.pageId as pageId',
                'pr.redirect as redirect',
                'layoutinst.id as layoutId',
                'layoutinst.routePath as layoutPath',
                'layoutinst.layoutCode as layoutCode',
                'layoutinst.content as layoutContent',
                'layout.type as layoutType'
            ])
            .where('pr.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId, 'pr'))
            .andWhere('route.deleteFlag = 0')
            .andWhere('(pr.deleteFlag IS NULL OR pr.deleteFlag = 0)')
            .getRawMany()
    },

    queryProjectRouteTree (projectId, versionId) {
        return getRepository(LayoutInst)
            .createQueryBuilder('layoutinst')
            .leftJoinAndSelect(PageRoute, 'pr', 'layoutinst.id = pr.layoutId AND (pr.deleteFlag IS NULL OR pr.deleteFlag = 0)')
            .leftJoinAndSelect(Page, 'page', 'page.id = pr.pageId')
            .leftJoinAndSelect(Route, 'route', 'route.id = pr.routeId')
            .select([
                'layoutinst.id as layoutId',
                'layoutinst.routePath as layoutPath',
                'pr.pageId as pageId',
                'pr.redirect as redirect',
                'route.id as id',
                'route.path as path',
                'page.pageCode as pageCode',
                'page.pageName as pageName'
            ])
            .where('layoutinst.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId, 'layoutinst'))
            .andWhere('layoutinst.deleteFlag = 0')
            .andWhere('pr.routeId != -1') // 过虑已删除的路由（与页面解除绑定）
            .orderBy('layoutinst.id')
            .getRawMany()
    },

    createProjectRoute (projectId, { routeData }) {
        return getConnection().transaction(async transactionalEntityManager => {
            const { path, layoutId, versionId = null } = routeData
            const route = getRepository(Route).create({ path })
            const routeSaved = await transactionalEntityManager.save(route)

            // 页面路由关联记录，包括layoutId
            const pageRoute = getRepository(PageRoute).create({ routeId: routeSaved.id, pageId: -1, layoutId, projectId, versionId })
            await transactionalEntityManager.save(pageRoute)

            return routeSaved
        })
    }
}
