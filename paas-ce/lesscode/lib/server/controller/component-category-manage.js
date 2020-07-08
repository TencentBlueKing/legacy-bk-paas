const { getRepository } = require('typeorm')
const CompCategory = require('../model/entities/comp-category')

// 所有组件分类
export const list = async (ctx) => {
    try {
        const res = await getRepository(CompCategory).find()

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
        category.category = 'category'
        category.createUser = 'admin'
        category.updateUser = 'admin'
        
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
        const compCategoryRepository = getRepository(CompCategory)
        const compCategory = await compCategoryRepository.findOne(ctx.query.id)
        compCategory.updateUser = `admin_${Math.random()}`

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

}
