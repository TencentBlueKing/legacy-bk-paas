<template>
    <div ref="monacoEditor" :style="{ height: height, width: width, position: 'relative' }">
    </div>
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
                default: '320px'
            },
            options: Object
        },

        data () {
            return {
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
            }
        },

        mounted () {
            this.initMonaco()
        },

        beforeDestroy () {
            setTimeout(() => {
                this.editor && this.editor.dispose()
            }, 200)
        },

        methods: {
            initMonaco () {
                const options = Object.assign({
                    value: this.value,
                    theme: 'vs-dark',
                    language: 'css',
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
                    this.editor.getAction('editor.action.formatDocument').run()
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
</style>
