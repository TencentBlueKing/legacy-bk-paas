<template>
    <article>
        <bk-alert type="warning" title="数据的增删会直接影响到线上环境，请谨慎操作"></bk-alert>

        <section class="render-data-header">
            <bk-button theme="primary" class="mr5" @click="addData">新增</bk-button>
            <bk-button
                class="mr5"
                :disabled="dataStatus.selectRows.length <= 0"
                @click="bulkDelete"
            >批量删除</bk-button>
            <bk-button>导出</bk-button>
        </section>

        <bk-table
            v-bkloading="{ isLoading: dataStatus.isLoading }"
            :outer-border="false"
            :data="dataStatus.dataList"
            :pagination="dataStatus.pagination"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange"
            @selection-change="selectionChange"
        >
            <bk-table-column
                type="selection"
                width="60"
            ></bk-table-column>
            <bk-table-column
                v-for="column in activeTable.columns"
                :key="column.name"
                :label="column.name"
                :prop="column.name"
                :formatter="columnFormatter(column.type)"
                show-overflow-tooltip
            ></bk-table-column>
            <bk-table-column label="操作" width="180">
                <template slot-scope="props">
                    <bk-button text @click="editData(props.row)" class="mr5">编辑</bk-button>
                    <bk-button text @click="deleteData([props.row])">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table>

        <bk-sideslider
            :is-show.sync="formStatus.showEditData"
            :width="640"
            :title="formStatus.editTitle"
        >
            <div slot="content">
                <bk-form
                    class="edit-data-form"
                    :model="formStatus.editForm"
                    :label-width="120"
                >
                    <bk-form-item
                        v-for="column in activeTable.columns"
                        :key="column.name"
                        :label="column.name"
                        :required="!column.nullable"
                    >
                        <bk-date-picker
                            v-if="column.type === 'datetime'"
                            type="datetime"
                            style="width:100%"
                            :value="formStatus.editForm[column.name]"
                            @change="changeDateTime(column.name, ...arguments)"
                        ></bk-date-picker>
                        <bk-input
                            v-else-if="column.type === 'int'"
                            v-model="formStatus.editForm[column.name]"
                            type="number"
                        ></bk-input>
                        <bk-input
                            v-else
                            v-model="formStatus.editForm[column.name]"
                        ></bk-input>
                    </bk-form-item>
                    <bk-form-item>
                        <bk-button
                            theme="primary"
                            class="mr5"
                            :loading="formStatus.isSaving"
                            @click="confirmSubmitData"
                        >提交</bk-button>
                        <bk-button
                            :disabled="formStatus.isSaving"
                            @click="closeForm"
                        >取消</bk-button>
                    </bk-form-item>
                </bk-form>
            </div>
        </bk-sideslider>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        onBeforeMount,
        watch,
        toRefs,
        PropType,
        reactive
    } from '@vue/composition-api'
    import vue from 'vue'
    import {
        messageError
    } from '@/common/bkmagic'
    import router from '@/router'
    import store from '@/store'
    import dayjs from 'dayjs'
    import {
        DataParse,
        DataJsonParser,
        DataSqlParser
    } from 'shared/data-source'

    interface ITable {
        tableName: string,
        columns: any[]
    }

    interface IProps {
        environment?: string,
        activeTable?: ITable
    }

    interface IDataParse {
        import?: (object) => IDataParse,
        set?: (object) => IDataParse,
        export?: (object) => string
    }

    interface IFormStatus {
        showEditData: boolean,
        editTitle: string,
        editForm: any,
        isSaving: boolean,
        dataParse: IDataParse
    }

    export default defineComponent({
        props: {
            environment: String,
            activeTable: Object as PropType<ITable>
        },

        setup (props) {
            const projectId = router?.currentRoute?.params?.projectId
            const { environment, activeTable } = toRefs<IProps>(props)
            const dataStatus = reactive({
                dataList: [],
                selectRows: [],
                pagination: { current: 1, count: 0, limit: 10 },
                isLoading: false
            })
            const formStatus = reactive<IFormStatus>({
                showEditData: false,
                editTitle: '',
                editForm: {},
                dataParse: {},
                isSaving: false
            })

            const selectionChange = (selections) => {
                dataStatus.selectRows = selections
            }

            const handlePageChange = (newPage) => {
                dataStatus.pagination.current = newPage
                getDataList()
            }

            const handlePageLimitChange = (limit) => {
                dataStatus.pagination.limit = limit
                getDataList()
            }

            const normalizeData = (data) => {
                const dateTimeColumns = activeTable.value.columns?.filter((column) => (column.type === 'datetime'))
                dateTimeColumns.forEach((dateTimeColumn) => {
                    data[dateTimeColumn.name] = timeFormatter(data[dateTimeColumn.name])
                })
                return data
            }

            const getDataList = () => {
                const queryData = {
                    projectId,
                    environment: environment.value,
                    tableName: activeTable.value.tableName,
                    page: dataStatus.pagination.current,
                    pageSize: dataStatus.pagination.limit
                }
                dataStatus.isLoading = true
                return store.dispatch('dataSource/getOnlineTableDatas', queryData).then((res) => {
                    dataStatus.dataList = res.list?.map(normalizeData)
                    dataStatus.pagination.count = res.count
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    dataStatus.isLoading = false
                })
            }

            const timeFormatter = (val) => {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''
            }

            const columnFormatter = (type) => {
                return (obj, con, val) => {
                    const getValue = () => {
                        return type === 'datetime' ? timeFormatter(val) : val
                    }
                    return ![null, undefined, ''].includes(val) ? getValue() : '--'
                }
            }

            // date-pick 手动格式化
            const changeDateTime = (propName, date) => {
                formStatus.editForm[propName] = timeFormatter(date)
            }

            const closeForm = () => {
                formStatus.showEditData = false
                formStatus.editForm = {}
                formStatus.dataParse = {}
            }

            const addData = () => {
                formStatus.showEditData = true
                formStatus.editTitle = '新增数据'
                formStatus.editForm = {}
                formStatus.dataParse = new DataParse()
            }

            const editData = (row) => {
                const data = [{ tableName: activeTable.value.tableName, list: [row] }]
                formStatus.showEditData = true
                formStatus.editTitle = '编辑数据'
                formStatus.dataParse = new DataParse(data)
                Object.keys(row).forEach((key) => {
                    vue.set(formStatus.editForm, key, row[key])
                })
            }

            const confirmSubmitData = () => {
                const data = [{ tableName: activeTable.value.tableName, list: [formStatus.editForm] }]
                const dataJsonParser = new DataJsonParser(data)
                const dataSqlParser = new DataSqlParser()
                const sql = formStatus.dataParse.set(dataJsonParser).export(dataSqlParser)
                formStatus.isSaving = true
                modifyOnlineDb(sql).then(() => {
                    closeForm()
                    return getDataList()
                }).finally(() => {
                    formStatus.isSaving = false
                })
            }

            const bulkDelete = () => {
                deleteData(dataStatus.selectRows)
            }

            const deleteData = (list) => {
                const data = [{ tableName: activeTable.value.tableName, list }]
                const dataParse = new DataParse(data)
                const dataJsonParser = new DataJsonParser()
                const dataSqlParser = new DataSqlParser()
                const sql = dataParse.set(dataJsonParser).export(dataSqlParser)
                dataStatus.isLoading = true
                modifyOnlineDb(sql).then(() => {
                    closeForm()
                    return getDataList()
                }).finally(() => {
                    dataStatus.isLoading = false
                })
            }

            const modifyOnlineDb = (sql) => {
                const apiData = { environment: environment.value, projectId, sql }
                return store.dispatch('dataSource/modifyOnlineDb', apiData).catch((error) => {
                    messageError(error.message || error)
                })
            }

            watch(
                [environment, activeTable],
                () => {
                    dataStatus.pagination.current = 1
                    getDataList()
                }
            )

            onBeforeMount(getDataList)

            return {
                dataStatus,
                formStatus,
                columnFormatter,
                timeFormatter,
                changeDateTime,
                selectionChange,
                handlePageChange,
                handlePageLimitChange,
                closeForm,
                addData,
                editData,
                confirmSubmitData,
                bulkDelete,
                deleteData
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .render-data-header {
        margin: 16px 0;
    }
    .edit-data-form {
        padding: 25px 40px 25px 10px;
        height: calc(100vh - 60px);
    }
</style>
