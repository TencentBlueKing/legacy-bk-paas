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
import Project from './entities/project'
import Page from './entities/page'
import UserProjectRole from './entities/user-project-role'
import ProjectComp from './entities/project-comp'
import ProjectFuncGroup from './entities/project-func-group'
import ProjectPage from './entities/project-page'
import ProjectFavourite from './entities/project-favourite'
import FuncGroup from './entities/func-group'
import Func from './entities/func'

const projectSelectFields = [
    'project.id',
    'project.projectCode',
    'project.projectName',
    'project.projectDesc',
    'project.status',
    'project.createTime',
    'project.createUser'
]

const defaultGroup = {
    groupName: '默认分类'
}
const defaultFunc = [
    {
        funcName: 'getMockData',
        funcBody: 'this.$http.get(\"/data/getMockData\").then((res) => {\r\n    const data = JSON.stringify(res)\r\n    alert(data)\r\n})',
        funcSummary: '获取mock数据',
        funcType: 0
    },
    {
        funcName: 'getApiData',
        funcParams: 'res',
        funcBody: 'const data = res.data || []\r\nreturn data',
        funcSummary: '远程函数，获取数据',
        funcType: 1,
        funcMethod: 'get',
        funcApiUrl: 'api/data/getMockData',
    }
]

export default {
    createProject (projectData, userProjectRoleData) {
        const project = getRepository(Project).create(projectData)

        return getConnection().transaction(async transactionalEntityManager => {
            // 创建项目基本信息记录
            const { id: projectId } = await transactionalEntityManager.save(project)

            // 创建用户项目角色关联记录
            userProjectRoleData.projectId = projectId
            const userProjectRole = getRepository(UserProjectRole).create(userProjectRoleData)
            await transactionalEntityManager.save(userProjectRole)

            // 复制项目
            if (projectData.copyFrom) {
                // copy项目中的组件/函数/页面
                const [projectCompCopyValues, projectFuncGroupCopyValues, projectPageCopyValues] = await Promise.all([
                    getRepository(ProjectComp)
                        .createQueryBuilder('projectComp')
                        .where('projectComp.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(ProjectFuncGroup)
                        .createQueryBuilder('projectFuncGroup')
                        .where('projectFuncGroup.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(ProjectPage)
                        .createQueryBuilder('projectPage')
                        .where('projectPage.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany()
                ])

                const getNewValue = (item) => {
                    const { id, ...others } = item
                    others.projectId = projectId
                    return others
                }
                const projectCompValues = getRepository(ProjectComp).create(projectCompCopyValues.map(getNewValue))
                const projectFuncGroupValues = getRepository(ProjectFuncGroup).create(projectFuncGroupCopyValues.map(getNewValue))
                const projectPageValues = getRepository(ProjectPage).create(projectPageCopyValues.map(getNewValue))

                await Promise.all([
                    await transactionalEntityManager.save(projectCompValues),
                    await transactionalEntityManager.save(projectFuncGroupValues),
                    await transactionalEntityManager.save(projectPageValues)
                ])
            } else {
                const funcGroup = getRepository(FuncGroup).create(defaultGroup)
                const { id: funcGroupId } = await transactionalEntityManager.save(funcGroup)
                defaultFunc.forEach((func) => (func.funcGroupId = funcGroupId))
                const funcs = getRepository(Func).create(defaultFunc)
                await transactionalEntityManager.save(funcs)
                const projectFuncGroup = getRepository(ProjectFuncGroup).create({ projectId, funcGroupId })
                await transactionalEntityManager.save(projectFuncGroup)
            }

            return { projectId }
        })
    },

    findOneProjectByName (projectName) {
        return getRepository(Project).findOne({ projectName })
    },

    findOneProjectByCode (projectCode) {
        return getRepository(Project).findOne({ projectCode })
    },

    findProjectDetail (params) {
        const queryParams = Object.assign({}, params, { deleteFlag: 0 })
        return getRepository(Project).findOne(queryParams)
    },

    queryAllProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id')
            .select(projectSelectFields)
            .where('project.status != 2')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyCreateProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .select(projectSelectFields)
            .where('project.status != 2')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyFavoriteProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_favourite', 'favourite', 'favourite.projectId = project.id')
            .select(projectSelectFields)
            .where('project.status != 2')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryShareWithProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id AND user_project_role.roleId != 1')
            .select(projectSelectFields)
            .where('project.status != 2')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryProjectPage ({ condition = '', params = {} }) {
        return getRepository(Page)
            .createQueryBuilder('page')
            .innerJoinAndSelect('r_project_page', 'project_page', 'project_page.pageId = page.id')
            .select(['page.pageName', 'page.updateTime', 'page.updateUser', 'project_page.projectId'])
            .where(condition, params)
            .orderBy('page.updateTime', 'DESC')
            .getRawMany()
    },

    updateProject (id, fields = {}) {
        return getRepository(Project).update(id, fields)
    },

    addFavorite (data) {
        const repository = getRepository(ProjectFavourite)
        const projectFavourite = repository.create(data)
        return repository.save(projectFavourite)
    },

    removeFavorite (data) {
        const repository = getRepository(ProjectFavourite)
        return repository.delete(data)
    }
}
