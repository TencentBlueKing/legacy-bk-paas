<template>
    <menu-item :item="item"></menu-item>
</template>

<script>
    import MenuItem from './menu-item'
    import cloneDeep from 'lodash.clonedeep'
    import { getNodeWithClass } from '@/common/util'
    // import { bus } from '@/common/bus'
    // import LC from '@/element-materials/core'

    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                isInDragArea: false,
                item: {
                    icon: 'bk-drag-icon bk-drag-keyboard',
                    text: '快捷键',
                    func: () => this.toggleShowQuickOperation(true)
                }
            }
        },
        mounted () {
            // window.addEventListener('keydown', this.quickOperation)
            // window.addEventListener('keyup', this.judgeCtrl)
            // window.addEventListener('click', this.toggleQuickOperation, true)

            // bus.$on('on-delete-component', this.showDeleteElement)
            // this.$once('hook:beforeDestroy', () => {
            //     bus.$off('on-delete-component', this.showDeleteElement)
            // })
        },
        methods: {
            toggleShowQuickOperation () {
                alert(7734)
                alert(this.item.text)
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
                        funcChainMap.isInDragArea().exec(this.putComponentData)
                        break
                    case 83:
                        funcChainMap.isInDragArea().hasCtrl().preventDefault().exec(this.handleSave)
                        break
                    case 86:
                        funcChainMap.isInDragArea().exec(this.copyComponent)
                        break
                    case 88:
                        funcChainMap.isInDragArea().exec(this.cutComponent)
                        break
                    case 90:
                        funcChainMap.isInDragArea().hasCtrl().exec(this.backTargetHistory)
                        break
                    case 89:
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

            cutComponent () {
                if (!this.hasCtrl || Object.keys(this.curSelectedComponentData || {}).length <= 0) return

                if (!this.checkIsDelComponent()) {
                    return
                }

                const copyData = cloneDeep(this.curSelectedComponentData)
                this.setCopyData(copyData)
                this.delComponentConf.item = Object.assign({}, this.curSelectedComponentData)
                this.confirmDelComponent()
            },

            putComponentData () {
                if (!this.hasCtrl) return
                const copyData = cloneDeep(this.curSelectedComponentData)
                this.setCopyData(copyData)
            },

            copyComponent () {
                if (!this.hasCtrl || Object.keys(this.copyData).length <= 0) return
                const copyNode = this.$td(this.curSelectedComponentData.componentId).appendChild(this.copyData, true)
                const pos = copyNode.getNodePosition()
                if (pos) {
                    const pushData = {
                        parentId: pos.parent && pos.parent.componentId,
                        component: copyNode.value(),
                        columnIndex: pos.columnIndex,
                        childrenIndex: pos.childrenIndex,
                        type: 'add'
                    }

                    this.pushTargetHistory(pushData)
                }
            }
        }
    }
</script>
