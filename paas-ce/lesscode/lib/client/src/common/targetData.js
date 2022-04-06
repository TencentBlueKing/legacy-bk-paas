import store from '@/store'
import { uuid, walkGrid, findComponentParentGrid } from '@/common/util'
import { camelCase, camelCaseTransformMerge } from 'change-case'
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

    hideAllInteractiveComponents () {
        const targetData = store.getters['drag/targetData'] || []
        targetData.forEach(item => {
            item.interactiveShow = false
            this.update(item)
        })
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
        } else {
            this.targetData = store.getters['drag/targetData'] || []
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
            const renderSlots = sourceGrid.renderSlots || {}
            const slots = renderSlots.default || {}
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
            const renderSlots = targetGrid.renderSlots || {}
            const slots = renderSlots.default || {}
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

    moveFreeLayoutComponent () {
        const copyNode = store.getters['drag/copyData'] || {}
        function minPx (px) {
            return px.replace(/(.+)px/, (str, num) => {
                num -= 10
                if (num < 0) num += 20
                return num + 'px'
            })
        }
        const renderStyles = copyNode.renderStyles
        renderStyles.top = minPx(renderStyles.top || '10px')
        renderStyles.left = minPx(renderStyles.left || '10px')
    }

    appendChild (node, shouldChangeId) {
        if (this.isInFreeLayout(this.targetData)) this.moveFreeLayoutComponent()
        node = this.cloneNode(node, shouldChangeId)
        if (Array.isArray(this.targetData) && this.isLayout(node)) {
            this.targetData.push(node)
        } else if (this.isLayout(this.targetData) && !this.isLayout(node)) {
            this.targetData.renderKey = uuid()
            const renderSlots = this.targetData.renderSlots || {}
            const slots = renderSlots.default || {}
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
                        if (parentGrid) parentGrid.renderKey = uuid()
                        if (this.isInFreeLayout(this.targetData)) parent.push(node)
                        else parent.splice(index + 1, 0, node)
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
        }
        return this.find(node.componentId)
    }

    isInFreeLayout (node) {
        let isInFreeLayout = node.type === 'free-layout'
        if (!isInFreeLayout) {
            const parent = findComponentParentGrid(store.getters['drag/targetData'], node.componentId) || {}
            isInFreeLayout = parent.type === 'free-layout'
        }
        return isInFreeLayout
    }

    isLayout (node) {
        return ['render-grid', 'free-layout'].includes(node.type)
    }

    appendChildByIndex (node, parentId, columnIndex, childrenIndex, shouldChangeId) {
        node = this.cloneNode(node, shouldChangeId)
        const parent = this.find(parentId).value()
        if (typeof columnIndex === 'undefined') {
            parent.splice(childrenIndex, 0, node)
        } else {
            parent.renderKey = uuid()
            const renderSlots = parent.renderSlots || {}
            const slots = renderSlots.default || {}
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

    changeFormItemVmodel (data, oldId) {
        const oldVModelName = `${camelCase(oldId, { transform: camelCaseTransformMerge })}model.`
        const newVModelName = `${camelCase(data.componentId, { transform: camelCaseTransformMerge })}model.`
        data.renderSlots.default.val.forEach(formItem => {
            const item = formItem.renderSlots.default.val[0]
            item.renderDirectives.forEach(directive => {
                if (directive.type === 'v-model') {
                    directive.val = directive.val.replace(oldVModelName, newVModelName)
                }
            })
        })
    }

    cloneNode (node, shouldChangeId) {
        node = cloneDeep(node)
        const callBack = (data) => {
            const oldId = data.componentId
            
            if (shouldChangeId) data.componentId = (data.componentId && data.componentId.replace(/.{8}$/, uuid()))
            data.renderKey = uuid()

            if (data.type === 'widget-form') {
                this.changeFormItemVmodel(data, oldId)
            }
        }
        if (Array.isArray(node)) {
            node.forEach((grid, index) => {
                walkGrid(node, grid, callBack, callBack, index)
            })
        } else if (this.isLayout(node)) {
            walkGrid({}, node, callBack, callBack, 0)
        } else if (node.renderSlots && node.renderSlots.default) {
            callBack(node)
            if (Array.isArray(node.renderSlots.default.val)) {
                if (node.renderSlots.default.val.length && node.renderSlots.default.val[0] && node.renderSlots.default.val[0].componentId) {
                    node.renderSlots.default.val.forEach((item, index) => {
                        walkGrid({}, item, callBack, callBack, index)
                    })
                }
            } else if (node.renderSlots.default.name === 'layout') {
                walkGrid({}, node.renderSlots.default.val, callBack, callBack, 0)
            }
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
