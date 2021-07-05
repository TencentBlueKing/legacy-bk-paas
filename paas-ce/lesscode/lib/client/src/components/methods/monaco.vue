<template>
    <section>
        <section class="monaco-head">
            <i v-if="!isFull" class="bk-drag-icon bk-drag-code-full-screen icon-style" @click="openFullScreen"></i>
            <i v-else class="bk-drag-icon bk-drag-un-full-screen icon-style" @click="exitFullScreen"></i>
            <slot name="tools"></slot>
        </section>
        <section class="monaco-editor"
            :style="{
                height: calcSize(renderHeight),
                width: calcSize(renderWidth),
                position: 'relative'
            }"
        ></section>
    </section>
</template>

<script>
    export default {
        props: {
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
                    const value = this.editor.getValue()
                    if (newValue !== value) {
                        this.editor.setValue(newValue)
                    }
                }
            },

            width (newVal) {
                this.renderWidth = newVal
                this.initWidth = this.width
                this.$nextTick(() => {
                    this.resize()
                })
            },

            height (newVal) {
                this.renderHeight = newVal
                this.initHeight = this.height
                this.$nextTick(() => {
                    this.resize()
                })
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
                const options = Object.assign({
                    value: this.value,
                    theme: 'vs-dark',
                    language: 'javascript',
                    fontSize: 14,
                    fontFamily: 'Consolas',
                    cursorBlinking: 'solid',
                    fixedOverflowWidgets: true,
                    automaticLayout: true,
                    minimap: {
                        enabled: false // 关闭小地图
                    }
                }, this.options)

                const el = this.$el.querySelector('.monaco-editor')
                this.editor = monaco.editor.create(el, options, {
                    storageService: {
                        get () {},
                        getBoolean (key, index, value) {
                            if (key === 'expandSuggestionDocs') return true
                            else return value
                        },
                        store () {},
                        remove () {},
                        onWillSaveState () {},
                        onDidChangeStorage () {}
                    }
                })
                this.editor.onDidChangeModelContent(event => {
                    const value = this.editor.getValue()
                    if (this.value !== value) {
                        this.$emit('update:value', value)
                        this.$emit('change', value)
                    }
                })

                this.$nextTick(() => {
                    this.editor.setValue(this.value)
                    this.editor.getAction('editor.action.formatDocument').run()
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
                    this.$nextTick().then(() => {
                        this.renderWidth = this.initWidth
                        this.renderHeight = this.initHeight
                        this.$emit('exitFullScreen')
                    })
                }
            },

            openFullScreen () {
                const element = this.$el
                const fullScreenMethod = element.requestFullScreen // W3C
                    || element.webkitRequestFullScreen // FireFox
                    || element.webkitExitFullscreen // Chrome等
                    || element.msRequestFullscreen // IE11
                if (fullScreenMethod) {
                    fullScreenMethod.call(element)
                    this.$nextTick().then(() => {
                        this.renderWidth = window.screen.width
                        this.renderHeight = window.screen.height
                        this.$emit('openFullScreen')
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
                console.log()
                this.editor.layout()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .monaco-head {
        line-height: 30px;
        height: 30px;
        background-color: #1e1e1e;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .icon-style {
        width: 16px;
        height: 16px;
        color: #c4c6cc;
        cursor: pointer;
        margin-right: 8px;
    }
</style>
