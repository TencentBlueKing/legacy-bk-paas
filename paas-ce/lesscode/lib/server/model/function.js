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

import { getRepository, getConnection, In, Like } from 'typeorm'
import Func from './entities/func'
import FuncGroup from './entities/func-group'
import ProjectFuncGroup from './entities/project-func-group'
import PageFuncGroup from './entities/page-func-group'
import Page from './entities/page'

const func = {
    addFuncGroup (data) {
        return getConnection().transaction(async transactionalEntityManager => {
            const projectId = data.projectId
            const inputStr = data.inputStr
            const groupNames = inputStr.split('/')
            const funcGroupRepository = getRepository(FuncGroup)
            const allgroup = await func.getGroupList(projectId, '') || []
            const lastGroup = allgroup[allgroup.length - 1] || {}
            let order = lastGroup.order || 0
            const funcGroupEntities = groupNames.map((groupName) => {
                order++
                return funcGroupRepository.create({ groupName, order })
            })
            const groupList = await transactionalEntityManager.save(funcGroupEntities)
            const projectFuncGroupRepository = getRepository(ProjectFuncGroup)
            const projectFuncGroupEntities = groupList.map(({ id }) => projectFuncGroupRepository.create({ funcGroupId: id, projectId }))
            await transactionalEntityManager.save(projectFuncGroupEntities)
            return groupList.map((group) => {
                group.functionList = []
                return group
            })
        })
    },

    getGroupList (projectId, groupName) {
        return getRepository(FuncGroup).createQueryBuilder('func_group')
            .leftJoin(ProjectFuncGroup, 't', 't.funcGroupId = func_group.id AND t.deleteFlag = 0')
            .leftJoin(Func, 'func', 'func.funcGroupId = func_group.id AND func.deleteFlag = 0 ')
            .where('t.projectId = :projectId AND func_group.deleteFlag = :deleteFlag AND func_group.groupName like :groupName', { projectId, deleteFlag: 0, groupName: `%${groupName}%` })
            .select('func_group.groupName AS groupName, func_group.id AS id, COUNT(func.id) AS funNum')
            .addSelect('func_group.order', 'order')
            .groupBy('func_group.id')
            .orderBy('func_group.order')
            .getRawMany()
    },

    deleteFuncGroup (query) {
        return getConnection().transaction(async transactionalEntityManager => {
            const groupId = query.id
            const projectId = query.projectId
            const deleteFuncGroup = await transactionalEntityManager.findOne(FuncGroup, { id: groupId })
            deleteFuncGroup.deleteFlag = 1
            deleteFuncGroup.order = 0
            const deleteProjFuncGroup = await transactionalEntityManager.findOne(ProjectFuncGroup, { funcGroupId: groupId, projectId })
            deleteProjFuncGroup.deleteFlag = 1
            await transactionalEntityManager.save([deleteFuncGroup, deleteProjFuncGroup])
        })
    },

    async editFuncGroups (groupList) {
        const groupRepository = getRepository(FuncGroup)
        const oldGroupList = await groupRepository.find({ id: In(groupList.map(x => x.id)) })
        oldGroupList.forEach(group => {
            const newGroup = groupList.find(x => x.id === group.id)
            Object.assign(group, newGroup)
        })
        const res = await groupRepository.save(oldGroupList)
        return res
    },

    getFuncList (groupIds, funcName) {
        const funcRepository = getRepository(Func)
        return funcRepository.find({
            where: {
                funcGroupId: In(groupIds),
                deleteFlag: 0,
                funcName: Like(`%${funcName}%`)
            },
            order: {
                order: 'DESC'
            }
        })
    },

    getFuncRelatePageList (funcIds) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoin(PageFuncGroup, 'pageFuncGroup', 'page.id = pageFuncGroup.pageId AND pageFuncGroup.deleteFlag = 0')
            .where('pageFuncGroup.funcId IN (:...funcIds)', { funcIds })
            .andWhere('page.deleteFlag = :deleteFlag', { deleteFlag: 0 })
            .select('page.*, pageFuncGroup.funcId AS funcId')
            .getRawMany()
    },

    addFunction (funcData) {
        const funcRepository = getRepository(Func)
        funcData.funcParams = (funcData.funcParams || []).join(',')
        const newFunc = funcRepository.create(funcData)
        return funcRepository.save(newFunc)
    },

    async deleteFunction (id) {
        const funcRepository = getRepository(Func)
        const deleteFunc = await funcRepository.findOne({ where: { id } })
        deleteFunc.deleteFlag = 1
        return funcRepository.save(deleteFunc)
    },

    async editFunction (funcList) {
        const funcRepository = getRepository(Func)
        const oldFuncList = await funcRepository.find({ id: In(funcList.map(x => x.id)) })
        oldFuncList.forEach(func => {
            const newFunc = funcList.find(x => x.id === func.id)
            newFunc.funcParams = (newFunc.funcParams || []).join(',')
            Object.assign(func, newFunc)
        })
        const res = await funcRepository.save(oldFuncList)
        return res
    }
}

module.exports = func
