<template>
    <article>
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                新建表
            </span>
        </render-header>

        <main class="table-main">
            <section class="table-section">
                <h5 class="section-title">基础信息</h5>
                <info-table ref="basicForm" :basic-info="tableStatus.basicInfo"></info-table>
            </section>

            <section class="table-section">
                <h5 class="section-title">字段配置</h5>
                <field-table :data.sync="tableStatus.data"></field-table>
            </section>

            <bk-button theme="primary" class="mr5" @click="submit" :loading="tableStatus.isLoading">提交</bk-button>
            <bk-button @click="goBack" :disabled="tableStatus.isLoading">取消</bk-button>
        </main>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref
    } from '@vue/composition-api'
    import {
        useTableStatus,
        transformFieldObject2FieldArray,
        transformFieldArray2FieldObject
    } from './composables/table-info'
    import {
        baseColumns,
        DataParse,
        StructJsonParser,
        StructSqlParser
    } from 'shared/data-source'
    import {
        messageSuccess,
        messageError
    } from '@/common/bkmagic'
    import renderHeader from '../common/header'
    import fieldTable from '../common/field-table'
    import infoTable from '../common/info-table.vue'
    import router from '@/router'
    import store from '@/store'

    export default defineComponent({
        components: {
            renderHeader,
            fieldTable,
            infoTable
        },

        setup () {
            const basicForm = ref(null)
            const tableStatus = useTableStatus({
                data: transformFieldObject2FieldArray(baseColumns)
            })

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            const submit = () => {
                basicForm.value.validate().then((basicInfo) => {
                    const projectId = router?.currentRoute?.params?.projectId
                    const dataTable = {
                        tableName: basicInfo.tableName,
                        comment: basicInfo.comment,
                        projectId,
                        columns: transformFieldArray2FieldObject(tableStatus.data)
                    }
                    // 基于用户创建的表格生成 sql
                    const table = {
                        tableName: basicInfo.tableName,
                        columns: tableStatus.data
                    }
                    const dataParse = new DataParse()
                    const structJsonParser = new StructJsonParser([table])
                    const structSqlParser = new StructSqlParser()
                    const sql = dataParse.import(structJsonParser).export(structSqlParser)
                    const record = {
                        projectId,
                        sql
                    }
                    const postData = {
                        dataTable,
                        record
                    }
                    tableStatus.isLoading = true
                    return store.dispatch('dataSource/add', postData).then(() => {
                        messageSuccess('新增表成功')
                        goBack()
                    })
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    tableStatus.isLoading = false
                })
            }

            return {
                basicForm,
                tableStatus,
                goBack,
                submit
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
