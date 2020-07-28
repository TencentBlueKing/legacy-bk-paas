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
    getProjectPages (projectId) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere('page.deleteFlag = 0')
            .getMany()
    },

    checkProjectPageExist (projectId, pageName) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoinAndSelect(ProjectPage, 't', 't.pageId = page.id')
            .where('t.projectId = :projectId', { projectId })
            .andWhere('page.pageName = :pageName', { pageName })
            .getMany()
    },

    createPage (pageData, projectPageData) {
        const page = getRepository(Page).create(pageData)

        return getConnection().transaction(async transactionalEntityManager => {
            // 创建项目基本信息记录
            const { id: pageId } = await transactionalEntityManager.save(page)

            // 创建用户项目角色关联记录
            projectPageData.pageId = pageId

            const projectPage = getRepository(ProjectPage).create(projectPageData)
            await transactionalEntityManager.save(projectPage)

            return { id: pageId }
        })
    }

    // getGroupList (projectId) {
    
    // },

    // deleteFuncGroup (groupId) {
    //     const groupRepository = getRepository(FuncGroup)
    //     return groupRepository.delete({ where: { id: groupId } })
    // },

    // async editFuncGroup (group) {
    //     const groupRepository = getRepository(FuncGroup)
    //     const oldData = await groupRepository.findOne({ where: { id: group.id } })
    //     Object.assign(oldData, group)
    //     const res = await groupRepository.save(oldData)
    //     return res
    // },

    // getFuncList (groupId) {
    //     const funcRepository = getRepository(Func)
    //     return funcRepository.find({ where: { funcGroupId: groupId } })
    // },

    // addFunction (funcData) {
    //     const funcRepository = getRepository(Func)
    //     const newFunc = funcRepository.create(funcData)
    //     return funcRepository.save(newFunc)
    // },

    // deleteFunction (funcId) {
    //     const funcRepository = getRepository(Func)
    //     return funcRepository.delete({ where: { id: funcId } })
    // },

    // async editFunction (funcData) {
    //     const funcRepository = getRepository(Func)
    //     const oldData = await funcRepository.findOne({ where: { id: funcData.id } })
    //     Object.assign(oldData, funcData)
    //     const res = await funcRepository.save(oldData)
    //     return res
    // }
}
