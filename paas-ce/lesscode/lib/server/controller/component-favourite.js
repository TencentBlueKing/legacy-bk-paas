import * as CompFavouriteModel from '../model/comp-favourite'

export const list = async (ctx) => {
    try {
        const { projectId } = ctx.query
        if (!projectId) {
            throw new Error('应用id不能为空')
        }
        const data = await CompFavouriteModel.all({
            projectId
        })
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}
// 收藏
export const add = async (ctx) => {
    try {
        const { compId, projectId } = ctx.request.body

        if (!compId) {
            throw new Error('组件id不能为空')
        }
        if (!projectId) {
            throw new Error('应用id不能为空')
        }
        const params = {
            compId,
            projectId
        }
        await CompFavouriteModel.create(params)
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 取消收藏
export const favouriteDelete = async (ctx) => {
    try {
        const { compId, projectId } = ctx.request.body

        if (!compId) {
            throw new Error('组件id不能为空')
        }
        if (!projectId) {
            throw new Error('应用id不能为空')
        }
        const params = {
            compId,
            projectId
        }
        await CompFavouriteModel.remove(params)
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}
