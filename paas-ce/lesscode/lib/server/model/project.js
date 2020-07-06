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
import Project from './entities/project'
import Page from './entities/page'

export default {
    createProject (data) {
        const repository = getRepository(Project)
        const project = repository.create(data)
        return repository.save(project)
    },

    findOneProjectByName (projectName) {
        return getRepository(Project).findOne({ projectName })
    },

    findOneProjectByCode (projectCode) {
        return getRepository(Project).findOne({ projectCode })
    },

    qeuryProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            // .orderBy('project.id', 'DESC')
            .where(condition, params)
            .getMany()
    },

    queryProjectPage () {
        return getRepository(Page)
            .createQueryBuilder('page')
            .innerJoinAndSelect('r_project_page', 'project_page', 'project_page.pageId = page.id')
            .select(['pageName', 'updateTime', 'updateUser', 'project_page.projectId'])
            .orderBy('page.updateTime', 'DESC')
            .getRawMany()
    },

    updateProject (id, fields = {}) {
        return getRepository(Project).update(id, fields)
    }
}
