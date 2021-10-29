import getMaterial from './get-material'

import Node from './Node'

export const createNode = type => {
    const material = getMaterial(type)

    return material ? new Node(material) : undefined
}

const parseTemplateTree = (templateRoot) => {
    const node = createNode(templateRoot.type[0])
    // material 里面可能已经配置了默认值
    // 为了避免无效的值覆盖在调用相关 API 时需要判断是否有提供相关配置
    templateRoot.renderStyles && node.setRenderStyles(templateRoot.renderStyles)
    templateRoot.renderProps && node.setRenderProps(templateRoot.renderProps)
    templateRoot.renderDirectives && node.setRenderDirectives(templateRoot.renderDirectives)
    templateRoot.renderSlots && node.setRenderSlots(templateRoot.renderSlots)
    templateRoot.renderEvents && node.setRenderEvents(templateRoot.renderEvents)
    
    // 当前组件是布局类型的组件才会解析下一次 template 配置
    if (node.layoutType && Array.isArray(templateRoot.children)) {
        templateRoot.children.forEach(child => {
            const childNode = parseTemplateTree(child)
            node.appendChild(childNode)
        })
    }
    return node
}

export default function (elementType) {
    const node = createNode(elementType)
    if (!node) {
        return node
    }
    // 创建节点时需要解析多层级的slot
    if (node.layoutType) {
        if (Array.isArray(node.material.slots.default)) {
            node.material.slots.default.forEach(slotTemplate => {
                node.appendChild(parseTemplateTree(slotTemplate), 'default')
            })
        } else {
            node.appendChild(parseTemplateTree(node.material.slots.default), 'default')
        }
    } else if (node.layoutSlot) {
        Object.keys(node.layoutSlotType).forEach((slotName) => {
            node.setRenderSlots(parseTemplateTree(node.material.slots[slotName]), slotName)
        })
    }

    console.log(`print createNode (${elementType}): `, node)

    return node
}
