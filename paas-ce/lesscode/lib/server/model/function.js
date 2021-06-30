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
import PageFunc from './entities/page-func'
import Page from './entities/page'
import FuncFunc from './entities/func-func'
import FuncVariable from './entities/func-variable'
import Variable from './entities/variable'
import VariableFunc from './entities/variable-func'

const func = {
    getFuncById (id) {
        const funcRepository = getRepository(Func)
        return funcRepository.findOne(id)
    },

    getFuncGroupById (id) {
        const funcGroupRepository = getRepository(FuncGroup)
        return funcGroupRepository.findOne(id)
    },

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

    async allGroupFuncDetail (projectId) {
        const groupList = await func.getGroupList(projectId, '')
        const groupIds = groupList.map(x => x.id)
        let allFuncList = []
        if (groupIds.length) allFuncList = await func.getFuncList(groupIds, '')
        const funcIds = allFuncList.map(x => x.id)
        let pageList = []
        if (funcIds.length) pageList = await func.getFuncRelatePageList(funcIds)
        const funcCodes = allFuncList.map(x => x.funcCode)
        let relateFuncs = []
        let relateVars = []
        if (funcCodes.length) {
            [relateFuncs, relateVars] = await Promise.all([
                getRepository(FuncFunc).find({ funcCode: In(funcCodes), deleteFlag: 0, projectId }),
                getRepository(VariableFunc).find({ funcCode: In(funcCodes), deleteFlag: 0, projectId })
            ]) || []
        }

        groupList.forEach((group) => {
            const functionList = allFuncList.filter((func) => (func.funcGroupId === group.id))
            group.functionList = functionList.map((func) => {
                const pages = pageList.filter(x => x.funcId === func.id)
                const useFlag = relateFuncs.findIndex(x => x.funcCode === func.funcCode) > -1
                const useInVar = relateVars.findIndex(x => x.funcCode === func.funcCode) > -1
                func.pages = pages
                func.funcParams = (func.funcParams || '').split(',').filter(x => x !== '')
                func.remoteParams = (func.remoteParams || '').split(',').filter(x => x !== '')
                func.useFlag = useFlag
                func.useInVar = useInVar
                return func
            })
        })
        return groupList || []
    },

    getGroupList (projectId, groupName) {
        return getRepository(FuncGroup).createQueryBuilder('func_group')
            .leftJoin(ProjectFuncGroup, 't', 't.funcGroupId = func_group.id AND t.deleteFlag = 0')
            .leftJoin(Func, 'func', 'func.funcGroupId = func_group.id AND func.deleteFlag = 0 ')
            .where('t.projectId = :projectId AND func_group.deleteFlag = :deleteFlag AND func_group.groupName like :groupName', { projectId, deleteFlag: 0, groupName: `%${groupName}%` })
            .select('func_group.groupName AS groupName, func_group.id AS id, func_group.createUser AS createUser, COUNT(func.id) AS funNum')
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
                updateTime: 'DESC'
            }
        })
    },

    getFuncRelatePageList (funcIds) {
        return getRepository(Page).createQueryBuilder('page')
            .leftJoin(PageFunc, 'PageFunc', 'page.id = PageFunc.pageId AND PageFunc.deleteFlag = 0')
            .where('PageFunc.funcId IN (:...funcIds)', { funcIds })
            .andWhere('page.deleteFlag = :deleteFlag', { deleteFlag: 0 })
            .select('page.id AS id, page.pageName AS pageName, PageFunc.funcId AS funcId')
            .getRawMany()
    },

    async addFunction (funcList, varWhere) {
        const funcRepository = getRepository(Func)
        funcList.forEach((funcData) => {
            funcData.funcParams = (funcData.funcParams || []).join(',')
            funcData.remoteParams = (funcData.remoteParams || []).join(',')
        })
        const newFuncs = funcRepository.create(funcList)
        const res = await funcRepository.save(newFuncs)
        await Promise.all(res.map((fun) => func.handleFuncRelation(fun, varWhere)))
        return res
    },

    async deleteFunction (id) {
        const funcRepository = getRepository(Func)
        const deleteFunc = await funcRepository.findOne({ where: { id } })
        deleteFunc.deleteFlag = 1
        await func.deleteFuncVariable(deleteFunc)
        return funcRepository.save(deleteFunc)
    },

    async editFunction (funcList, varWhere) {
        const funcRepository = getRepository(Func)
        const oldFuncList = await funcRepository.find({ id: In(funcList.map(x => x.id)) })
        for (const funcObj of oldFuncList) {
            const newFunc = funcList.find(x => x.id === funcObj.id)
            newFunc.funcParams = (newFunc.funcParams || []).join(',')
            newFunc.remoteParams = (newFunc.remoteParams || []).join(',')
            Object.assign(funcObj, newFunc)
            await func.handleFuncRelation(funcObj, varWhere)
        }
        const res = await funcRepository.save(oldFuncList)
        return res
    },

    async deleteFuncVariable (func) {
        const curProject = await getRepository(FuncGroup).createQueryBuilder('func_group')
            .leftJoin(ProjectFuncGroup, 't', 't.funcGroupId = func_group.id AND t.deleteFlag = 0')
            .leftJoin(Func, 'func', 'func.funcGroupId = func_group.id AND func.deleteFlag = 0 ')
            .where('func.id = :id', { id: func.id })
            .select('t.projectId AS projectId')
            .getRawOne()
        const funcVariableRepository = getRepository(FuncVariable)
        const exitsUsedVariables = await funcVariableRepository.find({ where: { projectId: curProject.projectId, funcCode: func.funcCode } }) || []
        await funcVariableRepository.remove(exitsUsedVariables)
    },

    async handleFuncRelation (func, varWhere) {
        const { projectId, pageCode, effectiveRange } = varWhere
        const variableWhere = [{ projectId, deleteFlag: 0 }]
        if (effectiveRange !== undefined) {
            variableWhere[0].effectiveRange = effectiveRange
        }
        if (pageCode) {
            variableWhere.push({ projectId, effectiveRange: 1, pageCode, deleteFlag: 0 })
        }
        const funcRelateRepository = getRepository(FuncFunc)
        const allFuncRelates = await funcRelateRepository.find({ parentFuncCode: func.funcCode, projectId })
        allFuncRelates.forEach((func) => (func.deleteFlag = 1))
        const newFuncRelates = [...allFuncRelates]
        // 当前用到的变量列表
        const funcVariableRepository = getRepository(FuncVariable)
        const variableRepository = getRepository(Variable)
        const [exitsUsedVariables, allVariables] = await Promise.all([
            funcVariableRepository.find({ where: { projectId, funcCode: func.funcCode } }),
            variableRepository.find({ where: variableWhere })
        ])
        const newUsedVariables = []
        function handleRelation (dirKey, funcCode) {
            if (funcCode) {
                const curRelate = allFuncRelates.find((func) => (func.funcCode === funcCode))
                if (curRelate) {
                    curRelate.deleteFlag = 0
                } else {
                    const newFunc = funcRelateRepository.create({
                        parentFuncCode: func.funcCode,
                        projectId,
                        funcCode,
                        deleteFlag: 0
                    })
                    newFuncRelates.push(newFunc)
                }
            }
            if (dirKey) {
                const curVariable = allVariables.find((variable) => (variable.variableCode === dirKey))
                if (!curVariable) return
                const exitsUsedVariable = exitsUsedVariables.find((variable) => (variable.variableId === curVariable.id))
                const isRepeatUse = newUsedVariables.find((variable) => (variable.variableId === curVariable.id))
                if (isRepeatUse) return
                if (exitsUsedVariable) {
                    newUsedVariables.push(exitsUsedVariable)
                } else {
                    newUsedVariables.push(funcVariableRepository.create({
                        projectId,
                        variableId: curVariable.id,
                        funcCode: func.funcCode
                    }))
                }
            }
        }
        (func.funcBody || '').replace(/lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/g, (all, first, second, dirKey, funcStr, funcCode) => {
            handleRelation(dirKey, funcCode)
        })
        if (func.funcType === 1) {
            (func.funcApiUrl || '').replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
                handleRelation(variableCode)
            });
            (func.funcApiData || '').replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
                handleRelation(variableCode)
            })
        }
        const removeUsedVariables = exitsUsedVariables.filter((variable) => (!newUsedVariables.find(x => x.variableId === variable.variableId)))
        await Promise.all([funcRelateRepository.save(newFuncRelates), funcVariableRepository.save(newUsedVariables), funcVariableRepository.remove(removeUsedVariables)])
    }
}

module.exports = func
