<template>
    <div class="component-tree-wrapper">
        <div class="tree-search-area">
            <bk-input ext-cls="tree-search"
                :right-icon="'bk-icon icon-search'"
                :clearable="true"
                v-model="filter"
                @change="searchTree"></bk-input>
            <span :class="['bk-drag-icon', treeFoldIcon]"
                v-bk-tooltips="tooltip"
                @click="foldIcon">
            </span>

        </div>
        <div class="tree-wrapper">
            <tree :data="data"
                :selectable="true"
                :node-icon="nodeIcon"
                :style="`width: ${treeWidth + 'px'}`"
                :expand-on-click="false"
                ext-cls="component-tree"
                @expand-change="checkIsAllExpanded"
                @select-change="activeNode"
                ref="tree">
                <div slot-scope="{ node }">
                    <div class="component-tree-node-item">
                        <i :class="nodeIcon"></i>
                        <span>{{node.id}}</span>
                        <i v-if="showComponentEye(node.data.type)"
                            v-bk-tooltips="componentEyeTips(node.id)"
                            :class="['component-eye-control', 'bk-drag-icon', eyeIconClass(node.id)]"
                            @click="setComponentVisible(node.id)"></i>
                    </div>
                </div>
            </tree>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    import Tree from '@/components/widget/tree/tree.vue'
    import allComponentConf from '@/element-materials/materials'
    import { deepSearchStack, removeClassWithNodeClass } from '@/common/util.js'
    import { mapMutations, mapGetters } from 'vuex'
    import findTargetData from '@/common/targetData.js'
    import { bus } from '@/common/bus'

    const baseComponentList = allComponentConf['bk'].concat(allComponentConf['element'] || [])

    export default {
        components: {
            Tree
        },
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                filter: '',
                allExpanded: true,
                treeWidth: 300
            }
        },
        computed: {
            ...mapGetters(['pagePopMaskObserve']),
            ...mapGetters('drag', [
                'curSelectedComponentData'
            ]),
            ...mapGetters('components', ['interactiveComponents']),
            treeFoldIcon () {
                return this.allExpanded ? 'bk-drag-unfold' : 'bk-drag-fold'
            },
            tooltip () {
                return this.allExpanded ? '收起所有' : '展开所有'
            },
            data () {
                return this.targetData.map(item => {
                    return {
                        id: item['componentId'],
                        name: item['componentId'],
                        icon: this.getItemIcon(item),
                        type: item.type,
                        children: item.renderProps.slots ? this.getNodeChildren(item.renderProps.slots, item['componentId']) : []
                    }
                })
            },
            nodesNameList () {
                return deepSearchStack(this.data, 'id')
            }
        },
        mounted () {
            this.getItemIcon()
            this.$nextTick(() => this.computeTreeWidth()) // 初始化时，动态计算tree的宽度
            bus.$on('selected-tree', this.setActiveTreeSelected)

            const curSelectedComponentId = this.curSelectedComponentData.componentId
            if (curSelectedComponentId) {
                this.$nextTick(() => this.setActiveTreeSelected(curSelectedComponentId))
            }
        },
        beforeDestroy () {
            bus.$off('selected-tree', this.setActiveTreeSelected)
        },
        methods: {
            ...mapMutations(['setPopMaskObserve']),
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData'
            ]),
            isInteractiveNodeShow (id) {
                return this.targetData.find(target => target.componentId === id).interactiveShow
            },
            eyeIconClass (id) {
                return this.isInteractiveNodeShow(id) ? 'bk-drag-visible-eye' : 'bk-drag-invisible-eye'
            },
            componentEyeTips (id) {
                return {
                    content: this.isInteractiveNodeShow(id) ? '隐藏' : '显示',
                    placement: 'top',
                    interactive: false
                }
            },
            showComponentEye (type) {
                return this.interactiveComponents.includes(type)
            },
            setComponentVisible (id) {
                this.$td().setCurInteractiveVisible(id, false)

                /** 去除dialog交互式组件 插入在body的mask */
                setTimeout(() => {
                    const dialogMask = document.getElementsByClassName('bk-dialog-mask')[0]
                    if (dialogMask) {
                        if (this.pagePopMaskObserve === null) {
                            this.setPopMaskObserve(new MutationObserver((mutation) => {
                                /** 判断mask的Zindex，来判断是否是对话框关闭动作 */
                                const reg = /^z-index:\s?(\d{4})/
                                const oldValue = mutation[0] && mutation[0].oldValue
                                const curValue = mutation[0] && mutation[0].target

                                const oldZIndex = parseInt(reg.exec(oldValue) && reg.exec(oldValue)[1]) || 0
                                const curZIndex = parseInt(curValue.style.zIndex)
                                if (oldZIndex > curZIndex) {
                                    dialogMask.style.display = 'none'
                                }
                            }))
                            this.pagePopMaskObserve.observe(dialogMask, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] })
                        }
                        dialogMask.style.display = 'none'
                    }
                }, 50)
            },
            setActiveTreeSelected (id) {
                /** 先展开节点以及节点的所有父级，再设置选中 */
                const parentNodes = this.treeFindPath(this.data, item => item.id === id)
                parentNodes && parentNodes.forEach(node => {
                    this.$refs.tree.setExpanded(node.id, { expanded: true, emitEvent: true })
                })

                this.$refs.tree.setSelected(id)
            },
            foldIcon () {
                this.manageTree(!this.allExpanded)
            },
            checkIsAllExpanded (node) {
                this.allExpanded = this.$refs.tree.nodes.every(node => node.expanded)
                setTimeout(() => {
                    this.computeTreeWidth()
                }, 0)
            },
            computeTreeWidth () {
                const tree = document.getElementsByClassName('bk-big-tree')[0]
                const nodeLevels = Array.from(tree.children)
                    .map(item => item.getAttribute('style'))
                    .map(item => +item.replace(/^--level:(\d).*/, '$1'))

                const maxLevel = Math.max(...nodeLevels)
                const width = maxLevel <= 3 ? 300 : 300 + (maxLevel - 3) * 30
                this.treeWidth = width
            },

            findTopParent (node) {
                let curNode = node
                while (curNode.parent) {
                    curNode = curNode.parent
                }
                return curNode.id === node.id ? null : curNode
            },

            getNodeVisableStatus (node) {
                return this.targetData.find(item => item.componentId === node.id).interactiveShow
            },

            activeNode (node) {
                const topParent = this.findTopParent(node)
                if (topParent && topParent.data.type === 'bk-dialog') {
                    console.log('diloag parent', topParent)
                    !this.getNodeVisableStatus(topParent) && this.setComponentVisible(topParent.data.id)
                } else if (!this.interactiveComponents.includes(node.data.type)
                    && this.interactiveComponents.includes(this.curSelectedComponentData.type)) {
                    console.log('hide')
                    this.$td().hideAllInteractiveComponents()
                }

                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'selected')
                removeClassWithNodeClass('.component-wrapper', 'selected')
                removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')

                const wrapperList = Array.from(document.getElementsByClassName('wrapperCls'))
                    .concat(Array.from(document.getElementsByClassName('bk-layout-grid-row-wrapper'))
                        .map(item => {
                            return Array.from(item.getElementsByTagName('div'))
                        }).flat()
                    )
                    .concat(Array.from(document.getElementsByClassName('bk-layout-free-wrapper'))
                        .map(item => {
                            return Array.from(item.getElementsByTagName('div'))
                        }).flat()
                    )
                const curRowNode = Array.prototype.find.call(wrapperList, item => {
                    return (
                        item.getAttribute('data-component-id') === 'component-' + node.id
                        || item.getAttribute('data-component-id') === 'grid-' + node.id
                        || item.getAttribute('data-component-id') === 'free-layout-' + node.id
                    )
                })

                const curRowTargetNode = node.id.includes('grid') ? curRowNode.getElementsByClassName('bk-layout-grid-row')[0] : curRowNode

                const selectClassName = curRowTargetNode && curRowTargetNode.className === 'wrapperCls' ? 'wrapper-cls-selected' : 'selected'
                curRowTargetNode.classList.add(selectClassName)

                const anchorNode = this.setAnchorPoint(curRowTargetNode)
                anchorNode.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
                curRowTargetNode.parentNode.removeChild(anchorNode)

                const targetNode = findTargetData(node.id)
                this.setCurSelectedComponentData(_.cloneDeep(targetNode.targetData))
            },
            setAnchorPoint (targetNode) {
                const anchorNode = document.createElement('div')
                anchorNode.style.position = 'absolute'
                anchorNode.style.top = (targetNode.offsetTop - 10) + 'px'
                anchorNode.style.left = targetNode.offsetLeft + 'px'
                targetNode.parentNode.appendChild(anchorNode)
                return anchorNode
            },
            manageTree (command) {
                this.nodesNameList.forEach(node => {
                    this.$refs.tree.setExpanded(node, { expanded: command, emitEvent: true })
                })
            },
            searchTree () {
                this.$refs.tree.filter(this.filter)
            },
            nodeIcon (node) {
                return node.icon
            },
            getItemIcon (item) {
                if (item && item.name === 'grid') {
                    return 'bk-drag-grid-2 bk-drag-icon'
                } else if (item && item.name.includes('icon')) {
                    return item.name + ' bk-icon'
                }

                if (item && item.name) {
                    const node = baseComponentList.find(node => node.name === item.name)
                    return (node && node.icon) ? node.icon + ' bk-drag-icon' : 'bk-drag-icon bk-drag-custom-comp-default'
                }

                return ''
            },
            treeFindPath (tree, func) {
                const path = []
                const list = [...tree]
                const visitedSet = new Set()
                while (list.length) {
                    const node = list[0]
                    if (visitedSet.has(node)) {
                        path.pop()
                        list.shift()
                    } else {
                        visitedSet.add(node)
                        node.children && list.unshift(...node.children)
                        path.push(node)
                        if (func(node)) return path
                    }
                }
                return null
            },
            getNodeChildren (nodeSlot, parentId) {
                if (nodeSlot.type === 'column' || nodeSlot.type === 'free-layout-item' || nodeSlot.name === 'layout') {
                    if (nodeSlot.name === 'layout') {
                        const node = nodeSlot.val || {}
                        return [
                            {
                                id: node['componentId'],
                                name: node['componentId'],
                                icon: this.getItemIcon(node),
                                parent_id: parentId,
                                children: node.renderProps.slots ? this.getNodeChildren(node.renderProps.slots) : []
                            }
                        ]
                    } else {
                        return nodeSlot.val.map(val => {
                            return val.children.map(node => {
                                return {
                                    id: node['componentId'],
                                    name: node['componentId'],
                                    icon: this.getItemIcon(node),
                                    parent_id: parentId,
                                    children: node.renderProps.slots ? this.getNodeChildren(node.renderProps.slots) : []
                                }
                            })
                        }).flat()
                    }
                }
                return []
            }
        }
    }
</script>

<style lang="postcss" scoped>
@import "@/css/mixins/scroller";

.component-tree-wrapper {
    height: calc(100% - 13px);
    .tree-search-area {
        margin: 13px 10px 10px 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .tree-search {
            width: 242px;
            flex: 1;
            margin-right: 12px;
        }
        .bk-drag-icon {
            cursor: pointer;
            &:hover {
                color: #3a84ff;
            }
        }
    }
    .tree-wrapper {
        height: calc(100% - 42px);
        overflow-x: overlay;
        padding-bottom: 10px;
        @mixin scroller;
        /deep/ .component-tree {
            .bk-big-tree-node {
                .component-tree-node-item {
                    position: relative;
                    .component-eye-control {
                        position: absolute;
                        right: 18px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        display: inline-block;
                    }
                }
                &.is-root {
                    padding-left: 10px;
                }
                &.is-selected .node-icon {
                    color: #3a84ff;
                    background-color: transparent;
                }
            }
        }
    }
}
</style>
