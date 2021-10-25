export const remove = node => {
    if (node.parentNode) {
        node.parentNode.removeChild(node)
    }
}

export const cleayLayout = node => {
    if (node.layoutType) {
        if (node.type === 'render-grid') {
            // 如果是grid 清空 column 下面的节点
            const columnNode = node.children[0]
            columnNode.children.forEach(child => {
                columnNode.removeChild(child)
            })
        } else {
            node.children.forEach(child => {
                node.removeChild(child)
            })
        }
    }
}
