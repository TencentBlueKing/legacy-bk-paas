import getMaterial from './get-material'

import Node from './Node'

const createNode = type => {
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
    
    // 当前组件时布局类型的组件才会解析下一次 template 配置
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
    Object.keys(node.layoutSlotType).forEach((slotName) => {
        node.appendChild(parseTemplateTree(node.material.slots[slotName]), slotName)
    })

    console.log(`print createNode (${elementType}): `, node)

    return node
}
