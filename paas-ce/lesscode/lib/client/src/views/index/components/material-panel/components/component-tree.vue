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
                :style="`width: ${treeWidth + 'px'}`"
                :expand-on-click="false"
                ext-cls="component-tree"
                :options="{ idKey: 'componentId' }"
                @expand-change="checkIsAllExpanded"
                @select-change="activeNode"
                ref="tree">
                <!-- eslint-disable-next-line vue/no-template-shadow -->
                <div slot-scope="{ data }">
                    <div class="component-tree-node-item">
                        <i :class="nodeIcon(data)"></i>
                        <span>{{data.componentId}}</span>
                        <i v-if="data.isInteractiveComponent"
                            v-bk-tooltips="componentEyeTips(data)"
                            :class="['component-eye-control', 'bk-drag-icon', eyeIconClass(data)]"
                            @click.stop="eyeClickHandler(data)"></i>
                    </div>
                </div>
            </tree>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import Tree from './tree/tree.vue'
    import { mapMutations, mapGetters } from 'vuex'

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
                allExpanded: false,
                treeWidth: 300,
                data: [],
                LC: LC
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
            }
        },
        created () {
            this.data = Object.freeze(LC.getRoot().children)
        },
        mounted () {
            this.$nextTick(() => this.computeTreeWidth()) // 初始化时，动态计算tree的宽度

            const updateCallback = _.throttle(() => {
                this.data = Object.freeze(LC.getRoot().children)
            }, 100)
            /**
             * 组件树监听update的回调
             * @description 当update的的时候需要做几件事
             *    ① 展开所有父级节点（这样才能看到当前节点）
             *    ② 判断当前激活节点或其祖先节点是否是交互式组件，如果是交互式组件，需要将其设置为可见状态
             */
            const activeCallback = async event => {
                await this.expandParent(event.target)

                const activeNode = event.target
                
                this.$refs.tree.setSelected(activeNode.componentId)

                this.data.forEach(item => {
                    item.hideInteractive()
                })
                const parent = this.isParentInteractive(activeNode)
                if (parent) {
                    this.setComponentVisible(parent)
                }
            }
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', activeCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', activeCallback)
            })
        },
        methods: {
            ...mapMutations(['setPopMaskObserve']),
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData'
            ]),
            /** 判断当前组件及其父组件是否是交互式组件 */
            isParentInteractive (node) {
                if (node.isInteractiveComponent) {
                    return node
                } else if (node.parentNode.type !== 'root') {
                    return this.isParentInteractive(node.parentNode)
                } else {
                    return false
                }
            },
            expandParent (node, queue = []) {
                if (node.parentNode.type !== 'root') {
                    queue.push(node.parentNode.componentId)
                    return this.expandParent(node.parentNode, queue)
                }
                for (let i = queue.length - 1; i >= 0; i--) {
                    this.$refs.tree.setExpanded(queue[i], { expanded: true, emitEvent: true })
                }
                return Promise.resolve(true)
            },
            eyeIconClass (node) {
                return node.interactiveShow ? 'bk-drag-visible-eye' : 'bk-drag-invisible-eye'
            },
            eyeClickHandler (node) {
                if (!node.isActived) {
                    node.active()
                    return
                }
                setTimeout(() => {
                    this.setComponentVisible(node)
                }, 0)
            },
            componentEyeTips (node) {
                return {
                    content: node.interactiveShow ? '隐藏' : '显示',
                    placement: 'top',
                    interactive: false
                }
            },
            /** toggle interactive component visible status */
            setComponentVisible (node) {
                node.toggleInteractive()

                /** 去除dialog交互式组件 插入在body的mask */
                setTimeout(() => {
                    const dialogMask = document.getElementsByClassName('bk-dialog-mask')[0]
                    if (dialogMask) {
                        if (this.pagePopMaskObserve === null) {
                            this.setPopMaskObserve(new MutationObserver((mutation) => {
                                console.log('监听dialog中')
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
            foldIcon () {
                this.commandTreeNodes(this.data, !this.allExpanded)
            },
            checkIsAllExpanded () {
                this.allExpanded = this.$refs.tree.nodes.every(node => node.isLeaf || node.expanded)
                setTimeout(() => {
                    this.computeTreeWidth()
                }, 0)
            },
            computeTreeWidth () {
                const tree = document.getElementsByClassName('bk-big-tree')[0]
                const nodeLevels = Array.from(tree.children)
                    .map(item => item.getAttribute('style'))
                    .map(item => +item.replace(/^--level:(\d+).*/, '$1'))

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
            activeNode (node) {
                if (node.data.isActived || node.data.type === 'render-column') {
                    return
                }
                node.data && node.data.active()
                /** 将画布中的目标节点移动至视区 */
                this.transformCanvasToView(node.data.componentId)
            },
            transformCanvasToView (id) {
                const canvasTarget = document.querySelector(`div[data-component-id="${id}"]`)
                const anchorNode = this.setAnchorPoint(canvasTarget)
                anchorNode.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
                canvasTarget.parentNode.removeChild(anchorNode)
            },
            /**
             * @desc 设置targetData的一个不可见的元素，用于做scrollIntoView的偏移
             */
            setAnchorPoint (targetNode) {
                const anchorNode = document.createElement('div')
                anchorNode.style.position = 'absolute'
                anchorNode.style.top = (targetNode.offsetTop - 10) + 'px'
                anchorNode.style.left = targetNode.offsetLeft + 'px'
                targetNode.parentNode.appendChild(anchorNode)
                return anchorNode
            },
            commandTreeNodes (nodes, command) {
                nodes.forEach(node => {
                    this.$refs.tree.setExpanded(node.componentId, { expanded: command, emitEvent: true })
                    if (node.children.length) {
                        this.commandTreeNodes(node.children, command)
                    }
                })
            },
            searchTree () {
                this.$refs.tree.filter(this.filter)
            },
            nodeIcon (node) {
                return `bk-drag-icon ${node.material.icon}`
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
