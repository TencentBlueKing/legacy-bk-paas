<template>
    <article v-bkloading="{ isLoading }">
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                编辑表【{{originTableStatus.basicInfo.tableName}}】
            </span>
        </render-header>

        <main class="table-main">
            <section class="table-section">
                <h5 class="section-title">基础信息</h5>
                <info-table ref="basicFormRef" :basic-info="originTableStatus.basicInfo" @change="changeEdit(true)"></info-table>
            </section>

            <section class="table-section">
                <h5 class="section-title">字段配置</h5>
                <field-table ref="fieldTableRef" :data="originTableStatus.data" @change="changeEdit(true)"></field-table>
            </section>

            <bk-button theme="primary" class="mr5" @click="submit" :loading="isSaving" :disabled="!hasEdit">提交</bk-button>
            <bk-button @click="goBack" :disabled="isSaving">取消</bk-button>
        </main>

        <confirm-dialog
            :is-show.sync="showConfirmDialog"
            :sql="sql"
            :is-loading="isSaving"
            @confirm="confirmSubmit"
        ></confirm-dialog>
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
        DataParse,
        StructJsonParser,
        StructSqlParser,
        transformFieldObject2FieldArray,
        transformFieldArray2FieldObject
    } from 'shared/data-source'
    import {
        messageSuccess,
        messageError
    } from '@/common/bkmagic'
    import {
        bkInfoBox
    } from 'bk-magic-vue'
    import renderHeader from '../common/header'
    import fieldTable from '../common/field-table'
    import infoTable from '../common/info-table.vue'
    import confirmDialog from '../common/confirm-dialog.vue'
    import router from '@/router'
    import store from '@/store'

    export default defineComponent({
        components: {
            renderHeader,
            fieldTable,
            infoTable,
            confirmDialog
        },

        beforeRouteLeave (to, from, next) {
            const confirmFn = () => next()
            const cancelFn = () => next(false)
            if (this.hasEdit) {
                bkInfoBox({
                    title: '确认离开当前页面？',
                    subTitle: '当前页面内容未保存，离开修改的内容将会丢失',
                    confirmFn,
                    cancelFn
                })
            } else {
                confirmFn()
            }
        },

        setup () {
            const {
                tableStatus: originTableStatus,
                sql,
                isLoading,
                isSaving,
                showConfirmDialog,
                hasEdit,
                basicFormRef,
                fieldTableRef
            } = useTableStatus()

            const {
                tableStatus: finalTableStatus
            } = useTableStatus()

            const id = router?.currentRoute?.query?.id

            const goBack = () => {
                router.push({ name: 'showTable', query: { id } })
            }

            const changeEdit = (val) => {
                hasEdit.value = val
            }

            const submit = () => {
                Promise.all([
                    basicFormRef.value.validate(),
                    fieldTableRef.value.validate()
                ]).then(([basicInfo, tableList]) => {
                    // 基于用户修改的表格生成 sql
                    const originTable = {
                        ...originTableStatus.basicInfo,
                        columns: originTableStatus.data,
                        id
                    }
                    const modifyTable = {
                        ...basicInfo,
                        columns: tableList,
                        id
                    }
                    const dataParse = new DataParse([originTable])
                    const structJsonParser = new StructJsonParser([modifyTable])
                    const structSqlParser = new StructSqlParser()
                    // 写入数据
                    sql.value = dataParse.import(structJsonParser).export(structSqlParser)
                    Object.assign(finalTableStatus.basicInfo, basicInfo)
                    finalTableStatus.data = tableList
                    showConfirmDialog.value = true
                }).catch((error) => {
                    messageError(error.message || error)
                })
            }

            const confirmSubmit = () => {
                const projectId = router?.currentRoute?.params?.projectId
                const dataTable = {
                    tableName: finalTableStatus.basicInfo.tableName,
                    comment: finalTableStatus.basicInfo.comment,
                    id,
                    projectId,
                    columns: transformFieldArray2FieldObject(finalTableStatus.data)
                }
                const record = {
                    projectId,
                    sql: sql.value,
                    tableId: id
                }
                const postData = {
                    dataTable,
                    record
                }
                isSaving.value = true
                return store.dispatch('dataSource/modifyOnlineDb', record).then(() => {
                    return store.dispatch('dataSource/edit', postData).then(() => {
                        messageSuccess('编辑表成功')
                        changeEdit(false)
                        goBack()
                    })
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    isSaving.value = false
                })
            }

            const getDetail = () => {
                isLoading.value = true
                store.dispatch('dataSource/findOne', id).then((data) => {
                    originTableStatus.basicInfo.tableName = data.tableName
                    originTableStatus.basicInfo.comment = data.comment
                    originTableStatus.data = transformFieldObject2FieldArray(data.columns)
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    isLoading.value = false
                })
            }

            onBeforeMount(getDetail)

            return {
                isSaving,
                isLoading,
                showConfirmDialog,
                sql,
                basicFormRef,
                fieldTableRef,
                originTableStatus,
                goBack,
                submit,
                confirmSubmit,
                changeEdit,
                hasEdit
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
