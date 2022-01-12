import LC from '@/element-materials/core'
import Node from '@/element-materials/core/Node'

export const createGrid2 = (node, config) => {
    if (node.type === 'render-grid' && config.name === 'grid2') {
        node.appendChild(LC.createNode('render-column'))
    }
}
export const createGrid3 = (node, config) => {
    if (node.type === 'render-grid' && config.name === 'grid3') {
        node.appendChild(LC.createNode('render-column'))
        node.appendChild(LC.createNode('render-column'))
    }
}
export const createGrid4 = (node, config) => {
    if (node.type === 'render-grid' && config.name === 'grid4') {
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

export const createCharts = (node, config) => {
    if (node.type === 'chart' || node.type.startsWith('bk-charts')) {
        Object.assign(node, new Node(config))
    }
}

export const createBkRadioGroup = (node, config) => {
    if (node.type === 'bk-radio-group' && config.name === 'radio-group') {
        const slotConfig = config.slots.default
        node.setRenderSlots({
            format: 'value',
            component: 'bk-radio',
            code: slotConfig.val,
            valueType: 'list',
            renderValue: slotConfig.val
        })
    }
}
