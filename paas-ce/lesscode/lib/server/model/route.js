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
import ProjectPage from './entities/project-page'
import Layout from './entities/layout'

export default {
    queryProjectRoute (projectId) {
        return getRepository(Route)
            .createQueryBuilder('route')
            .leftJoinAndSelect(PageRoute, 'pr', 'route.id = pr.routeId')
            .leftJoinAndSelect(Page, 'p', 'p.id = pr.pageId')
            .where('pr.projectId = :projectId', { projectId })
            .andWhere('route.deleteFlag = 0')
            .andWhere('p.deleteFlag = 0')
            .select(['route.id as id', 'route.parentId as parentId', 'route.path as path', 'route.order as routeOrder', 'p.pageCode as pageCode', 'p.content as content'])
            .orderBy({
                'route.parentId': 'ASC',
                'route.id': 'ASC'
            })
            .getRawMany()
    },
    queryPageRoute (pageId) {
        return getRepository(Route)
            .createQueryBuilder('route')
            .leftJoinAndSelect(PageRoute, 'pr', 'route.id = pr.routeId')
            .leftJoinAndSelect(LayoutInst, 'layoutinst', 'pr.layoutId = layoutinst.id')
            .select([
                'route.id as id',
                'route.parentId as parentId',
                'route.path as path',
                'layoutinst.routePath as layoutPath',
                'layoutinst.id as layoutId'
            ])
            .where('pr.pageId = :pageId', { pageId })
            .getRawOne()
    },
    savePageRoute (pageRoute) {
        return getRepository(Route).save(pageRoute)
    },

    // 获取项目下的路由
    findProjectRoute (projectId) {
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
                'pr.pageId as pageId',
                'layoutinst.id as layoutId',
                'layoutinst.routePath as layoutPath',
                'layoutinst.layoutCode as layoutCode',
                'layoutinst.content as layoutContent',
                'layout.type as layoutType'
            ])
            .where('pr.projectId = :projectId', { projectId })
            .andWhere('route.deleteFlag = 0')
            .andWhere('(pr.deleteFlag IS NULL OR pr.deleteFlag = 0)')
            .getRawMany()
    },

    // 获取指定页面同项目下的页面与路由信息
    findLayoutPageRoute (pageId) {
        return getRepository(PageRoute)
            .createQueryBuilder('pageRoute')
            .leftJoinAndSelect(Page, 'page', 'page.id = pageRoute.pageId')
            .leftJoinAndSelect(Route, 'route', 'route.id = pageRoute.routeId')
            .leftJoinAndSelect(LayoutInst, 'layoutinst', 'layoutinst.id = pageRoute.layoutId')
            .select([
                'pageRoute.pageId as pageId',
                'page.pageCode as pageCode',
                'page.pageName as pageName',
                'route.path as routePath',
                'layoutinst.routePath as layoutPath',
                'layoutinst.layoutCode as layoutCode'
            ])
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select('projectPage.projectId')
                    .from(ProjectPage, 'projectPage')
                    .where('projectPage.pageId = :pageId')
                    .getQuery()
                return 'pageRoute.projectId = ' + subQuery
            })
            .setParameter('pageId', pageId)
            .andWhere('pageId != -1')
            .andWhere('page.deleteFlag = 0')
            .orderBy('pageId', 'DESC')
            .getRawMany()
    },

    createProjectRoute (projectId, { routeData }) {
        return getConnection().transaction(async transactionalEntityManager => {
            const { path, layoutId } = routeData
            const route = getRepository(Route).create({ path })
            const routeSaved = await transactionalEntityManager.save(route)

            // 页面路由关联记录，包括layoutId
            const pageRoute = getRepository(PageRoute).create({ routeId: routeSaved.id, pageId: -1, layoutId, projectId })
            await transactionalEntityManager.save(pageRoute)

            return routeSaved
        })
    }
}
