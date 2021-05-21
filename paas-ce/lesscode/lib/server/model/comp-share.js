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
import CompShare from './entities/comp-share'
import Project from './entities/project'

export const getAll = async function (params) {
    const res = await getRepository(CompShare).find({
        where: params
    })
    return res
}

export const getCompSourceProject = async function (targetProjectId) {
    const res = await getRepository(CompShare)
        .createQueryBuilder('cs')
        .leftJoin(Project, 'proj', 'proj.id = cs.sourceProjectId')
        .select('cs.compId', 'compId')
        .addSelect('proj.projectName', 'projectName')
        .where('cs.targetProjectId = :targetProjectId', { targetProjectId })
        .getRawMany()
    return res
}

export const getTargetProjectByCompIds = async function (compIds) {
    const res = await getRepository(CompShare)
        .createQueryBuilder('cs')
        .leftJoin(Project, 'proj', 'proj.id = cs.targetProjectId')
        .select('cs.compId', 'compId')
        .addSelect('proj.id', 'projectId')
        .addSelect('proj.projectName', 'projectName')
        .where('cs.compId IN (:...ids)', { ids: compIds })
        .getRawMany()
    return res
}
