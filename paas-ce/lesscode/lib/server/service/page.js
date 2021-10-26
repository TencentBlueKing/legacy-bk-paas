/* eslint-disable no-unused-vars */
import { getRepository, IsNull, In } from 'typeorm'
import Page from '../model/entities/page'
import ProjectPage from '../model/entities/project-page'
import PageFunc from '../model/entities/page-func'
import PageComp from '../model/entities/page-comp'

// 获取项目下对应版本的页面关联记录
const getProjectPageList = async (projectId, versionId) => getRepository(ProjectPage).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getPageListByIds = async ids => getRepository(Page).find({ where: { id: In(ids) } })

const getNewPageEntities = list => getRepository(Page).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    return others
}))
const getNewProjectPageEntities = (list, { projectId, newVersionId, pageIdMap }) => getRepository(ProjectPage).create(list.map((item) => {
    const { id, createTime, updateTime, ...others } = item
    others.projectId = projectId
    others.versionId = newVersionId
    others.pageId = pageIdMap[others.pageId]
    return others
}))

const getPageFuncListByIds = async ids => getRepository(PageFunc).find({ where: { pageId: In(ids) } })
const getNewPageFuncEntities = (list, { projectId, newVersionId, pageIdMap, funcIdMap }) => getRepository(PageFunc).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.pageId = pageIdMap[others.pageId]
    others.funcId = funcIdMap[others.funcId]
    others.projectId = projectId
    others.versionId = newVersionId
    return others
}))

const getPageCompListByIds = async ids => getRepository(PageComp).find({ where: { pageId: In(ids) } })
const getNewPageCompEntities = (list, { projectId, newVersionId, pageIdMap }) => getRepository(PageComp).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.pageId = pageIdMap[others.pageId]
    others.projectId = projectId
    others.projectVersionId = newVersionId
    return others
}))

const versionTask = async (ctx, next) => {
    const { projectId, versionId, newVersionId } = ctx
    const projectPageList = await getProjectPageList(projectId, versionId)

    // 不存在页面数据直接进入下一步骤
    if (!projectPageList.length) {
        await next()
        return
    }

    const pageIdList = projectPageList.map(item => item.pageId)

    const pageList = await getPageListByIds(pageIdList)
    const newPageList = await ctx.queryRunner.manager.save(getNewPageEntities(pageList))

    // 建立新老页面id的映射，在布局与路由等页面关联中使用
    const pageIdMap = {}
    pageIdList.forEach((id, index) => {
        pageIdMap[id] = newPageList[index].id
    })

    const newProjectPageEntities = getNewProjectPageEntities(projectPageList, { projectId, newVersionId, pageIdMap })
    await ctx.queryRunner.manager.save(newProjectPageEntities)

    // 放入到ctx，在布局与路由等关联中使用
    ctx.pageIdMap = pageIdMap

    await next()

    // 此处能保证ctx中依赖的数据都存在
    const { funcIdMap = {} } = ctx
    if (!pageIdList.length || !Object.keys(funcIdMap).length) return

    // 新建页面函数关联记录
    const pageFuncList = await getPageFuncListByIds(pageIdList)
    const newPageFuncEntities = getNewPageFuncEntities(pageFuncList, { projectId, newVersionId, pageIdMap, funcIdMap })
    await ctx.queryRunner.manager.save(newPageFuncEntities)

    // 新建页面组件关联记录
    const pageCompList = await getPageCompListByIds(pageIdList)
    const newPageCompEntities = getNewPageCompEntities(pageCompList, { projectId, newVersionId, pageIdMap })
    await ctx.queryRunner.manager.save(newPageCompEntities)
}

export default {
    versionTask
}
