import { getRepository, IsNull, In } from 'typeorm'
import Route from '../model/entities/route'
import PageRoute from '../model/entities/page-route'

// 获取项目下对应版本的路由关联记录
const getProjectRouteList = async (projectId, versionId) => getRepository(PageRoute).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getRouteListByIds = async ids => getRepository(Route).find({ where: { id: In(ids) } })

const getNewRouteEntities = list => getRepository(Route).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    return others
}))

const getNewPageRouteEntities = (list, { projectId, newVersionId, routeIdMap, pageIdMap, layoutIdMap }) => getRepository(PageRoute).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    // 未绑定路由或页面或删除的路由值为-1
    others.routeId = others.routeId !== -1 ? routeIdMap[others.routeId] : -1
    others.pageId = others.pageId !== -1 ? pageIdMap[others.pageId] : -1
    others.redirect = others.redirect ? routeIdMap[others.redirect] : null
    others.layoutId = layoutIdMap[others.layoutId]
    others.projectId = projectId
    others.versionId = newVersionId
    return others
}))

const versionTask = async (ctx, next) => {
    const { projectId, versionId, newVersionId } = ctx
    const projectRouteList = await getProjectRouteList(projectId, versionId)

    if (!projectRouteList.length) {
        await next()
        return
    }

    const routeIdList = projectRouteList.map(item => item.routeId).filter(routeId => routeId !== -1)
    const routeList = await getRouteListByIds(routeIdList)
    const newRouteList = await ctx.queryRunner.manager.save(getNewRouteEntities(routeList))

    const routeIdMap = {}
    routeIdList.forEach((id, index) => (routeIdMap[id] = newRouteList[index].id))

    await next()

    // 此处能保证ctx中依赖的数据都存在，新建页面路由关联记录
    const { pageIdMap = {}, layoutIdMap = {} } = ctx
    if (!routeIdList.length || !Object.keys(pageIdMap).length || !Object.keys(layoutIdMap)) return

    const newProjectRouteEntities = getNewPageRouteEntities(projectRouteList, { projectId, newVersionId, routeIdMap, pageIdMap, layoutIdMap })
    await ctx.queryRunner.manager.save(newProjectRouteEntities)
}

export default {
    versionTask
}
