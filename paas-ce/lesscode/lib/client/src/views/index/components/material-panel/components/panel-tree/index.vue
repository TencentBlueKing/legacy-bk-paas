<template>
    <div class="panel-tree">
        <div class="tree-search-area">
            <bk-input
                class="tree-search"
                :right-icon="'bk-icon icon-search'"
                :clearable="true"
                @change="handleSearch" />
            <span
                :class="['bk-drag-icon', treeFoldIcon]"
                v-bk-tooltips="tooltip"
                @click="handleToggleExpandTree">
            </span>
        </div>
        <div class="tree-wrapper">
            <bk-big-tree
                ref="tree"
                :selectable="true"
                :expand-on-click="false"
                class="component-tree"
                @expand-change="checkIsAllExpanded"
                @select-change="handleNodeSelect">
                <div slot-scope="{ data: nodeData }">
                    <div class="component-tree-node-item">
                        <i
                            class="bk-drag-icon"
                            :class="nodeData.payload.componentData.material.icon" />
                        <span>{{ nodeData.name }}</span>
                        <i
                            v-if="nodeData.payload.componentData.isInteractiveComponent"
                            class="component-eye-control bk-drag-icon"
                            :class="{
                                'bk-drag-visible-eye': nodeData.payload.componentData.interactiveShow,
                                'bk-drag-invisible-eye': !nodeData.payload.componentData.interactiveShow
                            }"
                            v-bk-tooltips="{
                                content: nodeData.payload.componentData.interactiveShow ? '隐藏' : '显示',
                                placement: 'top',
                                interactive: false
                            }"
                            @click.self.stop="handleToggleInteractive(nodeData)"></i>
                    </div>
                </div>
            </bk-big-tree>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'

    const getDataFromNodeTree = tree => {
        if (!tree) {
            return []
        }
        
        return tree.map(node => Object.freeze({
            id: node.componentId,
            name: node.componentId,
            children: getDataFromNodeTree(node.children),
            payload: {
                componentData: node
            }
        }))
    }

    export default {
        data () {
            return {
                allExpanded: false
            }
        },
        computed: {
            treeFoldIcon () {
                return this.allExpanded ? 'bk-drag-unfold' : 'bk-drag-fold'
            },
            tooltip () {
                return this.allExpanded ? '收起所有' : '展开所有'
            }
        },
        
        mounted () {
            this.$refs.tree.setData(getDataFromNodeTree(LC.getRoot().children))
            
            /**
             * @desc 组件树监听 update 回调
             * @param { Object } event
             */
            const updateCallback = _.throttle((event) => {
                // 缓存节点的展开状态
                let expandIdListMemo = []
                // 非移除组件操作都需要保留节点的展开状态
                if (![
                    'removeChild'
                ].includes(event.type)) {
                    expandIdListMemo = this.$refs.tree.nodes.reduce((result, node) => {
                        if (node.expanded) {
                            result.push(node.id)
                        }
                        return result
                    }, [])
                }
                this.$refs.tree.setData(getDataFromNodeTree(LC.getRoot().children))
                // 还原展开状态
                expandIdListMemo.forEach((nodeId) => {
                    if (this.$refs.tree.getNodeById(nodeId)) {
                        this.$refs.tree.setExpanded(nodeId)
                    }
                })
            }, 100)
            /**
             *
             * @desc 组件树监听 active 回调
             * @param { Object } event
             *
             * 展开所有父级节点（这样才能看到当前节点）
             */
            const activeCallback = event => {
                const activeNode = event.target

                let activeNodeParent = activeNode.parentNode
                while (activeNodeParent && !activeNodeParent.type.root) {
                    if (this.$refs.tree.getNodeById(activeNodeParent.componentId)) {
                        this.$refs.tree.setExpanded(activeNodeParent.componentId, {
                            expanded: true
                        })
                    }
                    activeNodeParent = activeNodeParent.parentNode
                }
                
                this.$refs.tree.setSelected(activeNode.componentId)
            }

            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('toggleInteractive', updateCallback)
            
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('toggleInteractive', activeCallback)
            })
        },
        methods: {
            /**
             * @desc 节点搜索
             * @param { String } text
             *
             * 默认选中搜索结果的第一个节点
             */
            handleSearch: _.debounce(function (text) {
                const data = this.$refs.tree.filter(text.trim())
                if (data.length > 0) {
                    this.$nextTick(() => {
                        this.$refs.tree.setSelected(data[0].id, {
                            emitEvent: true
                        })
                    })
                }
            }, 300),
            /**
             * @desc 切换整个树的展开、收起状态
             */
            handleToggleExpandTree () {
                this.allExpanded = !this.allExpanded
                const commandTreeNodes = (nodes, command) => {
                    if (!nodes || nodes.length < 1) {
                        return
                    }
                    nodes.forEach(node => {
                        this.$refs.tree.setExpanded(node.id, {
                            expanded: command,
                            emitEvent: true
                        })
                        commandTreeNodes(node.children, command)
                    })
                }
                commandTreeNodes(this.data, this.allExpanded)
            },
            /**
             * @desc 切换交互式组件的显示状态
             * @param { Object } node 树节点
             */
            handleToggleInteractive (node) {
                const componentData = node.payload.componentData
                componentData.active()
                componentData.toggleInteractive()
            },
            /**
             * @desc 选中树节点
             * @param { Object } node 树节点
             */
            handleNodeSelect (node) {
                const componentData = node.data.payload.componentData

                /**
                 * @desc 显示指定的交互式组件
                 * @param { Object } targetComponentNode 需要显示的交互式组件
                 */
                const showInteractiveComponent = (targetComponentNode) => {
                    let currentShowInteractiveComponent = null
                    const firstLevelChild = LC.getRoot().children
                    for (let i = 0; i < firstLevelChild.length; i++) {
                        const componentNode = firstLevelChild[i]
                        if (componentNode.isInteractiveComponent && componentNode.interactiveShow) {
                            currentShowInteractiveComponent = componentNode
                            break
                        }
                    }
                    // 隐藏是显示状态的交互式组件
                    if (currentShowInteractiveComponent
                        && currentShowInteractiveComponent !== targetComponentNode) {
                        currentShowInteractiveComponent.toggleInteractive(false)
                    }
                    // 显示指定的交互式组件
                    targetComponentNode && targetComponentNode.toggleInteractive(true)
                }
                /**
                 * @desc 找到父级的交互式组件
                 * @returns { Object | null }
                 */
                const findInteractiveParent = () => {
                    let parentNode = componentData.parentNode
                    while (parentNode) {
                        if (parentNode.isInteractiveComponent) {
                            return parentNode
                        }
                        parentNode = parentNode.parentNode
                    }
                    return null
                }
                
                // 选中节点对应的组件是交互式组件
                if (componentData.isInteractiveComponent) {
                    showInteractiveComponent(componentData)
                    return
                }

                // 选中节点对应组件的附属于交互式组件
                const interactiveParent = findInteractiveParent()
                if (interactiveParent) {
                    showInteractiveComponent(interactiveParent)
                } else {
                    showInteractiveComponent(null)
                }

                // 组件被选中并滚动到视窗内
                componentData.active()
                componentData.$elm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            },
            /**
             * @desc 展开节点时检测整棵树的展开状态
             */
            checkIsAllExpanded () {
                this.allExpanded = this.$refs.tree.nodes.every(node => node.isLeaf || node.expanded)
            }
        }
    }
</script>

<style lang="postcss" scoped>
@import "@/css/mixins/scroller";

.panel-tree {
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
        width: 300px;
        height: calc(100% - 42px);
        overflow-x: overlay;
        padding-bottom: 10px;
        @mixin scroller;
        /deep/ .component-tree {
            width: max-content;
            min-width: 100%;
            .bk-big-tree-node {
                .component-tree-node-item {
                    position: relative;
                    padding-right: 30px;
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
