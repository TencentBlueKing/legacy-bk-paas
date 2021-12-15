<template>
    <menu-item :item="item">
        <template>
            <div class="quick-operation" v-bk-clickoutside="toggleShowQuickOperation">
                <div class="tool-item" @click="toggleShowQuickOperation(true)">
                    <i :class="item.icon"></i>
                    <span>{{item.text}}</span>
                </div>
                <section class="operation-main" v-if="showQuickOperation === true">
                    <h5 class="operation-title"><span class="title-main">快捷键说明</span><i class="bk-icon icon-close" @click.stop="toggleShowQuickOperation(false)"></i></h5>
                    <ul class="operation-list">
                        <li v-for="(operation, shortcutIndex) in quickOperationList" :key="shortcutIndex" class="operation-item">
                            <span class="operation-keys">
                                <span v-for="(key, keyIndex) in operation.keys" :key="key">
                                    <span class="operation-key">{{ key }}</span><span v-if="keyIndex !== operation.keys.length - 1" class="operation-plus">+</span>
                                </span>
                            </span>
                            <span class="operation-name">{{ operation.name }}</span>
                        </li>
                    </ul>
                </section>
            </div>
        </template>
    </menu-item>
</template>

<script>
    import MenuItem from './menu-item'
    import { getNodeWithClass } from '@/common/util'
    // import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'
    import { NodeHistory } from '@/element-materials/core/Node-history'

    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-keyboard',
                    text: '快捷键',
                    func: () => this.toggleShowQuickOperation(true)
                },
                hasCtrl: false,
                showQuickOperation: false,
                isInDragArea: false,
                quickOperationList: [
                    { keys: ['Ctrl / Cmd', 'C'], name: '复制' },
                    { keys: ['Ctrl / Cmd', 'V'], name: '粘贴' },
                    { keys: ['Ctrl / Cmd', 'Z'], name: '撤销' },
                    { keys: ['Ctrl / Cmd', 'Y'], name: '恢复' },
                    { keys: ['Ctrl / Cmd', 'S'], name: '保存' },
                    { keys: ['Delete / Backspace'], name: '删除' }
                ]
            }
        },
        mounted () {
            window.addEventListener('keydown', this.quickOperation)
            window.addEventListener('keyup', this.judgeCtrl)
            window.addEventListener('click', this.toggleQuickOperation, true)

            // bus.$on('on-delete-component', this.showDeleteElement)
            // this.$once('hook:beforeDestroy', () => {
            //     bus.$off('on-delete-component', this.showDeleteElement)
            // })
        },
        methods: {
            toggleShowQuickOperation (show) {
                if (show === true) {
                    this.showQuickOperation = true
                } else {
                    this.showQuickOperation = false
                }
            },
            judgeCtrl (event) {
                switch (event.keyCode) {
                    case 91:
                    case 224:
                    case 93:
                    case 17:
                        this.hasCtrl = false
                        break
                }
            },

            toggleQuickOperation (event) {
                const mainNode = getNodeWithClass(event.target, 'target-drag-area')
                this.isInDragArea = mainNode && mainNode.classList.contains('target-drag-area')
            },

            quickOperation (event) {
                console.log(NodeHistory, NodeHistory.nodeHistoryList, 45, NodeHistory.curCopyNode)
                const vm = this
                const funcChainMap = {
                    stopped: false,
                    isInDragArea: function () {
                        if (!vm.isInDragArea) this.stopped = true
                        return this
                    },
                    hasCtrl: function () {
                        if (!vm.hasCtrl) this.stopped = true
                        return this
                    },
                    preventDefault: function () {
                        if (!this.stopped) event.preventDefault()
                        return this
                    },
                    isDelComponentConfirm: function () {
                        if (!vm.delComponentConf.visiable) this.stopped = true
                        return this
                    },
                    exec: function (callBack) {
                        if (!this.stopped) callBack()
                        return this
                    }
                }

                switch (event.keyCode) {
                    case 91:
                    case 224:
                    case 93:
                    case 17:
                        this.hasCtrl = true
                        break
                    case 67:
                        console.log('ctrlc')
                        funcChainMap.isInDragArea().exec(this.putComponentData)
                        break
                    case 83:
                        funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.handleSave)
                        break
                    case 86:
                        console.log('ctrlv')
                        funcChainMap.isInDragArea().exec(this.copyComponent)
                        break
                    case 88:
                        console.log('ctrlx,剪切')
                        funcChainMap.isInDragArea().exec(this.cutComponent)
                        break
                    case 90:
                        console.log('ctrlz,撤销')
                        funcChainMap.isInDragArea().hasCtrl().exec(this.backTargetHistory)
                        break
                    case 89:
                        console.log('ctrly,恢复')
                        funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.forwardTargetHistory)
                        break
                    case 8:
                    case 46:
                        funcChainMap.isInDragArea().preventDefault().exec(this.showDeleteElement)
                        break
                    case 13:
                        funcChainMap.isDelComponentConfirm().exec(this.confirmDelComponent)
                        break
                }
            },

            // 剪切
            cutComponent () {
                if (!this.hasCtrl || Object.keys(LC.getActiveNode() || {}).length <= 0) return

                if (!this.checkIsDelComponent()) {
                    return
                }

                const copyData = LC.getActiveNode().cloneNode(true)
                this.setCopyData(copyData)
                this.delComponentConf.item = Object.assign({}, LC.getActiveNode())
                this.confirmDelComponent()
            },

            // 复制
            putComponentData () {
                if (!this.hasCtrl || Object.keys(LC.getActiveNode()).length <= 0) return
                const copyNode = LC.getActiveNode().cloneNode(true)
                NodeHistory.setCopyNode(copyNode)
            },

            // 粘贴
            copyComponent () {
                const copyNode = NodeHistory.curCopyNode || {}
                if (!this.hasCtrl || Object.keys(copyNode).length <= 0) return

                LC.getActiveNode().pasteNode(copyNode)
            }
        }
    }
</script>
