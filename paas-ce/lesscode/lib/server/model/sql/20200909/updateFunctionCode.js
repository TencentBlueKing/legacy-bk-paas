import { getRepository } from 'typeorm'
import Func from '../../entities/func'
import Page from '../../entities/page'
import { logger } from '../../../logger'
import { uuid } from '../../../util'

module.exports = async function updateFuncData () {
    const funcRepository = getRepository(Func)
    const allFunc = await funcRepository.find()
    const funIdMap = {}
    for (const func of allFunc) {
        const funcCode = uuid(10)
        funIdMap[func.id] = funcCode
        const funcName = func.funcName.replace(/\_+[a-zA-Z]/g, (str, index) => index ? str.substr(-1).toUpperCase() : str)
        await funcRepository.update(func.id, { funcCode, funcName })
    }
    logger.info('函数 funcCode 更新完成')

    const pageRepository = getRepository(Page)
    const allPage = await pageRepository.find()
    for (const page of allPage) {
        const curContent = page.content && JSON.parse(page.content)
        const callBack = (component) => {
            const renderProps = component.renderProps || {}
            const propsKeys = Object.keys(renderProps)
            propsKeys.forEach((key) => {
                const prop = renderProps[key]
                if (prop.type === 'remote' || (Array.isArray(prop.type) && prop.type.includes('remote'))) {
                    if (prop.payload && prop.payload.methodId) {
                        const funcCode = funIdMap[prop.payload.methodId]
                        delete prop.payload.methodId
                        prop.payload.methodCode = funcCode
                    }
                }
            })

            const renderEvents = component.renderEvents || {}
            const eventKeys = Object.keys(renderEvents)
            eventKeys.forEach((key) => {
                const methodId = renderEvents[key]
                if (methodId) renderEvents[key] = funIdMap[methodId]
            })
        }
        (curContent || []).forEach((com, index) => {
            walkGrid(curContent, com, callBack, callBack, index)
        })
        page.content = JSON.stringify(curContent)
        await pageRepository.update(page.id, page)
    }

    function walkGrid (children, grid, childCallBack, parentCallBack, index, columnIndex, parentGrid) {
        if (parentCallBack) parentCallBack(grid, children, index, parentGrid, columnIndex)
        const renderProps = grid.renderProps || {}
        const slots = renderProps.slots || {}
        const columns = slots.val || []
        columns.forEach((column, columnIndex) => {
            const children = column.children || []
            children.forEach((component, index) => {
                if (component.type === 'render-grid') {
                    walkGrid(children, component, childCallBack, parentCallBack, index, columnIndex, grid)
                } else {
                    if (childCallBack) childCallBack(component, children, index, grid, columnIndex)
                }
            })
        })
    }

    logger.info('page 引用函数部分更新完成')
}
