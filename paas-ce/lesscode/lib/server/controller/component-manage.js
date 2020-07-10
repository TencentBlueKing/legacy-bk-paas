const { getRepository } = require('typeorm')
const Comp = require('../model/entities/comp')

// 所有组件
export const list = async (ctx) => {
    try {
        const res = await getRepository(Comp).find()

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

// 使用中的组件
export const useing = async (ctx) => {
    try {
        const compRepository = getRepository(Comp)

        const res = await compRepository.find({
            status: 1
        })

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

// 新建组件
export const create = async (ctx) => {
    try {
        const comp = new Comp()
        comp.compCode = 1
        comp.compName = 'test_comp'
        comp.compPath = 'path'
        comp.belongProjectId = 1
        comp.categoryId = 1
        comp.latestVersionId = 1
        comp.isPublic = 0
        comp.status = 1
        comp.createUser = 'admin'
        comp.updateUser = 'admin'

        const rowId = await getRepository(Comp).save(comp)

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

// 编辑组件
export const update = async (ctx) => {
    try {
        const compRepository = getRepository(Comp)
        const comp = await compRepository.findOne(ctx.query.id)
        comp.updateUser = `admin_${Math.random()}`

        await compRepository.save(comp)

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

// 删除组件
export const compDelete = (ctx) => {

}
