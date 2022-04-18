<template>
    <div
        :style="{ height: treeHeight }"
        :class="['bk-big-tree', extCls, { 'with-virtual-scroll': !!height }]">
        <!-- 非虚拟滚动 -->
        <template v-for="node in nodes">
            <tree-item
                :node="node"
                :ref="node.id"
                :key="node.id">
                <slot :node="node" :data="node.data"></slot>
            </tree-item>
        </template>

        <div class="bk-big-tree-empty" v-if="($slots.empty || useDefaultEmpty) && isSearchEmpty">
            <slot name="empty">
                {{t('bk.bigTree.emptyText')}}
            </slot>
        </div>
    </div>
</template>

<script>
    import TreeNode from './tree-node.js'
    import { isNullOrUndefined, convertToArray } from './utils.js'
    import treeItem from './tree-item.vue'
    let idSeed = 0
    export default {
        name: 'bk-big-tree',
        components: {
            treeItem
        },
        props: {
            data: {
                type: Array,
                default () {
                    return []
                }
            },
            options: {
                type: Object,
                default () {
                    return {}
                }
            },
            lazyMethod: Function,
            lazyDisabled: [Boolean, Function],
            selectable: Boolean,
            showCheckbox: [Boolean, Function],
            checkStrictly: {
                type: Boolean,
                default: true
            },
            checkOnlyAvailableStrictly: Boolean,
            disableStrictly: {
                type: Boolean,
                default: true
            },
            displayMatchedNodeDescendants: Boolean,
            showLinkLine: Boolean,
            expandIcon: {
                type: String,
                default: 'bk-icon icon-down-shape'
            },
            collapseIcon: {
                type: String,
                default: 'bk-icon icon-right-shape'
            },
            loadingClass: {
                type: String,
                default: 'node-loading'
            },
            nodeIcon: {
                type: [String, Function]
            },
            defaultExpandAll: Boolean,
            defaultExpandedNodes: {
                type: Array,
                default () {
                    return []
                }
            },
            defaultCheckedNodes: {
                type: Array,
                default () {
                    return []
                }
            },
            defaultSelectedNode: {
                type: [String, Number],
                default: null
            },
            defaultDisabledNodes: {
                type: Array,
                default () {
                    return []
                }
            },
            beforeSelect: Function,
            beforeCheck: Function,
            expandOnClick: {
                type: Boolean,
                default: true
            },
            checkOnClick: Boolean,
            filterMethod: Function,
            nodeWidth: {
                type: [String, Number]
            },
            // 外部设置的 class name
            extCls: {
                type: String,
                default: ''
            },
            useDefaultEmpty: Boolean,
            height: Number, // 设置高度后默认开启虚拟滚动,
            nodeHeight: {
                type: Number,
                default: 32
            },
            configurable: {
                type: Boolean,
                default: true
            },
            padding: {
                type: Number,
                default: 30
            }
        },
        data () {
            return {
                nodes: [],
                map: {},
                selected: this.defaultSelectedNode,
                needsCalculateNodes: [],
                calculateTimer: null,
                inSearch: false,
                isSearchEmpty: false,
                id: `bk-big-tree-${idSeed++}`,
                nodeStatus: []
            }
        },
        computed: {
            computedNodeWidth () {
                const parsedWidth = parseInt(this.nodeWidth)
                if (isNaN(parsedWidth)) {
                    return null
                }
                return parsedWidth
            },
            nodeOptions () {
                const nodeOptions = {
                    idKey: 'id',
                    nameKey: 'name',
                    childrenKey: 'children'
                }
                return Object.assign(nodeOptions, this.options)
            },
            checkedNodes () {
                return this.nodes.filter(node => node.checked && node.hasCheckbox)
            },
            checked () {
                return this.checkedNodes.map(node => node.id)
            },
            visibleNodes () {
                return this.nodes.filter(node => !!node.visible)
            },
            treeHeight () {
                return this.height ? `${this.height}px` : 'auto'
            },
            hasLine () {
                return !this.height && this.showLinkLine
            }
        },
        watch: {
            needsCalculateNodes () {
                this.handleCalculateLine()
            },
            data (value) {
                this.nodeStatus = []
                for (const value of Object.values(this.map)) {
                    this.nodeStatus.push({
                        id: value.id,
                        expanded: value.expanded,
                        parent: value.parent
                    })
                }
                this.setData(value)
            }
        },
        mounted () {
            this.setData(this.data)
        },
        methods: {
            setData (data) {
                const nodes = []
                const map = {}
                this.recurrenceNodes(data, null, nodes, map)
                this.nodes = Object.freeze(nodes)
                this.map = map
                this.initNodeState()
                this.setVirtualScrollList()
                this.registryOptions(this.nodes)
                this.hasLine && this.needsCalculateNodes.push(...this.visibleNodes)
            },
            // 当在select组件嵌套tree时自动注册options，兼容select组件逻辑
            registryOptions (nodes) {
                const parent = this.$parent.$parent || this.$root
                const name = parent.$options.name
                if (name && name === 'bk-select' && parent.registerOption) {
                    nodes.forEach(node => {
                        parent.registerOption({
                            id: node.id,
                            name: node.name,
                            disabled: node.disabled,
                            unmatched: false,
                            isHighlight: false
                        })
                    })
                }
            },
            recurrenceNodes (data, parent, nodes, map) {
                data.forEach((datum, index) => {
                    const node = new TreeNode(datum, {
                        level: parent ? parent.level + 1 : 0,
                        parent: parent,
                        index: nodes.length
                    }, this)
                    if (parent) {
                        node.childIndex = parent.children.length
                        parent.children.push(node)
                    }
                    nodes.push(node)
                    map[node.id] = node

                    const children = datum[this.nodeOptions.childrenKey]
                    if (Array.isArray(children) && children.length) {
                        this.recurrenceNodes(children, node, nodes, map)
                    }
                })
            },
            getNodeById (id) {
                return this.map[id]
            },
            initNodeState () {
                !this.defaultExpandAll && this.initDefaultExpanded()
                this.initDefaultChecked()
                this.initDefaultDisabled()
            },
            initDefaultExpanded () {
                Object.values(this.map).forEach(node => {
                    const backupNode = this.nodeStatus.find(item => item.id === node.id)
                    if (backupNode) {
                        node.expanded = backupNode.expanded && this.isAllParentExpanded(backupNode)
                    }
                })
            },
            isAllParentExpanded (node) {
                if (!node.parent) {
                    return true
                } else {
                    const parent = node.parent
                    if (parent.expanded === false) {
                        return false
                    }
                    return this.isAllParentExpanded(parent)
                }
            },
            initDefaultChecked () {
                this.defaultCheckedNodes.forEach(id => {
                    const node = this.getNodeById(id)
                    if (node) {
                        node.checked = true
                    }
                })
            },
            initDefaultDisabled () {
                this.defaultDisabledNodes.forEach(id => {
                    const node = this.getNodeById(id)
                    if (node) {
                        node.disabled = true
                    }
                })
            },
            addNode (nodeData, parentId, trailing = true) {
                const options = typeof parentId === 'object' ? parentId : { parentId, trailing }
                const mergeOptions = Object.assign({
                    parentId: null,
                    trailing: true,
                    expandParent: true
                }, options)
                const data = convertToArray(nodeData)
                if (!data.length) {
                    return []
                }
                if (isNullOrUndefined(mergeOptions.parentId)) {
                    return this.addRootNode(data, mergeOptions)
                }
                return this.addChildNode(data, mergeOptions)
            },
            addRootNode (data, { trailing }) {
                const rootNodes = this.nodes.filter(node => node.level === 0)
                const offset = typeof trailing === 'number'
                    ? Math.min(trailing, rootNodes.length)
                    : trailing
                        ? rootNodes.length
                        : 0
                let insertIndex = 0
                if (offset > 0) {
                    const referenceRoot = rootNodes[offset - 1]
                    const referenceRootWithDescendants = [referenceRoot, ...referenceRoot.descendants]
                    const referenceNode = referenceRootWithDescendants[referenceRootWithDescendants.length - 1]
                    insertIndex = referenceNode.index + 1
                }
                const nodes = data.map(datum => {
                    return new TreeNode(datum, {
                        level: 0,
                        parent: null
                    }, this)
                })
                nodes.forEach(node => {
                    this.$set(this.map, node.id, node)
                })
                this.nodes.splice(insertIndex, 0, ...nodes)
                this.nodes.slice(insertIndex).forEach((node, index) => {
                    node.index = insertIndex + index
                })
                this.setVirtualScrollList()
                return nodes
            },
            addChildNode (data, options) {
                const { parentId, trailing } = options
                const parent = this.getNodeById(parentId)
                if (!parent) {
                    console.warn('Unexpected parent id, add node failed')
                    return
                }
                const children = parent.children
                const offset = typeof trailing === 'number'
                    ? Math.min(trailing, children.length)
                    : trailing
                        ? children.length
                        : 0
                let insertIndex
                if (offset > 0) {
                    const referenceChild = children[offset - 1]
                    const referenceChildWithDescendants = [referenceChild, ...referenceChild.descendants]
                    const referenceNode = referenceChildWithDescendants[referenceChildWithDescendants.length - 1]
                    insertIndex = referenceNode.index + 1
                } else {
                    insertIndex = parent.index + 1
                }
                const nodes = data.map(datum => {
                    return new TreeNode(datum, {
                        level: parent.level + 1,
                        parent: parent
                    }, this)
                })
                parent.appendChild(nodes, offset, options)
                nodes.forEach(node => {
                    this.$set(this.map, node.id, node)
                })
                this.nodes.splice(insertIndex, 0, ...nodes)
                this.nodes.slice(insertIndex).forEach((node, index) => {
                    node.index = insertIndex + index
                })
                this.setVirtualScrollList()
                return nodes
            },
            removeNode (nodeId) {
                try {
                    const ids = convertToArray(nodeId)
                    const nodes = []
                    ids.forEach(id => {
                        const node = this.getNodeById(id)
                        if (node) {
                            nodes.push(node)
                        }
                    })
                    // 从最大的node.index开始倒序splice
                    nodes.sort((M, N) => N.index - M.index)
                    nodes.forEach(node => {
                        const removeNodes = [node, ...node.descendants]
                        this.nodes.splice(node.index, removeNodes.length)
                        if (node.parent) {
                            node.parent.removeChild(node)
                        }
                    })
                    const minChangedIndex = Math.min(...nodes.map(node => node.index))
                    this.nodes.slice(minChangedIndex).forEach((node, index) => {
                        node.index = minChangedIndex + index
                    })
                    this.setVirtualScrollList()
                } catch (e) {
                    console.warn(e.message)
                }
            },
            async setSelected (nodeId, options = {}) {
                try {
                    if (!this.selectable || nodeId === this.selected) {
                        return false
                    }
                    const mergeOptions = {
                        emitEvent: false,
                        beforeSelect: true,
                        ...options
                    }
                    const node = this.getNodeById(nodeId)
                    if (mergeOptions.beforeSelect && typeof this.beforeSelect === 'function') {
                        const response = await this.beforeSelect(node)
                        if (!response) {
                            return false
                        }
                    }
                    this.selected = nodeId
                    if (mergeOptions.emitEvent) {
                        this.$emit('select-change', node)
                    }
                } catch (e) {
                    console.warn(e.message)
                }
            },
            removeChecked (options = {}) {
                try {
                    const mergeOptions = {
                        emitEvent: true,
                        ...options
                    }
                    this.checkedNodes.forEach(node => {
                        node.checked = false
                    })
                    if (mergeOptions.emitEvent) {
                        this.$emit('check-change', [], null, null)
                    }
                } catch (e) {
                    console.warn(e.message)
                }
            },
            async setChecked (nodeId, options = {}) {
                try {
                    const isMultiple = Array.isArray(nodeId)
                    const ids = isMultiple ? nodeId : [nodeId]
                    if (ids.length) {
                        const mergeOptions = {
                            emitEvent: false,
                            beforeCheck: true,
                            checked: true,
                            ...options
                        }
                        const nodes = ids.map(id => this.getNodeById(id))
                        if (mergeOptions.beforeCheck && typeof this.beforeCheck === 'function') {
                            const response = await this.beforeCheck(nodes.length > 1 ? nodes : nodes[0], mergeOptions.checked)
                            if (!response) {
                                return false
                            }
                        }
                        nodes.forEach(node => {
                            node.checked = mergeOptions.checked
                        })
                        if (mergeOptions.emitEvent) {
                            // 延时执行，防止大量数据时check卡顿问题
                            setTimeout(() => {
                                this.$emit('check-change', this.checked, isMultiple ? nodes : nodes[0])
                            }, 0)
                        }
                    }
                } catch (e) {
                    console.warn(e.message)
                }
            },
            setExpanded (nodeId, options = {}) {
                try {
                    const mergeOptions = {
                        expanded: true,
                        emitEvent: false,
                        ...options
                    }
                    const node = this.getNodeById(nodeId)
                    if (!node) {
                        console.warn('Unexpected node id, set expanded failed.')
                        return false
                    }
                    node.expanded = mergeOptions.expanded
                    if (mergeOptions.emitEvent) {
                        this.$emit('expand-change', node)
                    }
                    this.setVirtualScrollList()
                } catch (e) {
                    console.warn(e.message)
                }
            },
            setDisabled (nodeId, options = {}) {
                try {
                    const mergeOptions = {
                        disabled: true,
                        emitEvent: false,
                        ...options
                    }
                    const ids = convertToArray(nodeId)
                    const nodes = ids.map(id => this.getNodeById(id)).filter(node => !!node)
                    nodes.forEach(node => {
                        node.disabled = mergeOptions.disabled
                    })
                    if (mergeOptions.emitEvent) {
                        this.$emit('disable-change', nodes.length > 1 ? nodes : nodes[0])
                    }
                } catch (e) {
                    console.warn(e.message)
                }
            },
            handleCalculateLine () {
                this.calculateTimer && clearTimeout(this.calculateTimer)
                if (this.needsCalculateNodes.length) {
                    this.calculateTimer = setTimeout(() => {
                        this.needsCalculateNodes.forEach(node => {
                            this.calculateNodeLine(node)
                        })
                        this.needsCalculateNodes.splice(0)
                    }, 0)
                } else {
                    this.calculateTimer = null
                }
            },
            calculateNodeLine (node) {
                const {
                    children,
                    isLeaf,
                    expanded
                } = node
                if (isLeaf || !expanded) {
                    node.line = 0
                    return
                }
                const visibleChildren = children.filter(child => child.visible)
                if (!visibleChildren.length) {
                    node.line = 0
                    return
                }
                const firstChild = visibleChildren[0]
                const firstChildElement = this.$el.querySelector(`#${firstChild.uid}`)
                const lastChild = visibleChildren[visibleChildren.length - 1]
                const lastChildElement = this.$el.querySelector(`#${lastChild.uid}`)
                node.line = lastChildElement.getBoundingClientRect().bottom - firstChildElement.getBoundingClientRect().top
            },
            defaultFilterMethod (keyword, node) {
                return String(node.name).toLowerCase().indexOf(keyword) > -1
            },
            filter (keyword = '') {
                const matchedNodes = []
                const filterMethod = this.filterMethod || this.defaultFilterMethod
                if (keyword === '') {
                    this.inSearch = false
                    this.nodes.forEach(node => {
                        node.setState('matched', true)
                        node.recalculateLinkLine()
                        if (this.checkOnlyAvailableStrictly) {
                            node.setState('checked', false)
                        }
                        matchedNodes.push(node)
                    })
                } else {
                    this.inSearch = true
                    const convertKeyword = this.filterMethod ? keyword : String(keyword).toLowerCase()
                    this.nodes.forEach(node => {
                        const matched = filterMethod(convertKeyword, node)
                        node.setState('matched', matched)
                        if (this.checkOnlyAvailableStrictly) {
                            node.setState('checked', false)
                        }
                        if (matched) {
                            node.parent && (node.parent.expanded = true)
                            matchedNodes.push(node)
                        } else {
                            node.recalculateLinkLine()
                        }
                    })
                }
                this.isSearchEmpty = matchedNodes.length === 0
                this.setVirtualScrollList()
                return matchedNodes
            },
            handleNodeClick (node) {
                if (node.disabled) {
                    return false
                }
                this.$emit('node-click', node)
                this.setSelected(node.id, {
                    emitEvent: true,
                    beforeSelect: true
                })
                if (this.expandOnClick && !node.isLeaf) {
                    this.setExpanded(node.id, {
                        emitEvent: true,
                        expanded: !node.expanded
                    })
                }
                if (this.checkOnClick) {
                    this.setChecked(node.id, {
                        emitEvent: true,
                        checked: !node.checked
                    })
                }
            },
            handleNodeExpand (node) {
                this.setExpanded(node.id, {
                    expanded: !node.expanded,
                    emitEvent: true
                })
            },
            handleNodeCheck (node) {
                if (node.disabled) {
                    return false
                }
                this.setChecked(node.id, {
                    checked: node.indeterminate ? true : !node.checked,
                    emitEvent: true,
                    beforeCheck: true
                })
            },
            setVirtualScrollList () {
                // 未开启虚拟滚动不执行
                if (!this.height) return

                if (!this.$refs.virtualScroll) {
                    console.warn('virtual dom is not ready')
                    return
                }
                this.$nextTick(() => {
                    this.$refs.virtualScroll.setListData(this.visibleNodes)
                })
            },
            // 虚拟滚动区域resize
            resize () {
                this.$refs.virtualScroll && this.$refs.virtualScroll.resize()
            }
        }
    }
</script>

<style lang="postcss">
@define-mixin scroller $backgroundColor: #dcdee5, $width: 6px {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        min-height: 24px;
        border-radius: 3px;
        background-color: $backgroundColor;
    }
}
@define-mixin ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
@define-mixin inlineBlock $align: middle {
    display: inline-block;
    vertical-align: $align;
}
.bk-big-tree {
    overflow: auto;
    @mixin scroller;
    &.with-virtual-scroll {
        .bk-big-tree-empty {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
    .bk-big-tree-empty {
        text-align: center;
        font-size: 14px;
        color: #63656e;
    }
}
.bk-big-tree-node {
    position: relative;
    height: 32px;
    padding-left: calc(var(--level) * var(--padding));
    line-height: 32px;
    font-size: 0;
    cursor: pointer;

    &.has-link-line {
        padding-left: 0;
        margin-left: calc(var(--level) * var(--padding));
        &:not(.is-root):before {
            content: "";
            position: absolute;
            width: calc(var(--padding) - 8px);
            height: 0;
            border-bottom: 1px dashed #c3cdd7;
            left: calc(8px - var(--padding));
            top: 15px;
            z-index: 1;
            pointer-events: none;
        }
        &:after {
            position: absolute;
            top: 24px;
            left: 8px;
            width: 0;
            height: calc(var(--line) * 1px - 8px);
            border-left: 1px dashed #c3cdd7;
            content: "";
            pointer-events: none;
            z-index: 1;
        }
        &.is-leaf {
            padding-left: 8px;
            margin-left: calc(var(--level) * var(--padding) + 12px);
            &:before {
                width: calc(var(--padding));
                left: calc(0px - var(--padding));
            }
        }
    }
    &:hover {
        background-color: #f1f7ff;
    }
    &.is-selected {
        background-color: #e1ecff;
        .node-icon {
            color: #fff;
            background-color: #3a84ff;
        }
        .node-content {
            color: #3a84ff;
        }
    }
    &.is-leaf {
        padding-left: calc(var(--level) * var(--padding) + 20px);
    }
    &.is-disabled {
        cursor: not-allowed;
    }
    .node-options {
        height: 100%;
        .node-folder-icon {
            @mixin inlineBlock;
            position: relative;
            width: 16px;
            height: 16px;
            margin: 0 4px 0 0;
            line-height: 16px;
            text-align: center;
            font-size: 12px;
            color: #979ba5;
            z-index: 2;
            &:hover {
                color: #63656e;
            }
        }
        .node-checkbox {
            @mixin inlineBlock;
            position: relative;
            width: 16px;
            height: 16px;
            margin: 0 6px 0 0;
            border: 1px solid #979ba5;
            border-radius: 2px;
            &.is-checked {
                border-color: #3a84ff;
                background-color: #3a84ff;
                background-clip: border-box;
                &:after {
                    content: "";
                    position: absolute;
                    top: 1px;
                    left: 4px;
                    width: 4px;
                    height: 8px;
                    border: 2px solid #fff;
                    border-left: 0;
                    border-top: 0;
                    transform-origin: center;
                    transform: rotate(45deg) scaleY(1);
                }
                &.is-disabled {
                    background-color: #dcdee5;
                }
            }
            &.is-disabled {
                border-color: #dcdee5;
                cursor: not-allowed;
            }
            &.is-indeterminate {
                border-width: 7px 4px;
                border-color: #3a84ff;
                background-color: #fff;
                background-clip: content-box;
                &:after {
                    visibility: hidden;
                }
            }
        }
        .node-icon {
            @mixin inlineBlock;
            margin: 0 6px;
            font-size: 18px;
        }
    }
    .node-content {
        @mixin ellipsis;
        font-size: 14px;
    }
}
</style>
