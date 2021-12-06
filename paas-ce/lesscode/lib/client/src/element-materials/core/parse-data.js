import { uuid } from '@/common/util'
import getRoot from './get-root'
import create, { createNode } from './create-node'

let isClone = false

const createNodeFromData = (data) => {
    const id = uuid()
    const newNode = createNode(data.type)
    newNode.tabPanelActive = data.tabPanelActive || 'props'
    newNode.componentId = isClone ? `${data.name}-${id}` : data.componentId
    newNode.renderKey = id
    data.renderStyles && newNode.setRenderStyles(newNode.renderStyles)
    data.renderProps && newNode.setRenderProps(data.renderProps)
    data.renderDirectives && newNode.setRenderDirectives(data.renderDirectives)
    data.renderEvents && newNode.setRenderEvents(data.renderEvents)
    
    newNode.interactiveShow = false
    newNode.isComplexComponent = data.isComplexComponent || false

    // fix: 老数据 renderProps.no-response 格式不规范的问题
    if (newNode.renderProps.hasOwnProperty('no-response')) {
        newNode.renderProps['no-response'] = {
            type: 'boolean',
            val: newNode.renderProps['no-response']
        }
    }

    return newNode
}

const traverse = (parentNode, childDataList, slot) => {
    childDataList.forEach(childData => {
        const childNode = createNodeFromData(childData)
        if (childNode.layoutType) {
            // 布局类型的组件
            // slot 的值类型 Array
            traverse(childNode, childData.renderSlots.default, 'default')
        } else if (childNode.layoutSlot) {
            // slot 为布局类型组件
            // slot 的值类型为 Node
            Object.keys(childNode.layoutSlotType).forEach(slotName => {
                const slotData = childData.renderSlots[slotName]
                if (Object.prototype.toString.call(slotData) === '[object Object]') {
                    traverse(childNode, [slotData], slotName)
                } else if (Array.isArray(slotData)) {
                    // TODO. 这种情况应该不会出现
                    console.error('\n\n\n\n\n ========== go die ========== \n\n\n\n')
                    traverse(childNode, slotData, slotName)
                }
            })
        }
        
        if (parentNode.layoutType) {
            parentNode.appendChild(childNode, slot)
        } else if (parentNode.layoutSlotType[slot]) {
            parentNode.renderSlots[slot] = childNode
        } else {
            childNode.renderSlots = childData.renderSlots || {}
        }
    })
}

const tansform = (root, data) => {
    return data.map((parentNode, index) => {
        if (!parentNode) {
            return null
        }
        if (parentNode.type === 'render-grid') {
            parentNode.renderSlots = {
                default: []
            }
            if (parentNode.renderSlots
                && parentNode.renderSlots.default
                && parentNode.renderSlots.default.val) {
                const columnList = parentNode.renderSlots.default.val
                columnList.forEach((columnItem, index) => {
                    const uid = `${uuid()}${index}`
                    const columnData = {
                        tabPanelActive: 'props',
                        componentId: `column-${uid}`,
                        name: 'render-column',
                        type: 'render-column',
                        renderStyles: {
                            padding: '5px'
                        },
                        renderProps: {
                            span: {
                                type: 'number',
                                val: columnItem.span || 1
                            }
                        },
                        renderSlots: {
                            default: tansform(parentNode, columnItem.children)
                        },
                        renderDirectives: [],
                        renderEvents: {},
                        interactiveShow: false,
                        isComplexComponent: false
                    }
                    parentNode.renderSlots.default.push(columnData)
                })
            }
        } else if (parentNode.type === 'free-layout') {
            const freelayoutItem = parentNode.renderSlots.default.val[0] || []
            let freelayoutSlot = []
            if (freelayoutItem && freelayoutItem.children) {
                freelayoutSlot = tansform(parentNode, freelayoutItem.children)
            }
            parentNode.renderSlots = {
                default: freelayoutSlot
            }
        } else if (parentNode.type === 'bk-sideslider') {
            const child = parentNode.renderSlots.content.val
            parentNode.renderSlots = {
                content: tansform(parentNode, [child])[0]
            }
        } else if (parentNode.type === 'bk-dialog') {
            const child = parentNode.renderSlots.default.val
            parentNode.renderSlots = {
                default: tansform(parentNode, [child])[0]
            }
        } else if (parentNode.type === 'bk-card') {
            const renderSlots = parentNode.renderSlots
            parentNode.renderSlots = {
                header: tansform(parentNode, [renderSlots.header.val])[0],
                default: tansform(parentNode, [renderSlots.default.val])[0],
                footer: tansform(parentNode, [renderSlots.footer.val])[0]
            }
        }
        if (['render-grid', 'free-layout'].includes(parentNode.type)) {
            if (index < data.length - 1) {
                parentNode.renderStyles = {
                    ...parentNode.renderStyles,
                    'margin-bottom': '10px'
                }
            }
        } else {
            if (root.type === 'render-grid') {
                parentNode.renderStyles = {
                    ...parentNode.renderStyles,
                    'margin': '5px'
                }
            }
        }
        return parentNode
    })
}

const checkVersion = (data) => {
    for (let i = 0; i < data.length; i++) {
        const rootLayout = data[i]
        if (rootLayout.type === 'render-grid') {
            if (!rootLayout.renderSlots) {
                return 'v0'
            }
            return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
        } else if (rootLayout.type === 'bk-sideslider') {
            return rootLayout.renderSlots.content.hasOwnProperty('val') ? 'v1' : 'v2'
        } else if (rootLayout.type === 'free-layout') {
            return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
        } else if (rootLayout.type === 'bk-dialog') {
            return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
        }
    }
    return 'v2'
}

export default function (data) {
    let versionData = data
    const version = checkVersion(data)
    if (version === 'v1') {
        versionData = tansform({ type: 'root' }, data)
    }
    const root = getRoot()
    root.setRenderSlots([])
    
    root.renderSlots.default = []
    if (version === 'v0') {
        root.appendChild(create('render-grid'))
    } else {
        traverse(root, versionData, 'default')
    }
}

export const parseTemplate = data => {
    let versionData = data
    const version = checkVersion(data)
    if (version === 'v1') {
        versionData = tansform({ type: 'template' }, [data])
    }
    try {
        isClone = true
        const root = create('render-column')
        traverse(root, [versionData], 'default')
        return root.children[0]
    } finally {
        isClone = false
    }
}
