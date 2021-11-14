import {
    getNodeId,
    getNodeIcon,
    checkIsLazy
} from './utils.js'

export default class TreeNode {
    constructor (data, options, tree) {
        const folderKey = tree.nodeOptions['folderKey']
        const isFolder = folderKey && data[folderKey]
        const sealData = {
            data: data,
            tree: tree,
            _vNode: null,
            id: getNodeId(data, tree),
            icon: getNodeIcon(data, tree),
            line: 0,
            level: options.level,
            index: options.index,
            childIndex: options.childIndex || 0,
            parent: options.parent,
            children: [],
            timer: null,
            isFolder: isFolder
        }
        Object.keys(sealData).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: tree.configurable,
                writable: true,
                value: sealData[key]
            })
        })

        this.state = {
            checked: false,
            expanded: tree.defaultExpandAll,
            disabled: false,
            visible: true,
            matched: true,
            loading: false,
            lazy: checkIsLazy(this, tree)
        }
    }

    get uid () {
        return `${this.tree.id}-node-${this.index}`
    }

    get name () {
        return this.data[this.tree.nodeOptions.nameKey]
    }

    set vNode (vNode) {
        this._vNode = vNode
        if (this.expanded) {
            this.recalculateLinkLine()
        }
    }

    get vNode () {
        return this._vNode
    }

    get parents () {
        if (!this.parent) {
            return []
        }
        return [...this.parent.parents, this.parent]
    }

    get descendants () {
        const descendants = []
        this.children.forEach(node => {
            descendants.push(node)
            descendants.push(...node.descendants)
        })
        return descendants
    }

    get isLeaf () {
        return !this.lazy && !this.loading && !this.children.length
    }

    get lazy () {
        return this.state.lazy && !this.children.length
    }

    get loading () {
        return this.state.loading
    }

    get hasCheckbox () {
        const showCheckbox = this.tree.showCheckbox
        if (typeof showCheckbox === 'function') {
            return showCheckbox(this.data)
        }
        return showCheckbox
    }

    get collapseIcon () {
        return this.icon.collapse
    }

    get selected () {
        return this.tree.selectable && this.tree.selected === this.id
    }

    get expandIcon () {
        return this.icon.expand
    }

    get nodeIcon () {
        return this.icon.node
    }

    set checked (checked) {
        if (this.state.checked === checked && !this.indeterminate) {
            return false
        }
        this.setState('checked', checked)
        if (this.tree.checkStrictly) {
            this.children.forEach(child => {
                if (child.checkable) {
                    child.checked = checked
                }
            })
            if (this.parent) {
                this.parents.reverse().forEach(parent => {
                    if (checked) {
                        const parentChecked = !parent.children.some(node => !node.checked)
                        parent.setState('checked', parentChecked)
                    } else {
                        parent.setState('checked', false)
                    }
                })
            }
        }
    }

    get checked () {
        return this.state.checked
    }

    get checkable () {
        if (this.disabled) {
            return false
        }
        if (this.tree.inSearch && this.tree.checkOnlyAvailableStrictly) {
            if (this.tree.displayMatchedNodeDescendants) {
                return this.matched || this.childrenMatched || this.parentsMatched
            }
            return this.matched || this.childrenMatched
        }
        return true
    }

    set expanded (expanded) {
        if (this.state.expanded === expanded) {
            return false
        }
        this.setState('expanded', expanded)
        if (expanded && this.parent) {
            this.parent.expanded = true
        }
        this.children.forEach(node => {
            node.visible = expanded
        })
        this.tree.$nextTick(async () => {
            if (expanded && this.lazy) {
                this.setState('loading', true)
                this.setState('lazy', false)
                try {
                    const { leaf = [], data = [] } = await this.tree.lazyMethod(this)
                    const newNodes = this.tree.addNode(data, this.id)
                    newNodes.forEach(node => {
                        if (leaf.includes(node.id)) {
                            node.setState('lazy', false)
                        }
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.setState('loading', false)
                }
            }
        })
        this.recalculateLinkLine()
    }

    get expanded () {
        return this.state.expanded
    }

    set disabled (disabled) {
        if (this.state.disabled === disabled) {
            return false
        }
        this.setState('disabled', disabled)
        if (this.tree.disableStrictly) {
            this.descendants.forEach(descendant => {
                descendant.disabled = disabled
            })
        }
    }

    get disabled () {
        return this.state.disabled
    }

    set matched (matched) {
        this.setState('matched', matched)
    }

    get matched () {
        return this.state.matched
    }

    get childrenMatched () {
        return this.children.some(child => child.matched || child.childrenMatched)
    }

    get parentsMatched () {
        return this.parents.some(parent => parent.matched)
    }

    set visible (visible) {
        if (this.state.visible === visible) {
            return false
        }
        this.setState('visible', visible)
        this.children.forEach(node => {
            node.visible = visible
        })
    }

    get visible () {
        const basicVisible = this.parent ? (this.parent.expanded && this.state.visible) : this.state.visible
        if (!this.tree.inSearch) {
            return basicVisible
        }
        const searchVisible = basicVisible && (this.matched || this.childrenMatched)
        if (this.tree.displayMatchedNodeDescendants) {
            const parentMatchedVisible = basicVisible && this.parentsMatched
            return searchVisible || parentMatchedVisible
        }
        return searchVisible
    }

    get indeterminate () {
        if (this.tree.checkStrictly) {
            const childrenIndeterminate = this.children.some(child => child.indeterminate)
            if (childrenIndeterminate) {
                return true
            }
            const checkedChildren = this.children.filter(child => child.checked)
            return !!checkedChildren.length && checkedChildren.length !== this.children.length
        }
        return false
    }

    setState (key, value) {
        if (this.state.hasOwnProperty(key)) {
            this.state[key] = value
        }
    }

    recalculateLinkLine () {
        if (this.tree.hasLine) {
            const needsCalculateNodes = this.tree.needsCalculateNodes
            if (needsCalculateNodes.includes(this)) {
                return false
            }
            needsCalculateNodes.push(this)
            this.parent && this.parent.recalculateLinkLine()
        }
    }

    appendChild (node, offset, options) {
        const nodes = Array.isArray(node) ? node : [node]
        this.children.splice(offset, 0, ...nodes)
        this.children.slice(offset).forEach((node, index) => {
            node.childIndex = offset + index
        })
        this.expanded = options.expandParent
        this.recalculateLinkLine()
        return nodes
    }

    removeChild (node) {
        const nodes = Array.isArray(node) ? node : [node]
        const removedChildIndex = []
        const removedIndex = []
        nodes.forEach(node => {
            const childIndex = node.childIndex
            removedChildIndex.push(childIndex)
            removedIndex.push(node.index)
            this.children.splice(childIndex, 1)
        })
        const minIndex = Math.min(...removedChildIndex)
        this.children.slice(minIndex).forEach((node, index) => {
            node.childIndex = minIndex + index
        })
        this.recalculateLinkLine()
        return nodes
    }
}
