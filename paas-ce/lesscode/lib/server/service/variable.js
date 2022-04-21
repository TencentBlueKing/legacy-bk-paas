import { getRepository, IsNull } from 'typeorm'
import Variable from '../model/entities/variable'
import PageVariable from '../model/entities/page-variable'
import FuncVariable from '../model/entities/func-variable'
import VariableFunc from '../model/entities/variable-func'
import VariableVariable from '../model/entities/variable-variable'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'

const getProjectVariableList = async (projectId, versionId) => getRepository(Variable).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getPageVariableList = async (projectId, versionId) => getRepository(PageVariable).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getFuncVariableList = async (projectId, versionId) => getRepository(FuncVariable).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getVariableFuncList = async (projectId, versionId) => getRepository(VariableFunc).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getVariableVariableList = async (projectId, versionId) => getRepository(VariableVariable).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getNewVariableEntities = (list, { projectId, newVersionId }) => getRepository(Variable).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.projectId = projectId
    others.versionId = newVersionId
    return others
}))

const buildRelationEntities = ({ projectId, newVersionId, variableIdMap }) => item => {
    const { id, createTime, updateTime, variableId, parentVariableId, ...others } = item
    others.projectId = projectId
    others.versionId = newVersionId
    others.variableId = variableIdMap[variableId]

    // 变量引用变更时存在
    if (parentVariableId) {
        others.parentVariableId = variableIdMap[parentVariableId]
    }

    return others
}
const createRelationEntities = compose(map, buildRelationEntities)

const getNewPageVariableEntities = (list, extra) => getRepository(PageVariable).create(createRelationEntities(extra)(list))

const getNewFuncVariableEntities = (list, extra) => getRepository(FuncVariable).create(createRelationEntities(extra)(list))

const getNewVariableFuncEntities = (list, extra) => getRepository(VariableFunc).create(createRelationEntities(extra)(list))

const getNewVariableVariableEntities = (list, extra) => getRepository(VariableVariable).create(createRelationEntities(extra)(list))

const versionTask = async (ctx, next) => {
    const { projectId, versionId, newVersionId } = ctx
    const projectVariableList = await getProjectVariableList(projectId, versionId)

    if (!projectVariableList.length) {
        await next()
        return
    }

    const newVariableList = await ctx.queryRunner.manager.save(getNewVariableEntities(projectVariableList, { projectId, newVersionId }))

    // 建立新老变量id的映射
    const variableIdMap = {}
    projectVariableList.forEach(({ id }, index) => {
        variableIdMap[id] = newVariableList[index].id
    })

    const [pageVariableList, funcVariableList, variableFuncList, variableVariableList] = await Promise.all([
        getPageVariableList(projectId, versionId),
        getFuncVariableList(projectId, versionId),
        getVariableFuncList(projectId, versionId),
        getVariableVariableList(projectId, versionId)
    ])

    const extraData = { projectId, newVersionId, variableIdMap }

    await Promise.all([
        ctx.queryRunner.manager.save(getNewPageVariableEntities(pageVariableList, extraData)),
        ctx.queryRunner.manager.save(getNewFuncVariableEntities(funcVariableList, extraData)),
        ctx.queryRunner.manager.save(getNewVariableFuncEntities(variableFuncList, extraData)),
        ctx.queryRunner.manager.save(getNewVariableVariableEntities(variableVariableList, extraData))
    ])

    await next()
}

export default {
    versionTask
}
