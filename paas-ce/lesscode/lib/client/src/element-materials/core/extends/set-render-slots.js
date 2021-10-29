import cloneDeep from 'lodash.clonedeep'

/**
 * @desc 设置组件指定的 slot 值，默认为 default (全量覆盖)
 * @param { Node } node
 * @param { Object | Array } slots
 * @param { String } slotName
 * @returns { Boolean }
 */
export default function (node, slotValue, slotName) {
    if (!slotValue) {
        return false
    }
    // 组件类型不同slot对应值得数据接口不同
    // - 布局类型的组件 slot 结构是 Array
    // - 普通组件的 slot 的数据接口是 Object
    node.renderSlots = Object.assign({}, node.renderSlots, {
        [slotName]: cloneDeep(slotValue)
    })
    return true
}
