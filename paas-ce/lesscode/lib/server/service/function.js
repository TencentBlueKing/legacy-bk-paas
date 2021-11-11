import { getRepository, IsNull, In } from 'typeorm'
import Func from '../model/entities/func'
import FuncGroup from '../model/entities/func-group'
import ProjectFuncGroup from '../model/entities/project-func-group'
import FuncFunc from '../model/entities/func-func'

// 获取项目下对应版本的函数关联记录
const getProjectFuncGroupList = async (projectId, versionId) => getRepository(ProjectFuncGroup).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getFuncGroupListByIds = async ids => getRepository(FuncGroup).findByIds(ids)

const getFuncListByGroupIds = async ids => getRepository(Func).find({ where: { funcGroupId: In(ids) } })

const getProjectFuncFuncList = async (projectId, versionId) => getRepository(FuncFunc).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getNewFuncFuncEntities = (list, { projectId, newVersionId }) => getRepository(FuncFunc).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.projectId = projectId
    others.newVersionId = newVersionId
    return others
}))

const getNewFuncGroupEntities = list => getRepository(FuncGroup).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    return others
}))

const getNewFuncEntities = (list, { funcGroupIdMap }) => getRepository(Func).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.funcGroupId = funcGroupIdMap[others.funcGroupId]
    return others
}))

const getNewProjectFuncGroupEntities = (list, { projectId, newVersionId, funcGroupIdMap }) => getRepository(ProjectFuncGroup).create(list.map((item) => {
    const { id, createTime, updateTime, ...others } = item
    others.projectId = projectId
    others.versionId = newVersionId
    others.funcGroupId = funcGroupIdMap[others.funcGroupId]
    return others
}))

const versionTask = async (ctx, next) => {
    const { projectId, versionId, newVersionId } = ctx
    const projectFuncGroupList = await getProjectFuncGroupList(projectId, versionId)

    if (!projectFuncGroupList.length) {
        await next()
        return
    }

    const funcGroupIdList = projectFuncGroupList.map(item => item.funcGroupId)

    const funcGroupList = await getFuncGroupListByIds(funcGroupIdList)
    const newFuncGroupList = await ctx.queryRunner.manager.save(getNewFuncGroupEntities(funcGroupList))

    // 新函数中的分组id需要与新添加的函数组id对应
    const funcGroupIdMap = {}
    funcGroupIdList.forEach((id, index) => {
        funcGroupIdMap[id] = newFuncGroupList[index].id
    })

    // 创建项目函数组关联记录
    const newProjectFuncGroupEntities = getNewProjectFuncGroupEntities(projectFuncGroupList, { projectId, newVersionId, funcGroupIdMap })
    await ctx.queryRunner.manager.save(newProjectFuncGroupEntities)

    // 创建函数与函数关联记录
    const projectFuncFuncList = await getProjectFuncFuncList(projectId, versionId)
    const newProjectFuncFuncEntities = getNewFuncFuncEntities(projectFuncFuncList, { projectId, newVersionId })
    await ctx.queryRunner.manager.save(newProjectFuncFuncEntities)

    const funcList = await getFuncListByGroupIds(funcGroupIdList)
    const newFuncList = await ctx.queryRunner.manager.save(getNewFuncEntities(funcList, { funcGroupIdMap }))

    const funcIdMap = {}
    funcList.forEach((item, index) => {
        funcIdMap[item.id] = newFuncList[index].id
    })
    // 放入到ctx，在创建关联数据中使用
    ctx.funcIdMap = funcIdMap

    await next()
}

export default {
    versionTask
}
