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
        const { projectId, categoryId, type } = ctx.query

        const params = {}
        if (projectId) {
            params.belongProjectId = projectId
        }
        if (categoryId) {
            params.categoryId = categoryId
        }
        if (type === 'OFFCIAL') {
            params.isOffcial = 1
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
        // const { id, params } = ctx.request.body
        const { id, name, belongProjectId } = ctx.request.body

        // 分类已存在
        const record = await TemplateCategoryModel.getOne({
            name,
            belongProjectId
        })
        if (record) {
            throw new Error(`分类已存在`)
        }
         const res = PageTemplateModel.updateById(id, params)
         ctx.send({
            code: 0,
            message: 'success',
            data: res
        })
     } catch (err) {
        ctx.throwError({
            message: err.message || err
        })
     }
}

export const deleteTemplate = async (ctx) => {
    try {
        const res = PageTemplateModel.remove(ctx.query.templateId)
        ctx.send({
            code: 0,
            message: 'success',
            data: res && res.id
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



