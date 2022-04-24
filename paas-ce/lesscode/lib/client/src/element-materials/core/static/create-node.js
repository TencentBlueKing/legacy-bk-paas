import getMaterial from './get-material'

import Node from '../Node'

export const createNode = type => {
    const material = getMaterial(type)
    if (!material) {
        throw new Error(`不支持的组件 * ${type} * `)
    }

    return new Node(material)
}

const parseTemplateTree = (templateRoot) => {
    const node = createNode(templateRoot.type[0])
    // material 里面可能已经配置了默认值
    // 为了避免无效的值覆盖在调用相关 API 时需要判断是否有提供相关配置
    templateRoot.renderStyles && node.setRenderStyles(templateRoot.renderStyles)
    templateRoot.renderProps && node.setRenderProps(templateRoot.renderProps)
    templateRoot.renderDirectives && node.setRenderDirectives(templateRoot.renderDirectives)
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

/**
 * @desc 根据传入的组件 type 创建 Node
 * @param { String } elementType
 * @param { Boolean } parseSlot 是否解析配置的slot
 * @returns { Node }
 */
export default function (elementType, parseSlot = true) {
    const node = createNode(elementType)
    if (!node) {
        return node
    }
    if (parseSlot) {
        // 创建节点时需要解析多层级的 slot 配置
        if (node.layoutType) {
            // 布局类型组件
            if (Array.isArray(node.material.slots.default)) {
                node.material.slots.default.forEach(slotTemplate => {
                    node.appendChild(parseTemplateTree(slotTemplate), 'default')
                })
            } else {
                node.appendChild(parseTemplateTree(node.material.slots.default), 'default')
            }
        } else if (node.layoutSlot) {
            // slot是可拖拽的
            Object.keys(node.layoutSlotType).forEach((slotName) => {
                node.setRenderSlots(parseTemplateTree(node.material.slots[slotName]), slotName)
            })
        }
    }

    return node
}
