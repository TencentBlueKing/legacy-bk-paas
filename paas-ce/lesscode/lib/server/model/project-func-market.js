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
import { RequestContext } from '../middleware/request-context'
import ProjectFuncMarket from './entities/project-func-market'
import Project from './entities/project'

const projectFuncMarket = {
    getList (funcMarketId) {
        const currentUser = RequestContext.getCurrentUser() || {}
        return getRepository(ProjectFuncMarket)
            .createQueryBuilder('projectFuncMarket')
            .leftJoin(Project, 'project', 'project.id = projectFuncMarket.projectId')
            .select('project.id', 'id')
            .addSelect('project.projectName', 'projectName')
            .where({ deleteFlag: 0, funcMarketId, createUser: currentUser.username })
    },

    add (relation) {
        const projectFuncMarketRepository = getRepository(ProjectFuncMarket)
        const newRelation = projectFuncMarketRepository.create(relation)
        return projectFuncMarketRepository.save(newRelation)
    },

    async delete (projectFuncId) {
        const projectFuncMarketRepository = getRepository(ProjectFuncMarket)
        const deleteRelation = await projectFuncMarketRepository.findOne({ where: { projectFuncId } })
        if (deleteRelation) {
            await projectFuncMarketRepository.remove(deleteRelation)
        }
    }
}

module.exports = projectFuncMarket
