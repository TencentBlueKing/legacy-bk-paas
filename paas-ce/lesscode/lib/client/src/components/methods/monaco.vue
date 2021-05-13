<template>
    <div ref="monacoEditor" :style="{ height: calcSize(renderHeight), width: calcSize(renderWidth), position: 'relative' }">
        <template v-if="fullScreen">
            <span><i class="bk-icon icon-info-circle icon-style" v-bk-tooltips="methodTip()"></i></span>
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
            funcType: {
                type: Number
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
            methodTip () {
                const commentMap = {
                    0: ` 1. 空白函数，函数内容完全由用户编写\r\n 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n 4. 用于事件时：函数将在事件触发时执行\r\n 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n 7. 用于属性时示例如下：\r\n    return Promise.all([\r\n        this.$http.get(\'${location.origin}/api/data/getMockData\'),\r\n        this.$http.post(\'${location.origin}/api/data/postMockData\', { value: 2 })\r\n    ]).then(([getDataRes, postDataRes]) => {\r\n        return [...getDataRes.data, ...postDataRes.data]\r\n    })\r\n`,
                    1: ` 1. 远程函数，系统将会根据参数组成 Ajax 请求，由用户在这里编写 Ajax 回调函数\r\n 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n 4. 用于事件时：事件触发时候，系统将发起 Ajax 请求，然后执行用户编写的回调函数\r\n 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n 7. 示例如下：return res.data`
                }
                return {
                    placement: 'left-start',
                    theme: 'light',
                    content: `<pre class="component-method-tip">${commentMap[+this.funcType]}</pre>`
                }
            },

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
                    minimap: {
                        enabled: false // 关闭小地图
                    }
                }, this.options)

                this.editor = monaco.editor.create(this.$el, options, {
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
        top: 7px;
        right: 4px;
        z-index: 1;
        color: #C4C6CC;
        cursor: pointer;
    }
    .bk-drag-icon, .icon-info-circle {
        width: 16px;
        height: 16px;
        color: #979ba5;
        display: inline-block;
    }
    .icon-info-circle {
        right: 24px;
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
</style>
<style lang="postcss">
    .component-method-tip {
        font-family: Consolas;
        font-weight: normal;
        font-size: 12px;
        font-feature-settings: "liga" 0, "calt" 0;
        line-height: 16px;
        letter-spacing: 0px;
    }
</style>
