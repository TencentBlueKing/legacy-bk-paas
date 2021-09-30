<template>
    <section>
        <bk-button @click="showExport">导入</bk-button>

        <bk-dialog
            theme="primary"
            header-position="left"
            width="640"
            v-model="isShowExport"
            :title="title">
            <bk-button @click="importFile">导入</bk-button>

        </bk-dialog>
    </section>
</template>

<script lang="ts">
    import { defineComponent } from '@vue/composition-api'
    import { uploadFile } from '@/common/util.js'

    export default defineComponent({
        props: {
            title: String
        },

        data () {
            return {
                isShowExport: false
            }
        },

        methods: {
            showExport () {
                this.isShowExport = true
            },

            importFile () {
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
            }
        }
    })
</script>

<style lang="postcss" scoped>

</style>
