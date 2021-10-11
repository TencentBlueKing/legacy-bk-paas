<template>
    <section>
        <bk-button @click="showImport">导入</bk-button>

        <bk-dialog
            theme="primary"
            header-position="left"
            width="640"
            v-model="isShowImport"
            :title="title">
            <bk-upload
                with-credentials
                :limit="1"
                :multiple="false"
                :url="uploadUrl"
                accept=".sql,.cvs"
                @on-success="importFile"
            ></bk-upload>

            <span class="import-tip">
                支持 CSV，SQL 文件格式，
                <bk-link theme="primary">
                    <i class="bk-drag-icon bk-drag-download"></i>CSV 模板
                </bk-link>
                <bk-divider direction="vertical" class="tip-divider"></bk-divider>
                <bk-link theme="primary">
                    <i class="bk-drag-icon bk-drag-download"></i>SQL 模板
                </bk-link>
            </span>
        </bk-dialog>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'

    export default defineComponent({
        props: {
            title: String
        },

        setup () {
            const uploadUrl = `${AJAX_URL_PREFIX}/page/importJson`
            const isShowImport = ref<boolean>(false)

            const showImport = () => {
                isShowImport.value = true
            }

            const importFile = (res) => {
                const importContent = res.responseData.data
                console.log(importContent)
            }

            return {
                uploadUrl,
                isShowImport,
                showImport,
                importFile
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .import-tip, ::v-deep .bk-link-text {
        font-size: 12px;
        line-height: 16px;
    }
    .import-tip {
        display: inline-flex;
        align-items: center;
        margin-bottom: 26px;
    }
    .bk-drag-download {
        font-size: 14px;
        margin-right: 4px;
    }
    .tip-divider {
        margin: 0 4px !important;
    }
</style>
