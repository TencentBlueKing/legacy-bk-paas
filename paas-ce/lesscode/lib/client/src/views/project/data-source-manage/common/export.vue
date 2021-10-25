<template>
    <section>
        <bk-button @click="showExport" :size="size">导出</bk-button>

        <bk-dialog
            theme="primary"
            header-position="left"
            width="640"
            v-model="isShowExport"
            :title="title"
            :show-footer="false">
            <section class="export-home">
                <h3 class="export-title">请选择导出格式</h3>
                <p class="export-items">
                    <span @click="downLoad('csv')" class="export-item">
                        <i class="bk-drag-icon bk-drag-csv"></i>
                        CSV 文件
                    </span>
                    <span @click="downLoad('sql')" class="export-item">
                        <i class="bk-drag-icon bk-drag-sql"></i>
                        SQL 文件
                    </span>
                </p>
            </section>
        </bk-dialog>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'
    import { downloadFile } from '@/common/util.js'

    export default defineComponent({
        props: {
            title: String,
            size: {
                type: String,
                default: 'normal'
            }
        },

        setup () {
            const isShowExport = ref<boolean>(false)

            const showExport = () => {
                isShowExport.value = true
            }

            const downLoad = (type) => {
                downloadFile('ww')
            }

            return {
                isShowExport,
                showExport,
                downLoad
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .export-home {
        display: flex;
        flex-direction: column;
    }
    .export-title {
        line-height: 19px;
        margin: 0 0 16px;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
    }
    .export-items {
        display: flex;
        justify-content: center;
        margin-bottom: 75px;
    }
    .export-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 100px;
        border: 1px solid #dcdee5;
        border-radius: 4px;
        cursor: pointer;
        &:first-child {
            margin-right: 29px;
        }
        &:hover {
            background: #e1ecff;
            border: 1px solid #3a84ff;
            color: #3a84ff;
        }
        .bk-drag-icon {
            font-size: 32px;
            margin-bottom: 11px;
        }
    }
</style>
