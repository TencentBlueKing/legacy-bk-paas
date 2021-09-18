<template>
    <bk-dialog
        v-model="isShow"
        :position="{ top: 100 }"
        render-directive="if"
        width="800"
        :title="'数据示例'"
        header-position="left"
        :mask-close="false"
        :show-footer="false"
        :on-close="handleClose"
        ext-cls="remote-example-dialog">
        <div class="remote-example-viewer" ref="remoteViewer"></div>
    </bk-dialog>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => ({
                    name: '',
                    value: null
                })
            }
        },

        data () {
            return {
                editor: {},
                isShow: false
            }
        },

        watch: {
            isShow (val) {
                if (val) {
                    this.$nextTick(() => {
                        this.initMonaco()
                    })
                }
            }
        },

        methods: {
            handleClose () {
                setTimeout(() => {
                    this.editor && this.editor.dispose()
                    this.isShow = false
                }, 200)
            },
            getDefaultData () {
                let defaultData
                switch (this.data.name) {
                    case 'initFormData':
                        defaultData = { string: '', boolean: false, array: [1, 2, 3] }
                        break
                    default:
                        let dataString
                        try {
                            dataString = JSON.stringify(this.data.value)
                        } catch (e) {
                            dataString = JSON.stringify(this.data.value, function (key, value) {
                                if (key === 'parent') {
                                    return
                                }
                                return value
                            })
                        }
                        defaultData = JSON.parse(dataString)
                        break
                }
                return JSON.stringify(defaultData, null, '\t')
            },
            initMonaco () {
                monaco.editor.defineTheme('remote-viewer', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [{ background: '#242424' }],
                    colors: {
                        'editor.background': '#242424'
                    }
                })
                const value = this.getDefaultData()
                this.editor = monaco.editor.create(this.$refs.remoteViewer, {
                    value: value,
                    theme: 'remote-viewer',
                    readOnly: true,
                    fontSize: 14,
                    fontFamily: 'Consolas',
                    cursorBlinking: 'solid',
                    automaticLayout: true,
                    minimap: {
                        enabled: false // 关闭小地图
                    }
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .remote-example-viewer{
        height: 403px;
    }
    .remote-content {
        background: #f0f1f5;
        .remote-button {
            margin: 0 0 10px 6px;
        }
    }
</style>
