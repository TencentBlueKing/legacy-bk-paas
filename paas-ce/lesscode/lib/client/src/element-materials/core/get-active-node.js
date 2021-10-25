import getRoot from './get-root'

const search = (node) => {
    if (!node || !node.componentId) {
        return null
    }
    if (node.isActived) {
        return node
    }

    for (let i = 0; i < node.children.length; i++) {
        const target = search(node.children[i])
        if (target) {
            return target
        }
    }
    return null
}

export default function () {
    return search(getRoot())
}
