import PageModel from '../model/page'
import Page from '../model/entities/page'
import { getRepository } from 'typeorm'

export const getPageList = async (ctx) => {
    try {
        const { projectId } = ctx.query
        const res = await PageModel.getProjectPages(projectId)

        ctx.send({
            code: 0,
            message: 'success',
            data: res
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

// 新建页面
export const createPage = async (ctx) => {
    try {
        const { projectId, pageData } = ctx.request.body
        const projectPageData = {
            projectId
        }
        const { id } = await PageModel.createPage(pageData, projectPageData)
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

// 编辑页面
export const updatePage = async (ctx) => {
    try {
        const { pageData } = ctx.request.body
        const PageRepository = getRepository(Page)

        const { id } = await PageRepository.save(pageData)

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

// 复制页面
export const copyPage = async (ctx) => {
    try {
        const { projectId, pageData } = ctx.request.body
        const projectPageData = {
            projectId
        }

        const { id: postId, pageName: postName } = pageData
        const prePage = await getRepository(Page).findOne(postId)
        const newPageData = Object.assign(prePage, { pageName: postName, id: undefined })
        const { id } = await PageModel.createPage(newPageData, projectPageData)
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
        const { id } = await getRepository(Page).save(pageData)

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

// checkName
export const checkName = async (ctx) => {
    const { pageName, projectId } = ctx.request.body
    try {
        // const existPage = await getRepository(Page).findOne({ pageName })
        const existPage = await PageModel.checkProjectPageExist(projectId, pageName)
        console.log(ctx.request.body, pageName, existPage, 7788)
        if (existPage && existPage.length) {
            ctx.throwError({
                message: '该页面名称已存在'
            })
        } else {
            ctx.send({
                code: 0,
                message: 'OK',
                data: null
            })
        }
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

// 页面详情
export const pageDetail = async (ctx) => {
    try {
        const { pageId } = ctx.request.query
        const queryParams = Object.assign({}, { id: pageId }, { deleteFlag: 0 })
        const detail = await getRepository(Page).findOne(queryParams)
        ctx.send({
            code: 0,
            message: 'OK',
            data: detail
        })
    } catch (err) {
        ctx.throwError({
            message: err.message || err
        })
    }
}
