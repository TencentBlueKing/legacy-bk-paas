<template>
    <article v-bkloading="{ isLoading }">
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                查看表【{{tableStatus.basicInfo.tableName}}】
                <bk-divider direction="vertical"></bk-divider>
                <bk-button size="small" class="mr10 ml5" @click="goEdit">编辑</bk-button>
                <export-table title="导出表" class="mr10" :only-export-all="true" @download="exportTables"></export-table>
                <bk-button size="small" @click="goRecord">变更记录</bk-button>
            </span>
        </render-header>

        <main class="table-main">
            <section class="table-section">
                <h5 class="section-title">基础信息</h5>
                <info-table :basic-info="tableStatus.basicInfo" :is-edit="false"></info-table>
            </section>

            <section class="table-section">
                <h5 class="section-title">字段配置</h5>
                <show-column-table :columns="tableStatus.data"></show-column-table>
            </section>
        </main>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        onBeforeMount
    } from '@vue/composition-api'
    import {
        useTableStatus
    } from './composables/table-info'
    import {
        generateExportStruct
    } from 'shared/data-source'
    import {
        messageError
    } from '@/common/bkmagic'
    import renderHeader from '../common/header'
    import exportTable from '../common/export.vue'
    import infoTable from '../common/info-table.vue'
    import showColumnTable from '../common/show-column-table.vue'
    import router from '@/router'
    import store from '@/store'
    import {
        downloadFile
    } from '@/common/util.js'

    export default defineComponent({
        components: {
            renderHeader,
            exportTable,
            infoTable,
            showColumnTable
        },

        setup () {
            const {
                tableStatus,
                isLoading
            } = useTableStatus()
            const id = router?.currentRoute?.query?.id

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            const goRecord = () => {
                router.push({ name: 'updateTableRecord', query: { id } })
            }

            const goEdit = () => {
                router.push({ name: 'editTable', query: { id } })
            }

            const getDetail = () => {
                isLoading.value = true
                store.dispatch('dataSource/findOne', id).then((data) => {
                    tableStatus.basicInfo.tableName = data.tableName
                    tableStatus.basicInfo.comment = data.comment
                    tableStatus.data = data.columns
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    isLoading.value = false
                })
            }

            const exportTables = (fileType) => {
                const tables = [{
                    ...tableStatus.basicInfo,
                    columns: tableStatus.data
                }]
                const fileName = fileType === 'sql' ? `lesscode-struct-${tableStatus.basicInfo.tableName}.sql` : ''
                const files = generateExportStruct(tables, fileType, fileName)
                files.forEach(({ name, content }) => {
                    downloadFile(content, name)
                })
            }

            onBeforeMount(getDetail)

            return {
                tableStatus,
                isLoading,
                goBack,
                goRecord,
                goEdit,
                exportTables
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .table-header {
        display: flex;
        align-items: center;
        .bk-drag-arrow-back {
            color: #3a84ff;
            padding: 10px;
            cursor: pointer;
            font-size: 14px;
        }
    }
    .table-main {
        padding: 20px 24px;
        height: calc(100% - 52px);
        overflow-y: auto;
    }
    .table-section {
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.05);
        padding: 16px 24px 25px;
        margin-bottom: 23px;
        .section-title {
            font-weight: 700;
            text-align: left;
            color: #313238;
            line-height: 19px;
            font-size: 14px;
            margin: 0 0 12px;
        }
    }
</style>
