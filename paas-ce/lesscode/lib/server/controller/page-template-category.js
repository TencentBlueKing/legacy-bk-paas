import { getConnection, getRepository } from 'typeorm'
import _ from 'lodash'
import TemplateCategory from '../model/entities/page-template-category'
import * as TemplateCategoryModel from '../model/page-template-category'
import * as pageTemplateModel from '../model/page-template'
import { PAGE_TEMPLATE_TYPE } from '../utils/constant'
import OperationLogger from '../service/operation-logger'

// 所有组件分类
export const list = async (ctx) => {
    try {
        const { projectId, type } = ctx.query
        let res = []
        if (projectId) {
            const params = {}
            params.belongProjectId = projectId
            res = await TemplateCategoryModel.all(params)
        } else if (type === 'OFFCIAL') {
            res = PAGE_TEMPLATE_TYPE
        }
        
        ctx.send({
            code: 0,
            message: 'success',
            data: res || []
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
    const operationLogger = new OperationLogger(ctx)
    try {
        const { name, belongProjectId } = ctx.request.body
        if (!name) {
            throw new Error('分类名不能为空')
        }
        if (!belongProjectId) {
            throw new Error('项目id不能为空')
        }
        await getConnection().transaction(async transactionalEntityManager => {
            const categoryList = name.split('/')
            const createQueue = []
            const valueMap = {}
            for (let i = 0; i < categoryList.length; i++) {
                const currentCategory = categoryList[i]
                if (valueMap[currentCategory]) {
                    continue
                }
                // 分类已存在
                const record = await TemplateCategoryModel.getOne({
                    name: categoryList[i],
                    belongProjectId,
                    deleteFlag: 0
                })
                if (record) {
                    continue
                }
                const category = getRepository(TemplateCategory).create({
                    name: categoryList[i],
                    belongProjectId,
                    order: 0
                })
                createQueue.push(
                    transactionalEntityManager.save(category)
                )
                valueMap[currentCategory] = true
            }
            await Promise.all(createQueue)
        })

        operationLogger.success({
            operateTarget: `分类名称：${name}`
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        const { name, belongProjectId } = ctx.request.body
        operationLogger.error(error, {
            operateTarget: !name ? `项目ID：${belongProjectId}` : `分类名称：${name}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 编辑分类
export const update = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const checkFileds = ['id', 'name', 'belongProjectId']
        for (let i = 0; i < checkFileds.length; i++) {
            const currentfield = checkFileds[i]
            const currentFieldValue = ctx.request.body[currentfield]
            if (!currentFieldValue) {
                throw new Error(`${currentfield}不能为空`)
            }
        }

        const { id, name, belongProjectId } = ctx.request.body

        // 分类已存在
        const record = await TemplateCategoryModel.getOne({
            name,
            belongProjectId
        })
        if (record) {
            throw new Error(`分类已存在`)
        }
        await TemplateCategoryModel.updateById(id, {
            name
        })

        operationLogger.success({
            operateTarget: `分类名称：${name}`
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        const { id, name } = ctx.request.body
        operationLogger.error(error, {
            operateTarget: !name ? `分类ID：${id}` : `分类名称：${name}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 排序
export const sort = async (ctx) => {
    try {
        const { belongProjectId, list } = ctx.request.body
        if (!belongProjectId) {
            throw new Error('项目id不能为空')
        }
        if (!list || !_.isArray(list) || list.length < 1) {
            throw new Error('非法数据')
        }
        await getConnection().transaction(async transactionalEntityManager => {
            const updateQueue = []
            for (let i = 0; i < list.length; i++) {
                const currentCategory = list[i]
                const record = await TemplateCategoryModel.getOne({
                    id: currentCategory.id
                })
                if (!record) {
                    continue
                }
                record.order = i
                updateQueue.push(
                    transactionalEntityManager.save(record)
                )
            }
            await Promise.all(updateQueue)
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

// 删除分类
export const categoryDelete = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const id = parseInt(ctx.query.id)
        if (!id) {
            throw new Error('id不能为空')
        }
        // 权限
        const pageTemplateCategory = await TemplateCategoryModel.getOne({
            id
        })
        const userInfo = ctx.session.userInfo || {}
        ctx.hasPerm = (pageTemplateCategory.createUser === userInfo.username) || ctx.hasPerm
        if (!ctx.hasPerm) return

        const record = await pageTemplateModel.getOne({
            categoryId: id,
            deleteFlag: 0
        })

        if (record) {
            throw new Error('该分类下有模板信息，不能删除')
        }

        await TemplateCategoryModel.removeById(id)

        operationLogger.success({
            operateTarget: !ctx.query.name ? `分类ID：${ctx.query.id}` : `分类名称：${ctx.query.name}`
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        operationLogger.error(error, {
            operateTarget: !ctx.query.name ? `分类ID：${ctx.query.id}` : `分类名称：${ctx.query.name}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}
