export default function findParent (node, componentId) {
    if (!node || node.componentId === componentId) {
        return null
    }
    
    for (let i = 0; i < node.children.length; i++) {
        const children = node.children[i]
        if (children.componentId === componentId) {
            return node
        }
        const target = findParent(children, componentId)
        if (target) {
            return target
        }
    }
    return null
}
