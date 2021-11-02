<template>
    <section class="table-list-home">
        <bk-alert
            class="table-list-tip"
            type="info"
            title="数据表设计完成后，需部署后才能在预发布环境和生产环境生效，上次部署时间：2021-02-20 12:12:14"
            closable
        ></bk-alert>

        <section class="table-list-btns">
            <bk-button theme="primary" class="table-list-btn" @click="goToDataDesign">新建表</bk-button>
            <bk-button class="table-list-btn" @click="bulkDelete" :disabled="listStatus.selectRows.length <= 0">批量删除</bk-button>
            <!-- <import-table title="导入表" class="table-list-btn"></import-table> -->
            <export-table
                title="导出表"
                class="table-list-btn"
                :disable-partial-selection="listStatus.selectRows.length <= 0"
                @download="exportTables"
            ></export-table>
            <bk-divider direction="vertical" class="table-list-divider"></bk-divider>
            <bk-button class="table-list-btn" @click="goToDataManage">数据管理</bk-button>
        </section>

        <bk-table
            v-bkloading="{ isLoading: listStatus.isTableLoading }"
            :data="listStatus.list"
            :pagination="listStatus.pagination"
            :outer-border="false"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange"
            @selection-change="selectionChange">
            <bk-table-column type="selection" width="60"></bk-table-column>
            <bk-table-column label="表名" prop="tableName" show-overflow-tooltip>
                <template slot-scope="props">
                    <bk-button class="mr10" theme="primary" text @click="goToDataDesign(props.row)">{{ props.row.tableName }}</bk-button>
                </template>
            </bk-table-column>
            <bk-table-column label="存储引擎" width="100">InnoDB</bk-table-column>
            <bk-table-column label="字符集" width="100">utf8mb4</bk-table-column>
            <bk-table-column label="备注" prop="summary" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="更新时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="正式环境部署时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="预发布环境部署时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="操作" width="220">
                <template slot-scope="props">
                    <bk-button class="mr10" theme="primary" text @click="goToDataDesign(props.row)">表结构设计</bk-button>
                    <bk-button class="mr10" theme="primary" text @click="goToDataManage(props.row)">数据管理</bk-button>
                    <bk-button class="mr10" theme="primary" text @click="deleteTable([props.row])">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table>

        <confirm-dialog
            :is-show.sync="listStatus.showConfirmDialog"
            :sql="listStatus.sql"
            :is-loading="listStatus.isSaving"
            @confirm="confirmDelete"
        ></confirm-dialog>
    </section>
</template>

<script lang="ts">
    import store from '@/store'
    import router from '@/router'
    import { messageError } from '@/common/bkmagic'
    import { defineComponent, onBeforeMount, reactive } from '@vue/composition-api'
    import dayjs from 'dayjs'
    // import importTable from '../../../common/import.vue'
    import exportTable from '../../../common/export.vue'
    import confirmDialog from '../../../common/confirm-dialog.vue'
    import {
        DataParse,
        StructJsonParser,
        StructSqlParser,
        generateExportStruct,
        transformFieldObject2FieldArray
    } from 'shared/data-source'
    import {
        downloadFile
    } from '@/common/util.js'

    interface IPagination {
        current: number,
        count: number,
        limit: number
    }

    interface IListStatus {
        pagination: IPagination
        list: any[],
        isTableLoading: boolean,
        isSaving: boolean,
        showConfirmDialog: boolean,
        sql: string,
        deleteData: object,
        selectRows: any[]
    }

    export default defineComponent({
        components: {
            exportTable,
            confirmDialog
        },

        setup () {
            const projectId = router?.currentRoute?.params?.projectId
            const listStatus = reactive<IListStatus>({
                pagination: { current: 1, count: 0, limit: 10 },
                list: [],
                isTableLoading: false,
                isSaving: false,
                showConfirmDialog: false,
                sql: '',
                deleteData: {},
                selectRows: []
            })

            const selectionChange = (selections) => {
                listStatus.selectRows = selections
            }

            const handlePageChange = (newPage) => {
                listStatus.pagination.current = newPage
                getTableList()
            }

            const handlePageLimitChange = (limit) => {
                listStatus.pagination.limit = limit
                getTableList()
            }

            const getTableList = () => {
                listStatus.isTableLoading = true
                const params = {
                    projectId,
                    pageSize: listStatus.pagination.limit,
                    page: listStatus.pagination.current
                }
                return store.dispatch('dataSource/list', params).then((res) => {
                    listStatus.list = res.list
                    listStatus.pagination.count = res.count
                }).catch((err) => {
                    messageError(err.message || err)
                }).finally(() => {
                    listStatus.isTableLoading = false
                })
            }

            const timeFormatter = (obj, con, val) => {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            }

            const goToDataDesign = (row) => {
                if (row.id) {
                    router.push({
                        name: 'showTable',
                        query: {
                            id: row.id
                        }
                    })
                } else {
                    router.push({
                        name: 'createTable'
                    })
                }
            }

            const goToDataManage = (row) => {
                router.push({
                    name: 'dataManage',
                    query: {
                        tableName: row?.tableName
                    }
                })
            }

            const bulkDelete = () => {
                deleteTable(listStatus.selectRows)
            }

            const deleteTable = (rows) => {
                const ids = []
                const records = []
                rows.forEach((row) => {
                    const table = {
                        tableName: row.tableName
                    }
                    const dataParse = new DataParse([table])
                    const structJsonParser = new StructJsonParser()
                    const structSqlParser = new StructSqlParser()
                    const record = {
                        projectId,
                        sql: dataParse.set(structJsonParser).export(structSqlParser),
                        tableId: row.id
                    }
                    records.push(record)
                    ids.push(row.id)
                })

                listStatus.sql = records.map(x => x.sql).join('\n')
                listStatus.showConfirmDialog = true
                listStatus.deleteData = { ids, records }
            }

            const confirmDelete = () => {
                listStatus.isSaving = true
                const execPerviewSql = {
                    projectId,
                    sql: listStatus.sql
                }
                return store.dispatch('dataSource/modifyOnlineDb', execPerviewSql).then(() => {
                    return store.dispatch('dataSource/delete', listStatus.deleteData).then(() => {
                        listStatus.showConfirmDialog = false
                        getTableList()
                    })
                }).catch((err) => {
                    messageError(err.message || err)
                }).finally(() => {
                    listStatus.isSaving = false
                })
            }

            const exportAllTables = (fileType) => {
                window.open(`/api/data-source/exportStruct/projectId/${projectId}/fileType/${fileType}`)
            }

            const exportSelectTables = (fileType) => {
                const tables = listStatus.selectRows.map((selectRow) => {
                    return {
                        ...selectRow,
                        columns: transformFieldObject2FieldArray(selectRow.columns)
                    }
                })
                const fileName = fileType === 'sql' ? `lesscode-struct-${projectId}.sql` : ''
                const files = generateExportStruct(tables, fileType, fileName)
                files.forEach(({ name, content }) => {
                    downloadFile(content, name)
                })
            }

            const exportTables = (fileType, downloadType) => {
                if (downloadType === 'all') {
                    exportAllTables(fileType)
                } else {
                    exportSelectTables(fileType)
                }
            }

            onBeforeMount(getTableList)

            return {
                listStatus,
                handlePageChange,
                handlePageLimitChange,
                selectionChange,
                timeFormatter,
                goToDataDesign,
                goToDataManage,
                bulkDelete,
                deleteTable,
                confirmDelete,
                exportTables
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .table-list-home {
        padding: 16px 24px;
    }
    .table-list-tip {
        margin-bottom: 16px;
    }
    .table-list-btns {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .table-list-btn {
            margin-right: 8px;
        }
        .table-list-divider {
            margin: 0 10px 0 2px !important;
        }
    }
</style>
