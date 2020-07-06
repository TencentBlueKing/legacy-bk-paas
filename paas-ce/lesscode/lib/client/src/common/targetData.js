import store from '@/store'
import { uuid, walkGrid, findComponentParentGrid } from '@/common/util'
import cloneDeep from 'lodash.clonedeep'

class TargetData {
    constructor () {
        this.targetData = store.getters['drag/targetData']
    }

    value () {
        return this.targetData
    }

    setTargetData (targetData) {
        store.state.drag.targetData = targetData
        this.targetData = store.state.drag.targetData
        return this
    }

    find (id) {
        if (typeof id !== 'undefined') {
            const targetData = store.getters['drag/targetData'] || []
            targetData.forEach((grid, index) => {
                const callBack = (data) => {
                    if (data.componentId === id) this.targetData = data
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
        }
        return this
    }

    parent () {
        const id = this.targetData.componentId
        if (typeof id !== 'undefined') {
            this.targetData = findComponentParentGrid(store.getters['drag/targetData'], id)
        }
        return this
    }

    remove (id) {
        const targetData = store.getters['drag/targetData'] || []
        targetData.forEach((grid, index) => {
            const callBack = (data, parent, index, parentGrid) => {
                if (data.componentId === id) {
                    if (parentGrid) parentGrid.renderKey = uuid()
                    parent.splice(index, 1)
                    if (id === this.targetData.componentId) this.targetData = parentGrid
                    const curSelectedComponentData = store.getters['drag/curSelectedComponentData'] || {}
                    if (id === curSelectedComponentData.componentId) store.state.drag.curSelectedComponentData = {}
                }
            }
            walkGrid(targetData, grid, callBack, callBack, index)
        })
        return this
    }

    move (sourceParentNodeId, sourceColumnIndex, sourceChildrenIndex, targetParentNodeId, targetColumnIndex, targetChildrenIndex) {
        let node
        const sourceGrid = this.find(sourceParentNodeId).value()
        if (typeof sourceColumnIndex === 'undefined') {
            node = sourceGrid.splice(sourceChildrenIndex, 1)[0]
        } else {
            sourceGrid.renderKey = uuid()
            const renderProps = sourceGrid.renderProps || {}
            const slots = renderProps.slots || {}
            const columns = slots.val || []
            const column = columns[sourceColumnIndex]
            node = column.children.splice(sourceChildrenIndex, 1)[0]
        }
        node = this.cloneNode(node)

        const targetGrid = this.find(targetParentNodeId).value()
        if (typeof targetColumnIndex === 'undefined') {
            targetGrid.splice(targetChildrenIndex, 0, node)
        } else {
            targetGrid.renderKey = uuid()
            const renderProps = targetGrid.renderProps || {}
            const slots = renderProps.slots || {}
            const columns = slots.val || []
            const column = columns[targetColumnIndex]
            column.children.splice(targetChildrenIndex, 0, node)
        }
        return this
    }

    update (newNode) {
        const node = this.find(newNode.componentId)
        const oldNode = node.value()
        const parent = node.parent().value() || {}
        parent.renderKey = uuid()
        newNode.renderKey = uuid()
        const curNode = Object.assign(oldNode, newNode)
        const curSelectedComponentData = store.getters['drag/curSelectedComponentData'] || {}
        if (oldNode.componentId === curSelectedComponentData.componentId) {
            store.state.drag.curSelectedComponentData = curNode
        }
        return this
    }

    appendChild (node, shouldChangeId) {
        node = this.cloneNode(node, shouldChangeId)
        if (Array.isArray(this.targetData) && node.type === 'render-grid') {
            this.targetData.push(node)
        } else if (this.targetData.type === 'render-grid') {
            this.targetData.renderKey = uuid()
            const renderProps = this.targetData.renderProps || {}
            const slots = renderProps.slots || {}
            const columns = slots.val || []
            for (let index = 0; index < columns.length; index++) {
                const nextColumn = columns[index + 1] || { children: [] }
                if (nextColumn.children.length <= 0) {
                    columns[index].children.push(node)
                    break
                }
            }
        } else {
            const targetData = store.getters['drag/targetData'] || []
            targetData.forEach((grid, index) => {
                const callBack = (data, parent, index, parentGrid) => {
                    if (data.componentId === this.targetData.componentId) {
                        parentGrid.renderKey = uuid()
                        parent.splice(index + 1, 0, node)
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
        }
        return this.find(node.componentId)
    }

    appendChildByIndex (node, parentId, columnIndex, childrenIndex, shouldChangeId) {
        node = this.cloneNode(node, shouldChangeId)
        const parent = this.find(parentId).value()
        if (typeof columnIndex === 'undefined') {
            parent.splice(childrenIndex, 0, node)
        } else {
            parent.renderKey = uuid()
            const renderProps = parent.renderProps || {}
            const slots = renderProps.slots || {}
            const columns = slots.val || []
            const column = columns[columnIndex]
            const children = column.children
            children.splice(childrenIndex, 0, node)
        }
        return this
    }

    getNodePosition (id) {
        id = id || this.targetData.componentId
        let res
        const targetData = store.getters['drag/targetData'] || []
        targetData.forEach((grid, index) => {
            const callBack = (data, parent, childrenIndex, parentGrid, columnIndex) => {
                if (data.componentId === id) {
                    res = {
                        parent: parentGrid,
                        columnIndex,
                        childrenIndex
                    }
                }
            }
            walkGrid(targetData, grid, callBack, callBack, index)
        })
        return res
    }

    appendBefore (id, node, shouldChangeId) {
        node = this.cloneNode(node, shouldChangeId)
        const targetData = store.getters['drag/targetData'] || []
        targetData.forEach((grid, index) => {
            const callBack = (data, parent, index, parentGrid) => {
                if (data.componentId === id) {
                    parentGrid.renderKey = uuid()
                    parent.splice(index, 0, node)
                }
            }
            walkGrid(targetData, grid, callBack, callBack, index)
        })
        return this
    }

    appendAfter (id, node, shouldChangeId) {
        node = this.cloneNode(node, shouldChangeId)
        const targetData = store.getters['drag/targetData'] || []
        targetData.forEach((grid, index) => {
            const callBack = (data, parent, index, parentGrid) => {
                if (data.componentId === id) {
                    parentGrid.renderKey = uuid()
                    parent.splice(index + 1, 0, node)
                }
            }
            walkGrid(targetData, grid, callBack, callBack, index)
        })
        return this
    }

    cloneNode (node, shouldChangeId) {
        node = cloneDeep(node)
        const callBack = (data) => {
            if (shouldChangeId) data.componentId = data.componentId.replace(/.{8}$/, uuid())
            data.renderKey = uuid()
        }
        if (Array.isArray(node)) {
            node.forEach((grid, index) => {
                walkGrid(node, grid, callBack, callBack, index)
            })
        } else if (node.type === 'render-grid') {
            walkGrid({}, node, callBack, callBack, 0)
        } else {
            callBack(node)
        }
        return node
    }
}

export default (id) => {
    const targetData = new TargetData()
    return targetData.find(id)
}
