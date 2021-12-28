import { getRepository, IsNull } from 'typeorm'
import LayoutInst from '../model/entities/layout-inst'

// 获取项目下对应版本的布局实例列表
const getProjectLayoutList = async (projectId, versionId) => getRepository(LayoutInst).find({
    where: { projectId, versionId: versionId || IsNull() }
})

const getNewLayoutInstEntities = (list, { projectId, newVersionId }) => getRepository(LayoutInst).create(list.map(item => {
    const { id, createTime, updateTime, ...others } = item
    others.projectId = projectId
    others.versionId = newVersionId
    return others
}))

const versionTask = async (ctx, next) => {
    const { projectId, versionId, newVersionId } = ctx
    const layoutInstList = await getProjectLayoutList(projectId, versionId)

    if (!layoutInstList.length) {
        await next()
        return
    }

    const newLayoutInstEntities = getNewLayoutInstEntities(layoutInstList, { projectId, newVersionId })

    const newLayoutInstList = await ctx.queryRunner.manager.save(newLayoutInstEntities)

    ctx.layoutIdMap = {}
    layoutInstList.forEach((item, index) => {
        ctx.layoutIdMap[item.id] = newLayoutInstList[index].id
    })

    await next()
}

export default {
    versionTask
}
