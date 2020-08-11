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
import PageFunc from './entities/page-func'
import Comp from './entities/comp'
import UserProjectRole from './entities/user-project-role'
import ProjectComp from './entities/project-comp'
import ProjectFuncGroup from './entities/project-func-group'
import ProjectPage from './entities/project-page'
import ProjectFavourite from './entities/project-favourite'
import FuncGroup from './entities/func-group'
import Func from './entities/func'
import { RequestContext } from '../middleware/request-context'

const projectSelectFields = [
    'project.id',
    'project.projectCode',
    'project.projectName',
    'project.projectDesc',
    'project.status',
    'project.createTime',
    'project.createUser',
    'project.deleteFlag'
]

const defaultGroup = {
    groupName: '默认分类'
}

const getDefaultFunc = function (host) {
    return [
        {
            funcName: 'getMockData',
            funcBody: `return this.$http.get(\"${host}/api/data/getMockData\").then((res) => {\r\n    const data = JSON.stringify(res)\r\n    alert(data)\r\n    return res.data\r\n})`,
            funcSummary: '获取mock数据',
            funcType: 0
        },
        {
            funcName: 'getApiData',
            remoteParams: 'res',
            funcBody: 'const data = res.data || []\r\nreturn data',
            funcSummary: '远程函数，获取数据',
            funcType: 1,
            funcMethod: 'get',
            funcApiUrl: `${host}/api/data/getMockData`
        }
    ]
}

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

                if (projectCompCopyValues.length) {
                    const compIdList = projectCompCopyValues.map(item => item.compId)
                    const copyComps = await getRepository(Comp)
                        .createQueryBuilder('comp')
                        .where('comp.id IN (:...ids)', { ids: compIdList })
                        .getMany()

                    const saveCopyComps = getRepository(Comp).create(copyComps.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.belongProjectId = projectId
                        return others
                    }))
                    const newCompList = await transactionalEntityManager.save(saveCopyComps)
                    const projectCompValues = getRepository(ProjectComp).create(projectCompCopyValues.map((item, index) => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectId
                        others.compId = newCompList[index].id
                        return others
                    }))
                    await transactionalEntityManager.save(projectCompValues)
                }

                const funcIdMap = {}
                if (projectFuncGroupCopyValues.length) {
                    const funcGroupIdList = projectFuncGroupCopyValues.map(item => item.funcGroupId)
                    // 得到要复制的主体数据
                    const copyFuncGroups = await getRepository(FuncGroup)
                        .createQueryBuilder('funcGroup')
                        .where('funcGroup.id IN (:...ids)', { ids: funcGroupIdList })
                        .getMany()
                    const copyFuncs = await getRepository(Func)
                        .createQueryBuilder('func')
                        .where('func.funcGroupId IN (:...funcGroupIds)', { funcGroupIds: funcGroupIdList })
                        .getMany()

                    // 新建函数组主体数据
                    const saveCopyFuncGroups = getRepository(FuncGroup).create(copyFuncGroups.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        return others
                    }))
                    const newFuncGroupList = await transactionalEntityManager.save(saveCopyFuncGroups)

                    // 复制出的新函数中的分组id需要与新添加的函数组id对应
                    const funcGroupIdMap = {}
                    funcGroupIdList.forEach((id, index) => {
                        funcGroupIdMap[id] = newFuncGroupList[index].id
                    })
                    // 新建函数主体数据
                    const saveCopyFuncs = getRepository(Func).create(copyFuncs.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.funcGroupId = funcGroupIdMap[others.funcGroupId]
                        return others
                    }))

                    const newFuncList = await transactionalEntityManager.save(saveCopyFuncs)
                    copyFuncs.forEach((item, index) => {
                        funcIdMap[item.id] = newFuncList[index].id
                    })

                    // 新建函数组与项目关联关系数据
                    const projectFuncGroupValues = getRepository(ProjectFuncGroup).create(projectFuncGroupCopyValues.map((item, index) => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectId
                        // 分组id为新建得到的分组id
                        others.funcGroupId = newFuncGroupList[index].id
                        return others
                    }))
                    await transactionalEntityManager.save(projectFuncGroupValues)
                }

                if (projectPageCopyValues.length) {
                    const pageIdList = projectPageCopyValues.map(item => item.pageId)
                    const copyPages = await getRepository(Page)
                        .createQueryBuilder('page')
                        .where('page.id IN (:...ids)', { ids: pageIdList })
                        .getMany()
                    const copyPageFuncs = await getRepository(PageFunc)
                        .createQueryBuilder('pageFuncs')
                        .where('pageFuncs.pageId IN (:...pageIds)', { pageIds: pageIdList })
                        .getMany()

                    // 先新建页面主体数据，再新建关联关系数据
                    const saveCopyPages = getRepository(Page).create(copyPages.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        return others
                    }))
                    const newPageList = await transactionalEntityManager.save(saveCopyPages)
                    const projectPageValues = getRepository(ProjectPage).create(projectPageCopyValues.map((item, index) => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectId
                        others.pageId = newPageList[index].id
                        return others
                    }))
                    await transactionalEntityManager.save(projectPageValues)

                    // 新建页面函数关联记录
                    if (Object.keys(funcIdMap).length) {
                        const pageIdMap = {}
                        pageIdList.forEach((id, index) => {
                            pageIdMap[id] = newPageList[index].id
                        })
                        const saveCopyPageFuncs = getRepository(PageFunc).create(copyPageFuncs.map(item => {
                            const { id, createTime, updateTime, ...others } = item
                            others.pageId = pageIdMap[others.pageId]
                            others.funcId = funcIdMap[others.funcId]
                            others.projectId = projectId
                            return others
                        }))
                        await transactionalEntityManager.save(saveCopyPageFuncs)
                    }
                }
            } else {
                const funcGroup = getRepository(FuncGroup).create(defaultGroup)
                const { id: funcGroupId } = await transactionalEntityManager.save(funcGroup)
                const curCtx = RequestContext.getCurrentCtx()
                const defaultFunc = getDefaultFunc(curCtx.origin)
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
            .where('project.deleteFlag != 1')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyCreateProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .select(projectSelectFields)
            .where('project.deleteFlag != 1')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyFavoriteProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_favourite', 'favourite', 'favourite.projectId = project.id')
            .select(projectSelectFields)
            .where('project.deleteFlag != 1')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryShareWithProject ({ condition = '', params = {} }) {
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id AND user_project_role.roleId != 1')
            .select(projectSelectFields)
            .where('project.deleteFlag != 1')
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryProjectPage ({ condition = '', params = {} }) {
        return getRepository(Page)
            .createQueryBuilder('page')
            .innerJoinAndSelect('r_project_page', 'project_page', 'project_page.pageId = page.id')
            .select(['page.pageName as pageName',
                'page.updateTime as updateTime',
                'page.updateUser as updateUser',
                'page.previewImg as previewImg',
                'project_page.projectId as projectId'
            ])
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
