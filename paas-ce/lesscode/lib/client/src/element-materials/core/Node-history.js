import cloneDeep from 'lodash.clonedeep'

class History {
    constructor ({
        curHistoryIndex = 0,
        copyNode = {},
        historyList = []
    }) {
        this.curHistoryIndex = curHistoryIndex
        this.copyNode = copyNode
        this.historyList = historyList
    }

    get curCopyNode () {
        return this.copyNode || {}
    }

    get nodeHistoryList () {
        return this.historyList || []
    }
    
    pushHistoryList (pushData) {
        this.historyList = this.historyList.slice(this.curHistoryIndex)
        this.curHistoryIndex = 0

        this.historyList.unshift(cloneDeep(pushData))

        // const topPushData = this.historyList[0] || {}
        // const isExis = pushData.component && !Array.isArray(targetDataTool(pushData.component.componentId).value())
        // if (pushData.type === 'remove' && topPushData.type === 'add' && topPushData.component.componentId === pushData.component.componentId && isExis) {
        //     topPushData.type = 'move'
        //     topPushData.sourceParentNodeId = pushData.parentId
        //     topPushData.sourceColumnIndex = pushData.columnIndex
        //     topPushData.sourceChildrenIndex = pushData.childrenIndex

        //     topPushData.targetParentNodeId = topPushData.parentId
        //     topPushData.targetColumnIndex = topPushData.columnIndex
        //     topPushData.targetChildrenIndex = topPushData.childrenIndex
        // } else {
        //     this.historyList.unshift(cloneDeep(pushData))
        // }
        if (this.historyList.length > 50) this.historyList.pop()
        console.log(this.historyList, 'class historyList')
    }

    backHistoryList () {
        if (this.curHistoryIndex >= this.historyList.length) return
        // const pushData = this.historyList[this.curHistoryIndex]
        this.curHistoryIndex++
        // const targetData = targetDataTool()
        // const component = pushData.component
        // const parentId = pushData.parentId
        // switch (pushData.type) {
        //     case 'update':
        //         targetData.update(component)
        //         break
        //     case 'add':
        //         targetData.remove(component.componentId)
        //         break
        //     case 'remove':
        //         targetData.appendChildByIndex(component, parentId, pushData.columnIndex, pushData.childrenIndex)
        //         break
        //     case 'move':
        //         targetData.move(pushData.targetParentNodeId, pushData.targetColumnIndex, pushData.targetChildrenIndex, pushData.sourceParentNodeId, pushData.sourceColumnIndex, pushData.sourceChildrenIndex)
        //         break
        //     case 'clear':
        //         targetData.setTargetData(pushData.oldTargetData)
        //         break
        // }
    }

    forwardHistoryList () {
        if (this.curHistoryIndex <= 0) return
        this.curHistoryIndex--
        // const pushData = this.historyList[this.curHistoryIndex]
        // const targetData = targetDataTool()
        // const component = pushData.component
        // const parentId = pushData.parentId
        // switch (pushData.type) {
        //     case 'update':
        //         const modifier = pushData.modifier
        //         targetData.update(Object.assign({}, component, modifier))
        //         break
        //     case 'add':
        //         targetData.appendChildByIndex(component, parentId, pushData.columnIndex, pushData.childrenIndex)
        //         break
        //     case 'remove':
        //         targetData.remove(component.componentId)
        //         break
        //     case 'move':
        //         targetData.move(pushData.sourceParentNodeId, pushData.sourceColumnIndex, pushData.sourceChildrenIndex, pushData.targetParentNodeId, pushData.targetColumnIndex, pushData.targetChildrenIndex)
        //         break
        //     case 'clear':
        //         targetData.setTargetData(pushData.newTargetData)
        //         break
        // }
    }

    setCopyNode (curNode) {
        this.copyNode = curNode
    }
}

export const NodeHistory = new History({})
