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
import Page from './entities/page'
import ProjectPage from './entities/project-page'

module.exports = {
    // 获取项目下可见的页面列表
    getProjectPages (projectId) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere('page.deleteFlag = 0')
            .orderBy('page.updateTime', 'DESC')
            .getMany()
    },

    // check页面名称是否存在
    checkProjectPageExist (projectId, pageName) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere('page.pageName = :pageName', { pageName })
            .getMany()
    },

    // 创建页面
    createPage (pageData, projectPageData) {
        const page = getRepository(Page).create(pageData)

        return getConnection().transaction(async transactionalEntityManager => {
            // 创建页面表相关信息
            const { id: pageId } = await transactionalEntityManager.save(page)

            // 创建项目页面关联记录
            projectPageData.pageId = pageId

            const projectPage = getRepository(ProjectPage).create(projectPageData)
            await transactionalEntityManager.save(projectPage)

            return { id: pageId }
        })
    }
}
