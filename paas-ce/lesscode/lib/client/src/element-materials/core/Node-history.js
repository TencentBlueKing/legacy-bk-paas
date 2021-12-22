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

        if (this.historyList.length > 50) this.historyList.pop()
    }

    backHistoryList () {
    }

    setCopyNode (curNode) {
        this.copyNode = curNode
    }
}

export const NodeHistory = new History({})
