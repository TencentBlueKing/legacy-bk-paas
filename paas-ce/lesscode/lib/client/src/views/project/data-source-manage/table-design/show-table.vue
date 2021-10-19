<template>
    <article v-bkloading="{ isLoading: tableStatus.isLoading }">
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                查看表【{{tableStatus.basicInfo.tableName}}】
                <bk-divider direction="vertical"></bk-divider>
                <export-table title="导出表" class="mr10 ml5" size="small"></export-table>
                <bk-button size="small" class="mr10">变更记录</bk-button>
                <bk-button size="small" @click="goEdit">编辑</bk-button>
            </span>
        </render-header>

        <main class="table-main">
            <section class="table-section">
                <h5 class="section-title">基础信息</h5>
                <info-table ref="basicForm" :basic-info="tableStatus.basicInfo" :is-edit="false"></info-table>
            </section>

            <section class="table-section">
                <h5 class="section-title">字段配置</h5>
                <field-table :data.sync="tableStatus.data"></field-table>
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
        useTableStatus,
        transformFieldObject2FieldArray
    } from './composables/table-info'
    import {
        messageError
    } from '@/common/bkmagic'
    import renderHeader from '../common/header'
    import fieldTable from '../common/field-table'
    import exportTable from '../common/export.vue'
    import infoTable from '../common/info-table.vue'
    import router from '@/router'
    import store from '@/store'

    export default defineComponent({
        components: {
            renderHeader,
            fieldTable,
            exportTable,
            infoTable
        },

        setup () {
            const tableStatus = useTableStatus()
            const id = router?.currentRoute?.query?.id

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            const goEdit = () => {
                router.push({ name: 'editTable', query: { id } })
            }

            const getDetail = () => {
                tableStatus.isLoading = true
                store.dispatch('dataSource/findOne', id).then((data) => {
                    tableStatus.basicInfo.tableName = data.tableName
                    tableStatus.basicInfo.comment = data.comment
                    tableStatus.data = transformFieldObject2FieldArray(data.columns)
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    tableStatus.isLoading = false
                })
            }

            onBeforeMount(getDetail)

            return {
                tableStatus,
                goBack,
                goEdit
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
