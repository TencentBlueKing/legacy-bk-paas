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
    import LC from '@/element-materials/core'
    import { NodeHistory } from '@/element-materials/core/Node-history'
    import MenuItem from './menu-item'

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
                quickOperationList: [
                    { keys: ['Ctrl / Cmd', 'C'], name: '复制' },
                    { keys: ['Ctrl / Cmd', 'V'], name: '粘贴' },
                    { keys: ['Ctrl / Cmd', 'X'], name: '剪切' },
                    // { keys: ['Ctrl / Cmd', 'Z'], name: '撤销' },
                    // { keys: ['Ctrl / Cmd', 'Y'], name: '恢复' },
                    // { keys: ['Ctrl / Cmd', 'S'], name: '保存' },
                    { keys: ['Delete / Backspace'], name: '删除' }
                ],
                isFocused: false
            }
        },
        created () {
            const focusCallback = (event) => {
                const $drawRoot = document.querySelector('#lesscodeDrawContent')
                this.isFocused = false
                const $target = event.target
                for (let i = 0; i < $target.path; i++) {
                    if ($target.path[i] === $drawRoot) {
                        this.isFocused = true
                        break
                    }
                }
            }

            const activeCallbak = () => {
                this.isFocused = true
            }
            
            window.addEventListener('keydown', this.handleQuickOperation)
            document.body.addEventListener('click', focusCallback)
            LC.addEventListener('active', activeCallbak)

            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('keydown', this.handleQuickOperation)
                document.body.removeEventListener('click', focusCallback)
                LC.removeEventListener('active', activeCallbak)
            })
        },
        
        methods: {
            handleQuickOperation (event) {
                console.log(event, this.isFocused)
                if (!this.isFocused) {
                    return
                }
                const copyKeyCode = [67]
                const pastKeyCode = [86]
                const cutKeyCode = [88]
                const removeKeyCode = [8, 46]
                
                if (event.metaKey) {
                    if (pastKeyCode.includes(event.keyCode)) {
                        LC.execCommand('paste')
                    }
                    if (copyKeyCode.includes(event.keyCode)) {
                        LC.execCommand('copy')
                    }
                    if (cutKeyCode.includes(event.keyCode)) {
                        LC.execCommand('cut')
                    }
                } else {
                    if (removeKeyCode.includes(event.keyCode)) {
                        LC.execCommand('remove')
                    }
                }
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
