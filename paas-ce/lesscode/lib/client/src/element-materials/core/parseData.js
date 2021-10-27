// import Node from './Node'
import getRoot from './get-root'
import createNode from './create-node'

const createNodeFromData = data => {
    const newNode = createNode(data.type)
    newNode.tabPanelActive = data.tabPanelActive
    newNode.componentId = data.componentId
    newNode.name = data.name
    newNode.type = data.type
    newNode.renderKey = data.renderKey
    newNode.renderStyles = data.renderStyles || {}
    newNode.renderProps = data.renderProps || {}
    newNode.renderDirectives = data.renderDirectives || []
    newNode.renderEvents = data.renderEvents || {}
    newNode.interactiveShow = false
    newNode.isComplexComponent = data.isComplexComponent
    return newNode
}

const traverse = (parentNode, childDataList) => {
    childDataList.forEach(childData => {
        const childNode = createNodeFromData(childData)
        if (childNode.type === 'render-grid') {
            const columnList = childData.renderSlots.default.val
            columnList.forEach(columnData => {
                const columnNode = createNode('render-column')
                columnNode.renderProps.span.val = columnData.span
                traverse(columnNode, columnData.children)
                childNode.appendChild(columnNode)
            })
        }
        if (parentNode.layoutType) {
            parentNode.appendChild(childNode)
        } else {
            childNode.renderSlots = childData.renderSlots || {}
        }
    })
}

export default function (data) {
    const root = getRoot()
    root.renderSlots.default = []
    traverse(root, data)
    console.log('end parnet Data')
}
