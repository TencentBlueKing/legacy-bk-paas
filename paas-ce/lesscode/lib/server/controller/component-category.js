import CompCategory from '../model/entities/comp-category'
const { getRepository } = require('typeorm')

// 所有组件分类
export const list = async (ctx) => {
    try {
        const res = await getRepository(CompCategory).find()
        console.log(CompCategory)
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

// 新建分类
export const create = async (ctx) => {
    try {
        const category = new CompCategory()
        category.category = ctx.request.body.category

        const rowId = await getRepository(CompCategory).save(category)

        ctx.send({
            code: 0,
            message: 'success',
            data: rowId
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 编辑分类
export const update = async (ctx) => {
    try {
        const { id, category } = ctx.request.body
        if (!id) {
            throw new Error('id不能为空')
        }
        if (!category) {
            throw new Error('分类名不能为空')
        }
        const compCategoryRepository = getRepository(CompCategory)
        const compCategory = await compCategoryRepository.findOne(id)
        if (!compCategory) {
            throw new Error('分类不存在')
        }
        compCategory.category = category
        compCategory.updateUser = 'admin'

        await compCategoryRepository.save(compCategory)

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

// 删除分类
export const categoryDelete = async (ctx) => {
    try {
        const compCategoryRepository = getRepository(CompCategory)

        await compCategoryRepository.delete({
            id: ctx.query.id
        })

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
