const transformSlot = (slots) => {
    return Object.keys(slots).reduce((result, slotName) => {
        const slot = slots[slotName]
        if (!slot) {
            return result
        }
        
        if (Array.isArray(slot)) {
            // 重要！！！构造树形结构
            // slot 是个数组，
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
                // 重要！！！构造树形结构
                // slot 的 name 配置的 是 layout
                // 表示这个组件 slot 编辑时是个布局组件，支持拖拽
                // 在拖拽开始时通过配置的 type 判断支持那种布局类型的组件
                result[slotName] = []
            } else {
                // 真实的组件child
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
