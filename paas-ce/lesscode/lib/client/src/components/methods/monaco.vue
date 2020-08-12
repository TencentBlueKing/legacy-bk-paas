<template>
    <div ref="monacoEditor" :style="{ height: calcSize(renderHeight), width: calcSize(renderWidth), position: 'relative' }">
        <template v-if="fullScreen">
            <span v-if="!isFull" class="bk-drag-icon bk-drag-code-full-screen icon-style" @click="openFullScreen"> </span>
            <span v-else @click="exitFullScreen" class="un-full-screen icon-style" style="right: 20px;">
                <i class="bk-drag-icon bk-drag-un-full-screen"></i>
                <span>退出全屏</span>
            </span>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            fullScreen: Boolean,
            value: String,
            width: {
                type: [String, Number],
                default: 'auto'
            },
            height: {
                type: [String, Number],
                default: 320
            },
            options: Object
        },

        data () {
            return {
                initWidth: this.width,
                initHeight: this.height,
                renderWidth: this.width,
                renderHeight: this.height,
                isFull: false,
                editor: {}
            }
        },

        watch: {
            options (options) {
                if (this.editor) {
                    this.editor.updateOptions(options)
                    this.editor.layout()
                }
            },

            value (newValue) {
                if (this.editor) {
                    if (newValue !== this.editor.getValue()) {
                        this.editor.setValue(newValue)
                    }
                }
            },

            width (newVal) {
                this.renderWidth = newVal
                this.initWidth = this.width
            },

            height (newVal) {
                this.renderHeight = newVal
                this.initHeight = this.height
            }
        },

        mounted () {
            this.initMonaco()
            window.addEventListener('resize', this.handleFullScreen)
        },

        beforeDestroy () {
            window.removeEventListener('resize', this.handleFullScreen)
            setTimeout(() => {
                this.editor && this.editor.dispose()
            }, 200)
        },

        methods: {
            calcSize (size) {
                const _size = size.toString()
                if (_size.match(/^[\d\.]*$/)) return `${size}px`
                else return _size
            },

            initMonaco () {
                const options = Object.assign(
                    {
                        value: this.value,
                        theme: 'vs-dark',
                        language: 'javascript',
                        fontSize: 14,
                        fontFamily: 'Consolas',
                        cursorBlinking: 'solid',
                        minimap: {
                            enabled: false // 关闭小地图
                        }
                    }, this.options)

                this.editor = monaco.editor.create(this.$el, options)
                this.editor.onDidChangeModelContent(event => {
                    const value = this.editor.getValue()
                    if (this.value !== value) {
                        this.$emit('update:value', value)
                    }
                })
                this.$nextTick(() => {
                    this.editor.setValue(this.value)
                })
            },

            handleFullScreen () {
                if (document.fullscreenElement) {
                    this.isFull = true
                    return true
                } else if (this.isFull) {
                    this.isFull = false
                    this.renderWidth = this.initWidth
                    this.renderHeight = this.initHeight
                    this.$nextTick().then(() => {
                        this.editor.layout()
                    })
                }
                return false
            },

            exitFullScreen () {
                const exitMethod = document.exitFullscreen // W3C
                if (exitMethod) {
                    exitMethod.call(document)
                }
            },

            openFullScreen () {
                const element = this.$refs.monacoEditor
                const fullScreenMethod = element.requestFullScreen // W3C
                    || element.webkitRequestFullScreen // FireFox
                    || element.webkitExitFullscreen // Chrome等
                    || element.msRequestFullscreen // IE11
                if (fullScreenMethod) {
                    fullScreenMethod.call(element)
                    this.renderWidth = window.screen.width
                    this.renderHeight = window.screen.height
                    this.$nextTick().then(() => {
                        this.editor.layout()
                    })
                } else {
                    this.$bkMessage({
                        showClose: true,
                        message: this.$t('此浏览器不支持全屏操作，请使用chrome浏览器'),
                        type: 'warning'
                    })
                }
            },

            getMonaco () {
                return this.editor
            },

            focus () {
                this.editor.focus()
            },

            resize () {
                this.editor.layout()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .icon-style {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 1;
        color: #C4C6CC;
        cursor: pointer;
    }
    .bk-drag-icon {
        width: 16px;
        height: 16px;
        color: #979ba5;
        display: inline-block;
    }
    .un-full-screen {
        width: 108px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        opacity: 0.7;
        background: #000000;
        border-radius: 2px;
        &:hover {
            opacity: 0.9;
        }
    }
    /deep/ .monaco-editor .overflow-guard {
        padding-top: 20px;
        .margin {
            padding-top: 20px;
        }
    }
</style>
