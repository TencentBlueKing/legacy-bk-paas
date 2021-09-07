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
import CompCategory from './entities/comp-category'
import UserProjectRole from './entities/user-project-role'
import CompShare from './entities/comp-share'
import PageComp from './entities/page-comp'
import ProjectFuncGroup from './entities/project-func-group'
import ProjectPage from './entities/project-page'
import ProjectFavourite from './entities/project-favourite'
import FuncGroup from './entities/func-group'
import Func from './entities/func'
import Route from './entities/route'
import PageRoute from './entities/page-route'
import LayoutInst from './entities/layout-inst'
import Variable from './entities/variable'
import PageVariable from './entities/page-variable'
import FuncVariable from './entities/func-variable'
import VariableFunc from './entities/variable-func'
import VariableVariable from './entities/variable-variable'
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
            funcBody: `return this.$http.get(\'${host}/api/data/getMockData\').then((res) => {\r\n    const data = JSON.stringify(res)\r\n    alert(data)\r\n    return res.data\r\n})\r\n`,
            funcSummary: '获取mock数据',
            funcType: 0,
            funcCode: 'getMockData'
        },
        {
            funcName: 'getApiData',
            remoteParams: 'res',
            funcBody: 'const data = res.data || []\r\nreturn data\r\n',
            funcSummary: '远程函数，获取数据',
            funcType: 1,
            funcMethod: 'get',
            funcApiUrl: `${host}/api/data/getMockData`,
            funcCode: 'getApiData'
        }
    ]
}

export default {
    getDataByIds: async function (params = []) {
        const res = await getRepository(Project)
            .createQueryBuilder('prroject')
            .select('prroject.*')
            .where('prroject.id IN (:...ids)', { ids: params })
            .getRawMany()
        return res
    },

    createProject (projectData, userProjectRoleData, layoutData) {
        const project = getRepository(Project).create(projectData)

        return getConnection().transaction(async transactionalEntityManager => {
            // 创建项目基本信息记录
            const { id: projectId } = await transactionalEntityManager.save(project)

            // 创建用户项目角色关联记录
            userProjectRoleData.projectId = projectId
            const userProjectRole = getRepository(UserProjectRole).create(userProjectRoleData)
            await transactionalEntityManager.save(userProjectRole)

            // 创建默认组件分类，由于暂不复制组件因此无论是否复制都需创建默认分类
            const compCategory = getRepository(CompCategory).create({
                name: '默认分类',
                belongProjectId: projectId,
                order: -1
            })
            await transactionalEntityManager.save(compCategory)

            // 复制项目
            if (projectData.copyFrom) {
                // copy项目中的组件/函数/页面/布局/变量
                const [projectCompCopyValues, projectFuncGroupCopyValues, projectPageCopyValues, projectLayoutValues, variableList] = await Promise.all([
                    getRepository(Comp)
                        .createQueryBuilder('comp')
                        .where('comp.belongProjectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(ProjectFuncGroup)
                        .createQueryBuilder('projectFuncGroup')
                        .where('projectFuncGroup.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(ProjectPage)
                        .createQueryBuilder('projectPage')
                        .where('projectPage.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(LayoutInst)
                        .createQueryBuilder('layoutInst')
                        .where('layoutInst.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany(),
                    getRepository(Variable)
                        .createQueryBuilder('variable')
                        .where('variable.projectId = :projectId', { projectId: projectData.copyFrom })
                        .getMany()
                ])

                if (projectCompCopyValues.length) {
                    const copmIdList = projectCompCopyValues.map(item => item.id)
                    // 新建组件共享记录，复制项目则项目下的组件全部对目标项目公开
                    const saveCompShares = getRepository(CompShare).create(copmIdList.map(compId => {
                        return {
                            compId,
                            sourceProjectId: projectData.copyFrom,
                            targetProjectId: projectId
                        }
                    }))
                    await transactionalEntityManager.save(saveCompShares)

                    // 公开给源项目的组件需要公开给新项目
                    const sourceCompShareList = await getRepository(CompShare).find({
                        where: { targetProjectId: projectData.copyFrom }
                    })
                    const saveTargetCompShares = getRepository(CompShare).create(sourceCompShareList.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.targetProjectId = projectId
                        return others
                    }))
                    await transactionalEntityManager.save(saveTargetCompShares)
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

                const layoutIdMap = {}
                if (projectLayoutValues.length) {
                    const saveCopyLayouts = getRepository(LayoutInst).create(projectLayoutValues.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectId
                        return others
                    }))
                    const newLayoutList = await transactionalEntityManager.save(saveCopyLayouts)
                    projectLayoutValues.forEach((item, index) => {
                        layoutIdMap[item.id] = newLayoutList[index].id
                    })
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

                    // 建立新老页面id的映射
                    const pageIdMap = {}
                    pageIdList.forEach((id, index) => {
                        pageIdMap[id] = newPageList[index].id
                    })
                    // 新建页面函数关联记录
                    if (Object.keys(funcIdMap).length) {
                        const saveCopyPageFuncs = getRepository(PageFunc).create(copyPageFuncs.map(item => {
                            const { id, createTime, updateTime, ...others } = item
                            others.pageId = pageIdMap[others.pageId]
                            others.funcId = funcIdMap[others.funcId]
                            others.projectId = projectId
                            return others
                        }))
                        await transactionalEntityManager.save(saveCopyPageFuncs)
                    }

                    // 页面路由信息，目前未绑定页面的路由在当前逻辑下不会被复制
                    const copyPageRoutes = await getRepository(PageRoute)
                        .createQueryBuilder('pageRoute')
                        .where('pageRoute.pageId IN (:...pageIds)', { pageIds: pageIdList })
                        .getMany()

                    if (copyPageRoutes && copyPageRoutes.length) {
                        const routeIdList = copyPageRoutes.map(item => item.routeId)
                        const copyRoutes = await getRepository(Route)
                            .createQueryBuilder('route')
                            .where('route.id IN (:...ids)', { ids: routeIdList })
                            .getMany()

                        const saveCopyRoutes = getRepository(Route).create(copyRoutes.map(item => {
                            const { id, createTime, updateTime, ...others } = item
                            return others
                        }))
                        const newRouteList = await transactionalEntityManager.save(saveCopyRoutes)
                        const saveCopyPageRoutes = getRepository(PageRoute).create(copyPageRoutes.map((item, index) => {
                            const { id, createTime, updateTime, ...others } = item
                            others.routeId = newRouteList[index].id
                            others.pageId = pageIdMap[others.pageId]
                            others.layoutId = layoutIdMap[others.layoutId]
                            others.projectId = projectId
                            return others
                        }))
                        await transactionalEntityManager.save(saveCopyPageRoutes)
                    }

                    // 新建页面组件关联记录
                    const copyPageComps = await getRepository(PageComp)
                        .createQueryBuilder('pageComp')
                        .where('pageComp.pageId IN (:...pageIds)', { pageIds: pageIdList })
                        .getMany()
                    const saveCopyPageComps = getRepository(PageComp).create(copyPageComps.map((item, index) => {
                        const { id, createTime, updateTime, ...others } = item
                        others.pageId = pageIdMap[others.pageId]
                        others.projectId = projectId
                        return others
                    }))
                    await transactionalEntityManager.save(saveCopyPageComps)
                }

                if (variableList.length) {
                    const saveVariableList = getRepository(Variable).create(variableList.map(item => {
                        const { id, createTime, updateTime, ...others } = item
                        others.projectId = projectId
                        return others
                    }))
                    const newVariableList = await transactionalEntityManager.save(saveVariableList)
                    // 建立新老变量id的映射
                    const variableIdMap = {}
                    variableList.forEach(({ id }, index) => {
                        variableIdMap[id] = newVariableList[index].id
                    })
                    const where = { projectId: projectData.copyFrom }
                    const [pageVariableList, funcVariableList, variableFuncList, variableVariableList] = await Promise.all([
                        getRepository(PageVariable).find({ where }),
                        getRepository(FuncVariable).find({ where }),
                        getRepository(VariableFunc).find({ where }),
                        getRepository(VariableVariable).find({ where })
                    ])
                    const savePageVariableList = getRepository(PageVariable).create(pageVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(savePageVariableList)
                    const saveFuncVariableList = getRepository(FuncVariable).create(funcVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveFuncVariableList)
                    const saveVariableFuncList = getRepository(VariableFunc).create(variableFuncList.map(item => {
                        const { id, createTime, updateTime, variableId, ...others } = item
                        others.projectId = projectId
                        others.variableId = variableIdMap[variableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveVariableFuncList)
                    const saveVariableVariableList = getRepository(VariableVariable).create(variableVariableList.map(item => {
                        const { id, createTime, updateTime, variableId, parentVariableId, ...others } = item
                        others.projectId = projectId
                        others.variableId = variableIdMap[variableId]
                        others.parentVariableId = variableIdMap[parentVariableId]
                        return others
                    }))
                    await transactionalEntityManager.save(saveVariableVariableList)
                }
            } else {
                // 创建默认函数分组和函数
                const funcGroup = getRepository(FuncGroup).create(defaultGroup)
                const { id: funcGroupId } = await transactionalEntityManager.save(funcGroup)
                const curCtx = RequestContext.getCurrentCtx()
                const defaultFunc = getDefaultFunc(curCtx.origin)
                defaultFunc.forEach((func) => (func.funcGroupId = funcGroupId))
                const funcs = getRepository(Func).create(defaultFunc)
                await transactionalEntityManager.save(funcs)
                const projectFuncGroup = getRepository(ProjectFuncGroup).create({ projectId, funcGroupId })
                await transactionalEntityManager.save(projectFuncGroup)

                // 添加布局模板到项目
                const saveLayoutInstList = getRepository(LayoutInst).create(layoutData.map((item, index) => {
                    return {
                        projectId,
                        layoutId: item.layoutId,
                        content: item.content,
                        routePath: item.routePath,
                        isDefault: item.isDefault ? 1 : 0,
                        showName: item.showName,
                        layoutCode: item.layoutCode
                    }
                }))
                await transactionalEntityManager.save(saveLayoutInstList)
            }

            return { projectId }
        })
    },

    findOneProjectByNameAndUserId (projectName, userId) {
        return getRepository(Project).createQueryBuilder('project')
            .leftJoinAndSelect(UserProjectRole, 't', 't.projectId = project.id')
            .where('BINARY project.projectName = :projectName AND t.deleteFlag = 0', { projectName })
            .andWhere('t.userId = :userId', { userId })
            .getMany()
    },

    findOneProjectByCodeAndUserId (projectCode, userId) {
        return getRepository(Project).createQueryBuilder('project')
            .leftJoinAndSelect(UserProjectRole, 't', 't.projectId = project.id')
            .where('project.projectCode = :projectCode AND t.deleteFlag = 0', { projectCode })
            .andWhere('t.userId = :userId', { userId })
            .getMany()
    },

    findUserProjectById (userId, id) {
        return getRepository(Project).createQueryBuilder('project')
            .leftJoinAndSelect(UserProjectRole, 't', 't.projectId = project.id')
            .where('project.id = :id', { id })
            .andWhere('t.userId = :userId AND t.deleteFlag = 0', { userId })
            .getOne()
    },

    findProjectDetail (params) {
        const queryParams = Object.assign({}, params, { deleteFlag: 0 })
        return getRepository(Project).findOne(queryParams)
    },

    findProjects (params) {
        const queryParams = Object.assign({}, params, { deleteFlag: 0 })
        return getRepository(Project).find(queryParams)
    },

    queryAllProject ({ condition = '', params = {} }) {
        const currentUser = RequestContext.getCurrentUser() || {}
        const userId = currentUser.id
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id')
            .select(projectSelectFields)
            .where('project.deleteFlag != 1 AND user_project_role.deleteFlag != 1 AND user_project_role.userId = :userId', { userId })
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyCreateProject ({ condition = '', params = {}, select }) {
        const currentUser = RequestContext.getCurrentUser() || {}
        const userId = currentUser.id
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id')
            .select(select || projectSelectFields)
            .where('project.deleteFlag != 1 AND user_project_role.deleteFlag != 1 AND user_project_role.userId = :userId', { userId })
            .andWhere(condition, params)
            .orderBy('project.id', 'DESC')
            .getMany()
    },

    queryMyFavoriteProject ({ condition = '', params = {} }) {
        const currentUser = RequestContext.getCurrentUser() || {}
        const userId = currentUser.id
        return getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id')
            .innerJoinAndSelect('r_favourite', 'favourite', 'favourite.projectId = project.id')
            .where('project.deleteFlag != 1 AND user_project_role.deleteFlag != 1 AND user_project_role.userId = :userId', { userId })
            .andWhere(condition, params)
            .select(projectSelectFields)
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
                'page.deleteFlag as deleteFlag',
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
