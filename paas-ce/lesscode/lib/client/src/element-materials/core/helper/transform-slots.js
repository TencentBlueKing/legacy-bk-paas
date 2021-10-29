const transformSlot = (slots) => {
    return Object.keys(slots).reduce((result, slotName) => {
        const slot = slots[slotName]
        if (!slot) {
            return result
        }
        
        if (Array.isArray(slot)) {
            // 重要！！！
            // 为了表示树形结构只有布局类型的组件 slot 是个数组
            // 表示这个组件是布局类型的组件，直接赋值为空数组
            result[slotName] = []
        } else {
            const {
                name,
                type,
                val
            } = slot
            const slotComponentNameArr = Array.isArray(name) ? name : [name]
            if (slotComponentNameArr.includes('layout')) {
                // 重要！！！
                // 当组件的 slot name 配置为 layout时，表示改组件的 slot 支持拓转
                // 在解析配置时通过 type 判断支持那种布局类型的组件
                result[slotName] = null
            } else {
                // 表示框架概念的 slot
                result[slotName] = {
                    name: slotComponentNameArr[0],
                    type: Array.isArray(type) ? type[0] : type,
                    val
                }
            }
        }
        return result
    }, {})
}

export default transformSlot
