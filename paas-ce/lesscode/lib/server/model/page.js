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

import { getRepository, getConnection, In } from 'typeorm'
import Page from './entities/page'
import ProjectPage from './entities/project-page'
import Route from './entities/route'
import PageRoute from './entities/page-route'
import PageFunc from './entities/page-func'
import PageComp from './entities/page-comp'
import UserProjectRole from './entities/user-project-role'
import Variable from './entities/variable'
import PageVariable from './entities/page-variable'
import FuncVariable from './entities/func-variable'
import VariableFunc from './entities/variable-func'
import VariableVariable from './entities/variable-variable'
import { whereVersion } from './common'

module.exports = {
    // 获取项目下可见的页面列表
    getProjectPages (projectId, versionId) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .select([
                'page.id',
                'page.pageName',
                'page.pageCode',
                'page.content',
                'page.lifeCycle',
                'page.styleSetting',
                'page.updateUser',
                'page.createUser',
                'page.updateTime'
            ])
            .where('t.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId))
            .andWhere('page.deleteFlag = 0')
            .orderBy('page.id', 'DESC')
            .getMany()
    },

    // check页面名称是否存在
    checkProjectPageExist (projectId, versionId, pageName) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId))
            .andWhere('BINARY page.pageName = :pageName', { pageName })
            .andWhere('page.deleteFlag = 0')
            .getMany()
    },

    // check页面ID是否存在
    checkProjectPageCodeExist (projectId, versionId, pageCode) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId))
            .andWhere('page.pageCode = :pageCode', { pageCode })
            .andWhere('page.deleteFlag = 0')
            .getMany()
    },

    // 创建页面
    createPage (pageData, projectPageData, copyFrom) {
        const page = getRepository(Page).create(pageData)
        return getConnection().transaction(async transactionalEntityManager => {
            // 获取原有数据
            const oldPageData = await getRepository(Page).findOne(copyFrom)
            // 创建页面表相关信息
            const { id: pageId, pageCode } = await transactionalEntityManager.save(page)

            // 创建项目页面关联记录
            projectPageData.pageId = pageId
            const projectPage = getRepository(ProjectPage).create(projectPageData)
            await transactionalEntityManager.save(projectPage)

            // 创建页面路由和关联记录
            const route = getRepository(Route).create({ path: pageData.pageRoute })
            const { id: routeId } = await transactionalEntityManager.save(route)
            const pageRoute = getRepository(PageRoute).create({
                routeId,
                pageId,
                projectId: projectPageData.projectId,
                versionId: projectPageData.versionId,
                layoutId: pageData.layoutId
            })
            await transactionalEntityManager.save(pageRoute)

            if (copyFrom) {
                // 复制页面函数关联记录
                const copyPageFuncs = await getRepository(PageFunc)
                    .createQueryBuilder('pageFunc')
                    .where('pageFunc.pageId = :pageId', { pageId: copyFrom })
                    .getMany()
                if (copyPageFuncs.length) {
                    const saveCopyPageFuncs = getRepository(PageFunc).create(copyPageFuncs.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.pageId = pageId
                        return others
                    }))
                    await transactionalEntityManager.save(saveCopyPageFuncs)
                }

                // 复制页面组件关联记录
                const copyPageComps = await getRepository(PageComp)
                    .createQueryBuilder('pageComp')
                    .where('pageComp.pageId = :pageId', { pageId: copyFrom })
                    .getMany()
                if (copyPageComps.length) {
                    const saveCopyPageComps = getRepository(PageComp).create(copyPageComps.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.pageId = pageId
                        others.createTime = new Date()
                        return others
                    }))
                    await transactionalEntityManager.save(saveCopyPageComps)
                }

                // 复制变量
                const variableList = await getRepository(Variable)
                    .createQueryBuilder('variable')
                    .where('variable.projectId = :projectId AND variable.pageCode = :pageCode', {
                        projectId: projectPageData.projectId,
                        versionId: projectPageData.versionId,
                        pageCode: oldPageData.pageCode,
                        effectiveRange: 1
                    })
                    .getMany()
                if (variableList.length) {
                    const saveVariableList = getRepository(Variable).create(variableList.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectPageData.projectId
                        others.pageCode = pageCode
                        return others
                    }))
                    const newVariableList = await transactionalEntityManager.save(saveVariableList)
                    // 建立新老变量id的映射
                    const variableIdMap = {}
                    variableList.forEach(({ id }, index) => {
                        variableIdMap[id] = newVariableList[index].id
                    })
                    const where = { projectId: projectPageData.projectId, variableId: In(variableList.map(x => x.id)) }
                    const [pageVariableList, funcVariableList, variableFuncList, variableVariableList] = await Promise.all([
                        getRepository(PageVariable).find({ where }),
                        getRepository(FuncVariable).find({ where }),
                        getRepository(VariableFunc).find({ where }),
                        getRepository(VariableVariable).find({ where })
                    ])
                    const savePageVariableList = getRepository(PageVariable).create(pageVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectPageData.projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(savePageVariableList)
                    const saveFuncVariableList = getRepository(FuncVariable).create(funcVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectPageData.projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveFuncVariableList)
                    const saveVariableFuncList = getRepository(VariableFunc).create(variableFuncList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectPageData.projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveVariableFuncList)
                    const saveVariableVariableList = getRepository(VariableVariable).create(variableVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, parentVariableId, ...others } = item
                        others.projectId = projectPageData.projectId
                        others.variableId = variableIdMap[variableId]
                        others.parentVariableId = variableIdMap[parentVariableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveVariableVariableList)
                }
            }

            return { id: pageId }
        })
    },

    // 根据页面id查询项目和角色
    findUserPageById (userId, pageId, projectId) {
        const where = {
            condition: ['rp.pageId = :pageId', 'rr.userId = :userId', 'rr.deleteFlag = 0'],
            params: { pageId, userId }
        }
        if (projectId) {
            where.condition.push('rp.projectId = :projectId')
            where.params.projectId = projectId
        }
        return getRepository(ProjectPage).createQueryBuilder('rp')
            .leftJoinAndSelect(UserProjectRole, 'rr', 'rp.projectId = rr.projectId')
            .select(['rp.projectId as projectId', 'rr.roleId as roleId'])
            .where(where.condition.join(' AND '), where.params)
            .andWhere('rp.deleteFlag = 0')
            .getRawOne()
    },

    checkIsPageCreator (createUser, id) {
        return getRepository(Page).find({ id, createUser })
    },

    findPagePreviewImg (id) {
        return getRepository(Page).findOne({
            where: { id },
            select: ['previewImg']
        })
    }
}
