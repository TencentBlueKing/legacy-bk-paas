import LC from '@/element-materials/core'

export const createGrid2 = (node) => {
    if (node.name === 'grid2') {
        node.appendChild(LC.createNode('render-column'))
    }
}
export const createGrid3 = (node) => {
    if (node.name === 'grid3') {
        node.appendChild(LC.createNode('render-column'))
        node.appendChild(LC.createNode('render-column'))
    }
}
export const createGrid4 = (node) => {
    if (node.name === 'grid4') {
        node.appendChild(LC.createNode('render-column'))
        node.appendChild(LC.createNode('render-column'))
        node.appendChild(LC.createNode('render-column'))
    }
}

export const createBkIcon = (node, config) => {
    if (node.type === 'bk-icon') {
        node.setProp('type', config.props.type.val)
    }
}

export const createElIcon = (node, config) => {
    if (node.type === 'i' && /^el-icon-/.test(node.name)) {
        node.setProp('class', config.props.class.val)
    }
}
