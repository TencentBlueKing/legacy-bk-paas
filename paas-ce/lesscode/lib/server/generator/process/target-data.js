/**
 * 遍历 targetData，并执行相关的生成方法
 */
import { isLayout } from '../util'

function walkGrid (component, director) {
    const renderProps = component.renderProps || {}
    const slots = renderProps.slots || {}
    const columns = slots.val || []
    columns.forEach((column) => {
        const children = column.children || []
        children.forEach((component) => {
            execBuild(component, director)
            const isSlotComponent = component.renderProps.slots && component.renderProps.slots.name === 'layout'
            if (isLayout(component.type) || isSlotComponent) walkGrid(component, director)
        })
    })
}

function execBuild (component, director) {
    director.callBacks.forEach((callBack) => {
        callBack(component)
    })
}

export default (targetData, director) => {
    (targetData || []).forEach((component) => {
        execBuild(component, director)
        walkGrid(component, director)
    })
}
