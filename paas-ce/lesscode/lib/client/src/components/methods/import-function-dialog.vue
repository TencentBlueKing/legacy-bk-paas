<template>
    <bk-dialog
        width="800"
        :value="show"
        :loading="loading"
        :mask-close="false"
        :auto-close="false"
        @confirm="handleImport"
        @after-leave="afterLeave"
    >
        <section class="mb10">
            <bk-button @click="importFunction" class="mr10" theme="primary" v-bk-tooltips="{ content: '只可导入Json文件格式，且文件内容需要是Json格式的数组' }">导入</bk-button>
            <slot></slot>
        </section>

        <edit-object :value.sync="importFuncJson" :height="400" />
    </bk-dialog>
</template>

<script>
    import editObject from '@/components/edit-object'
    import { uploadFile } from '@/common/util'

    export default {
        components: {
            editObject
        },

        props: {
            show: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                importFuncJson: '[]'
            }
        },

        methods: {
            handleImport () {
                const funcList = JSON.parse(this.importFuncJson || '[]')
                this.$emit('import', funcList)
            },

            importFunction () {
                uploadFile().then((fileList) => {
                    try {
                        const funcList = []
                        fileList.forEach((file) => {
                            funcList.push(...JSON.parse(file))
                        })
                        this.importFuncJson = JSON.stringify(funcList, null, 2)
                    } catch (err) {
                        this.$bkMessage({ theme: 'error', message: '文件内容需要是Json格式的数组' })
                    }
                })
            },

            afterLeave () {
                this.importFuncJson = '[]'
                this.$emit('update:show', false)
            }
        }
    }
</script>
