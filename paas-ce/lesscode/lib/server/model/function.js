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
import Func from './entities/func'
import FuncGroup from './entities/func-group'
import ProjectFuncGroup from './entities/project-func-group'

module.exports = {
    getGroupList (projectId) {
        return getRepository(FuncGroup).createQueryBuilder('func_group')
            .leftJoinAndSelect(ProjectFuncGroup, 't', 't.funcGroupId = func_group.id')
            .where('t.projectId = :projectId', { projectId })
            .getMany()
    },

    deleteFuncGroup (groupId) {
        const groupRepository = getRepository(FuncGroup)
        return groupRepository.delete({ where: { id: groupId } })
    },

    async editFuncGroup (group) {
        const groupRepository = getRepository(FuncGroup)
        const oldData = await groupRepository.findOne({ where: { id: group.id } })
        Object.assign(oldData, group)
        const res = await groupRepository.save(oldData)
        return res
    },

    getFuncList (groupId) {
        const funcRepository = getRepository(Func)
        return funcRepository.find({ where: { funcGroupId: groupId } })
    },

    addFunction (funcData) {
        const funcRepository = getRepository(Func)
        const newFunc = funcRepository.create(funcData)
        return funcRepository.save(newFunc)
    },

    deleteFunction (funcId) {
        const funcRepository = getRepository(Func)
        return funcRepository.delete({ where: { id: funcId } })
    },

    async editFunction (funcData) {
        const funcRepository = getRepository(Func)
        const oldData = await funcRepository.findOne({ where: { id: funcData.id } })
        Object.assign(oldData, funcData)
        const res = await funcRepository.save(oldData)
        return res
    }
}
