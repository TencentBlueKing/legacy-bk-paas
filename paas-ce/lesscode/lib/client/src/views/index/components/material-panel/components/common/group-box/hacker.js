import LC from '@/element-materials/core'
import Node from '@/element-materials/core/Node'
import store from '@/store'

const paragraphStyle = {
    PC: {
        display: 'inline-block',
        width: '281px',
        height: '102px',
        textAlign: 'left',
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
    },
    MOBILE: {
        display: 'inline-block',
        textAlign: 'left',
        fontSize: '28rpx',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
    }
}

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

export const createParagraph = (node, config) => {
    if (node.type === 'p') {
        const platform = store.getters['page/platform']
        const renderStyle = paragraphStyle[platform]
        node.setRenderStyles(renderStyle)
    }
}

export const createColumn = (node) => {
    if (node.type === 'render-column') {
        const platform = store.getters['page/platform']
        const padding = platform === 'PC'
            ? '5px'
            : '10rpx'
        node.setRenderStyles({
            'paddingTop': padding,
            'paddingRight': padding,
            'paddingBottom': padding,
            'paddingLeft': padding
        })
    }
}
