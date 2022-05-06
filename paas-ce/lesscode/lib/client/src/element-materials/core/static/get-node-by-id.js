import getRoot from './get-root'

const search = (node, id) => {
    if (!node || !node.componentId) {
        return null
    }
    if (node.componentId === id) {
        return node
    }
    for (let i = 0; i < node.children.length; i++) {
        const target = search(node.children[i], id)
        if (target) {
            return target
        }
    }
    return null
}

export default function (id) {
    return search(getRoot(), id)
}
