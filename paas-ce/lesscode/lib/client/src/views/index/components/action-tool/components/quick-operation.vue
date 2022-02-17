<template>
    <menu-item
        :item="item"
        v-bk-tooltips="{
            allowHtml: true,
            width: 530,
            distance: 10,
            trigger: 'mouseenter',
            theme: 'light',
            content: `#quickOperationIntro`,
            placement: 'bottom',
            boundary: 'window'
        }">
        <div style="display: none">
            <div id="quickOperationIntro">
                <div class="operation-title">
                    <span class="title-main">快捷键说明</span>
                </div>
                <ul class="operation-list">
                    <li
                        v-for="(operation, shortcutIndex) in quickOperationList"
                        :key="shortcutIndex"
                        class="operation-item">
                        <span class="operation-keys">
                            <span
                                v-for="(key, keyIndex) in operation.keys"
                                :key="key">
                                <span class="operation-key">{{ key }}</span>
                                <span
                                    v-if="keyIndex !== operation.keys.length - 1"
                                    class="operation-plus">
                                    +
                                </span>
                            </span>
                        </span>
                        <span class="operation-name">{{ operation.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </menu-item>
</template>
<script>
    import MenuItem from './menu-item'
    import { getNodeWithClass } from '@/common/util'
    import LC from '@/element-materials/core'
    import { NodeHistory } from '@/element-materials/core/Node-history'
    import { remove, removeCallBack } from '@/element-materials/core/helper/commands'

    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-keyboard',
                    text: '快捷键',
                    func: () => {}
                },
                hasCtrl: false,
                isInDragArea: false,
                quickOperationList: [
                    { keys: ['Ctrl / Cmd', 'C'], name: '复制' },
                    { keys: ['Ctrl / Cmd', 'V'], name: '粘贴' },
                    { keys: ['Ctrl / Cmd', 'X'], name: '剪切' },
                    // { keys: ['Ctrl / Cmd', 'Z'], name: '撤销' },
                    // { keys: ['Ctrl / Cmd', 'Y'], name: '恢复' },
                    // { keys: ['Ctrl / Cmd', 'S'], name: '保存' },
                    { keys: ['Delete / Backspace'], name: '删除' }
                ]
            }
        },
        mounted () {
            window.addEventListener('keydown', this.quickOperation)
            window.addEventListener('keyup', this.judgeCtrl)
            window.addEventListener('click', this.toggleQuickOperation, true)
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.quickOperation)
            window.removeEventListener('keyup', this.judgeCtrl)
            window.removeEventListener('click', this.toggleQuickOperation, true)
        },
        methods: {
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
                        vm.$nextTick(() => {
                            if (!this.stopped) callBack()
                            return this
                        })
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
                        funcChainMap.isInDragArea().exec(this.putComponentData)
                        console.log(566)
                        break
                    // case 83:
                    //     funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.handleSave)
                    //     break
                    case 86:
                        funcChainMap.isInDragArea().exec(this.copyComponent)
                        break
                    case 88:
                        funcChainMap.isInDragArea().exec(this.cutComponent)
                        break
                    // case 90:
                    //     console.log('ctrlz,撤销')
                    //     funcChainMap.isInDragArea().hasCtrl().exec(this.backHistory)
                    //     break
                    // case 89:
                    //     console.log('ctrly,恢复')
                    //     funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.forwardHistory)
                    //     break
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

                const copyNode = LC.getActiveNode()
                NodeHistory.setCopyNode(copyNode)
                remove(LC.getActiveNode())
            },

            // 复制
            putComponentData () {
                if (!this.hasCtrl || Object.keys(LC.getActiveNode() || {}).length <= 0) return
                const copyNode = LC.getActiveNode()
                NodeHistory.setCopyNode(copyNode)
            },

            // 粘贴
            copyComponent () {
                const copyNode = NodeHistory.curCopyNode || {}
                if (!this.hasCtrl || Object.keys(copyNode).length <= 0 || Object.keys(LC.getActiveNode() || {}).length <= 0) return
                LC.getActiveNode().pasteNode(copyNode)
            },

            showDeleteElement () {
                removeCallBack()
            },

            backHistory () {
                NodeHistory.backHistoryList()
            },

            forwardTargetHistory () {
                NodeHistory.forwardHistoryList()
            }
        }
    }
</script>
<style lang="postcss">
    #quickOperationIntro {
        height: 230px;
        left: 0;
        top: 60px;
        color: #000;
        cursor: default;
        .operation-title {
            margin: 0;
            padding: 0;
            line-height: 26px;
            font-size: 20px;
            font-weight: normal;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 22px;
            .icon-close {
                position: absolute;
                font-size: 32px;
                right: 6px;
                top: 0;
                color: #979ba5;
                cursor: pointer;
            }
        }
        .operation-item {
            float: left;
            margin: 10px 0;
            line-height: 28px;
            font-size: 12px;
            color: #63656e;
            .operation-keys {
                margin-right: 26px;
                .operation-key {
                    display: inline-block;
                    text-align: center;
                    width: 40px;
                    height: 30px;
                    border: 1pt solid #c4c6cc;
                    border-radius: 2px;
                }
                .operation-plus {
                    display: inline-block;
                    margin: 0 15px;
                }
                >span:first-child .operation-key {
                    width: 80px;
                }
            }
            &:nth-child(odd) {
                margin-right: 50px;
            }
            &:last-child .operation-keys span.operation-key{
                width: 160px;
            }
        }
    }
</style>
