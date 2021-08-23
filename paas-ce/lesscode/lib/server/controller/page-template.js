import { getConnection, getRepository } from 'typeorm'
import _ from 'lodash'
import PageTemplate from '../model/entities/page-template'
import TemplateCategory from '../model/entities/page-template-category'
import * as TemplateCategoryModel from '../model/page-template-category'
import * as PageTemplateModel from '../model/page-template'

export const listByCategory = async (ctx) => {
    try {
        const { projectId } = ctx.query
        const params = {}
        if (projectId) {
            params.belongProjectId = projectId
        }
        const categorys = await TemplateCategoryModel.all(params)
        
        const templates = await PageTemplateModel.all(params)

        console.log(params, categorys, 'controller')
        const list = categorys.map(category => {
            const templateList = templates.filter(item => item.categoryId === category.id) || []
            return {
                categoryName: category.name,
                list: templateList
            }
        })

        ctx.send({
            code: 0,
            message: 'success',
            data: list
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

export const list = async (ctx) => {
    try {
        const { projectId, categoryId } = ctx.query

        const params = {}
        if (projectId) {
            params.belongProjectId = projectId
        }
        if (categoryId) {
            params.categoryId = categoryId
        }
        const res = await PageTemplateModel.all(params)
        ctx.send({
            code: 0,
            message: 'success',
            data: res || []
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

export const create = async (ctx) => {
    try {
        const { params } = ctx.request.body

        const createTemplate = getRepository(PageTemplate).create(params)
        const res = await getRepository(PageTemplate).save(createTemplate)
        ctx.send({
            code: 0,
            message: 'success',
            data: res && res.id
        })
    } catch (err) {
        ctx.throw(err)
    }
}

// 编辑页面
export const update = async (ctx) => {
    try {
        const { pageData, customCompData, projectId, pageCode, functionData, templateData, usedVariableMap } = ctx.request.body
        const editPage = getRepository(Page).create(pageData)
        const userInfo = ctx.session.userInfo || {}

        const lockStatus = await getPageLockStatus(ctx, pageData)
        if (lockStatus.isLock && lockStatus.activeUser !== userInfo.username) {
            return ctx.send({
                code: -1,
                message: '当前画布无编辑权，无法保存'
            })
        }

        const result = await getConnection().transaction(async transactionalEntityManager => {
            const page = await transactionalEntityManager.save(editPage)
            const pageId = pageData.id
            // 页面与自定义组件关联更新
            if (customCompData) {
                const pageCompList = await getRepository(PageComp).find({ where: { pageId } })

                // 待添加的
                const addCompList = customCompData.filter(customComp => {
                    return pageCompList.findIndex(pageComp => {
                        return pageComp.compId === customComp.compId && pageComp.versionId === customComp.versionId
                    }) === -1
                })
                const addCompValues = getRepository(PageComp).create(addCompList.map(item => ({
                    ...item,
                    pageId,
                    projectId,
                    createTime: new Date()
                })))
                await transactionalEntityManager.save(addCompValues)

                // 待删除的
                const delCompList = pageCompList.filter(pageComp => {
                    return customCompData.findIndex(customComp => {
                        return pageComp.compId === customComp.compId && pageComp.versionId === customComp.versionId
                    }) === -1
                })
                await transactionalEntityManager.remove(delCompList)
            }

            // 页面与函数关联更新
            if (functionData) {
                const pageFuncList = await getRepository(PageFunc).find({ where: { pageId } })

                // 待添加的
                const addFuncList = functionData.filter(funcId => {
                    return pageFuncList.findIndex(pageFunc => pageFunc.funcId === funcId) === -1
                })
                const addFuncValues = getRepository(PageFunc).create(addFuncList.map(funcId => ({
                    funcId,
                    pageId,
                    projectId,
                    createTime: new Date()
                })))
                await transactionalEntityManager.save(addFuncValues)

                // 待删除的
                const delFuncList = pageFuncList.filter(pageFunc => {
                    return functionData.findIndex(funcId => pageFunc.funcId === funcId) === -1
                })
                await transactionalEntityManager.remove(delFuncList)
            }

            if (templateData) {
                const { layoutId } = await getRepository(PageRoute).findOne({ pageId })
                const layoutInst = await getRepository(LayoutInst).findOne(layoutId)
                layoutInst.content = JSON.stringify(templateData)
                await transactionalEntityManager.save(layoutInst)
            }

            // 页面与变量关联更新
            if (usedVariableMap) {
                const variableIds = Object.keys(usedVariableMap || {})
                const exitsUsedVariables = await getRepository(PageVariable).find({ where: { projectId, pageCode } }) || []
                // 新增部分
                const addUsedVariables = variableIds.filter((id) => exitsUsedVariables.findIndex(x => x.id === id) < 0)
                const addUsedVariableValues = getRepository(PageVariable).create(addUsedVariables.map(variableId => ({
                    projectId,
                    variableId,
                    pageCode,
                    useInfo: JSON.stringify(usedVariableMap[variableId])
                })))
                // 修改部分
                const updateUsedVariables = exitsUsedVariables.filter((variable) => usedVariableMap[variable.id])
                updateUsedVariables.forEach((variable) => (variable.useInfo = JSON.stringify(usedVariableMap[variable.id])))
                addUsedVariableValues.push(...updateUsedVariables)
                // 删除部分
                const deleteUsedVariables = exitsUsedVariables.filter(variable => !usedVariableMap[variable.id])

                await Promise.all([transactionalEntityManager.save(addUsedVariableValues), transactionalEntityManager.remove(deleteUsedVariables)])
            }

            // 处理lifeCycle
            page.lifeCycle = typeof page.lifeCycle === 'string' ? JSON.parse(page.lifeCycle) : page.lifeCycle

            return page
        })

        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throw(err)
    }
}

// 复制页面
export const copyPage = async (ctx) => {
    try {
        const { projectId, pageData } = ctx.request.body
        const projectPageData = {
            projectId
        }

        const { id: postId, pageName: postName, pageCode, pageRoute } = pageData
        const prePage = await getRepository(Page).findOne(postId)
        const newPageRoute = formatRoutePath(pageRoute)
        const newPageData = Object.assign(prePage, { pageName: postName, pageCode, pageRoute: newPageRoute, id: undefined })

        // 页面使用的layout
        const { layoutId } = await getRepository(PageRoute).findOne({ pageId: pageData.id })
        const layoutInst = await getRepository(LayoutInst).findOne(layoutId)
        const fullPath = `${layoutInst.routePath}/${newPageData.pageRoute}`

        if (await hasRoute({ path: fullPath }, projectId)) {
            throw Error('该页面路由已存在')
        }

        newPageData.layoutId = layoutInst.id

        const { id } = await PageModel.createPage(newPageData, projectPageData, pageData.id)
        ctx.send({
            code: 0,
            message: 'success',
            data: id
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

export const detail = async (ctx) => {
}

// 删除页面
export const deletePage = async (ctx) => {
    try {
        const { pageId } = ctx.query
        const pageData = {
            id: parseInt(pageId),
            deleteFlag: 1
        }

        // 权限
        const record = await getRepository(Page).findOne(pageData.id)
        const userInfo = ctx.session.userInfo || {}
        ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
        if (!ctx.hasPerm) return

        const result = await getConnection().transaction(async transactionalEntityManager => {
            const delPage = getRepository(Page).create(pageData)
            const { id } = await transactionalEntityManager.save(delPage)

            // 删除页面与组件关联记录
            const pageCompList = await getRepository(PageComp).find({ where: { pageId } })
            await transactionalEntityManager.remove(pageCompList)

            // 删除页面与路由关联记录
            const pageRouteList = await getRepository(PageRoute).find({ where: { pageId } })
            const savePageRouteList = pageRouteList.map(item => {
                return {
                    ...item,
                    deleteFlag: 1
                }
            })
            await transactionalEntityManager.save(PageRoute, savePageRouteList)

            // 删除页面与项目关联记录
            const projectPageList = await getRepository(ProjectPage).find({ where: { pageId } })
            const saveProjectPageList = projectPageList.map(item => {
                return {
                    ...item,
                    deleteFlag: 1
                }
            })
            await transactionalEntityManager.save(ProjectPage, saveProjectPageList)

            return id
        })

        ctx.send({
            code: 0,
            message: 'success',
            data: result
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

// 分类组件数量
export const categoryCount = async (ctx) => {
    try {
        const belongProjectId = parseInt(ctx.query.projectId)
        if (!belongProjectId) {
            throw new Error('项目id不能为空')
        }
        const res = await getRepository(PageTemplate)
            .createQueryBuilder()
            .select('categoryId')
            .addSelect('COUNT(id)', 'count')
            .where({
                deleteFlag: 0,
                belongProjectId
            })
            .groupBy('categoryId')
            .getRawMany()

        ctx.send({
            code: 0,
            message: 'success',
            data: res
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}



