import Comp from '../model/entities/comp'
const { getRepository } = require('typeorm')

// 所有组件
export const list = async (ctx) => {
    try {
        const { category } = ctx.query
        const params = {}
        if (category) {
            params.categoryId = category
        }
        const res = await getRepository(Comp).find(params)

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
        const {
            compCode,
            compName,
            compPath,
            version,
            categoryId,
            isPublic,
            description,
            log
        } = ctx.request.body

        const comp = new Comp()
        comp.compCode = compCode
        comp.compName = compName
        comp.compPath = compPath
        comp.categoryId = categoryId
        comp.latestVersionId = version
        comp.belongProjectId = 1
        comp.isPublic = isPublic
        comp.status = 1
        comp.description = description
        comp.log = log
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

export const detail = async (ctx) => {
    try {
        const compRepository = getRepository(Comp)
        const row = await compRepository.findOne(ctx.query.id)

        const {
            compCode,
            compName,
            compPath,
            categoryId,
            latestVersionId,
            isPublic,
            description,
            log
        } = row

        ctx.send({
            code: 0,
            message: 'success',
            data: {
                compCode,
                compName,
                compPath,
                categoryId,
                version: latestVersionId,
                isPublic,
                description,
                log
            }
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

// 删除组件
export const upload = (ctx) => {
    ctx.send({
        code: 0,
        message: 'success',
        data: {
            compName: `compName_${Math.random()}`,
            compCode: `compCode_${Math.random()}`,
            compPath: '/a/b/c'
        }
    })
}
