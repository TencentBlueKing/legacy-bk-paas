<template>
    <section class="table-list-home">
        <bk-alert
            class="table-list-tip"
            type="info"
            title="数据表设计完成后，需部署后才能在预发布环境和生产环境生效，上次部署时间：2021-02-20 12:12:14"
            closable
        ></bk-alert>

        <section class="table-list-btns">
            <bk-button theme="primary" class="table-list-btn">新建表</bk-button>
            <bk-button class="table-list-btn">批量删除</bk-button>
            <import-table title="导入表" class="table-list-btn"></import-table>
            <export-table title="导出表" class="table-list-btn"></export-table>
            <bk-divider direction="vertical" class="table-list-divider"></bk-divider>
            <bk-button class="table-list-btn">数据管理</bk-button>
            <bk-button class="table-list-btn">数据源部署记录</bk-button>
        </section>
        <field-table :data="data" :column="column" :is-show-check="true" />
        <!-- <bk-table
            v-bkloading="{ isLoading: listStates.isTableLoading }"
            :data="listStates.list"
            :pagination="listStates.pagination"
            :outer-border="false"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange">
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
                    <bk-button class="mr10" theme="primary" text @click="deleteTable(props.row)">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table> -->
    </section>
</template>

<script lang="ts">
    import store from '@/store'
    import router from '@/router'
    import { messageError } from '@/common/bkmagic'
    import { defineComponent, onBeforeMount, reactive } from '@vue/composition-api'
    import dayjs from 'dayjs'
    import importTable from '../../../common/import.vue'
    import exportTable from '../../../common/export.vue'
    import fieldTable from '../../../common/field-table/field-table'

    // const { Parser } = require('node-sql-parser')
    // const parser = new Parser()

    interface IPagination {
        current: number,
        count: number,
        limit: number
    }

    interface IListStates {
        pagination: IPagination
        list: any[],
        isTableLoading: boolean
    }

    export default defineComponent({
        components: {
            importTable,
            exportTable,
            fieldTable
        },

        setup () {
            const column = [
                {
                    name: '字段名',
                    type: 'input',
                    prop: 'fieldAlias'
                },
                {
                    name: '字段类型',
                    type: 'select',
                    prop: 'fieldType',
                    optionsList: [{
                        id: 'timestamp',
                        name: 'timestamp'
                    }, {
                        id: 'string',
                        name: 'string'
                    }, {
                        id: 'int',
                        name: 'int'
                    }]
                },
                {
                    name: '字段映射',
                    type: 'input',
                    prop: 'mapping'
                },
                {
                    name: '索引',
                    type: 'checkbox',
                    prop: 'active'
                },
                {
                    name: '可空',
                    type: 'checkbox',
                    prop: 'active'
                }
            ]
            const data = [
                {
                    fieldType: 'timestamp',
                    fieldAlias: '时间戳',
                    fieldName: 'timestamp',
                    mapping: '测试样本集 / timestamp（时间戳）',
                    active: true
                },
                {
                    fieldType: 'string',
                    fieldAlias: '字符串',
                    fieldName: 'string',
                    mapping: '测试样本集 / timestamp（时间戳）',
                    active: false
                },
                {
                    fieldType: 'int',
                    fieldAlias: '数字',
                    fieldName: 'int',
                    mapping: '测试样本集 / timestamp（时间戳）',
                    active: true
                }
            ]
            const listStates = reactive<IListStates>({
                pagination: { current: 1, count: 0, limit: 10 },
                list: [],
                isTableLoading: false
            })

            const handlePageChange = (newPage) => {
                listStates.pagination.current = newPage
                getTableList()
            }

            const handlePageLimitChange = (limit) => {
                listStates.pagination.limit = limit
                getTableList()
            }

            const getTableList = () => {
                listStates.isTableLoading = true
                const params = {
                    projectId: router?.currentRoute?.params?.projectId,
                    pageSize: listStates.pagination.limit,
                    page: listStates.pagination.current
                }
                store.dispatch('dataSource/list', params).then((list) => {
                    listStates.list = list
                    listStates.pagination.count = list.length
                }).catch((err) => {
                    messageError(err.message || err)
                }).finally(() => {
                    listStates.isTableLoading = false
                })
            }

            const timeFormatter = (obj, con, val) => {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            }

            const goToDataDesign = () => {
                // console.log(parser)
                // console.log(parser.astify(`
                //     CREATE TABLE comp  (
                //         updateTime datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
                //     );
                // `))
            }

            const goToDataManage = () => {

            }

            const deleteTable = () => {

            }

            onBeforeMount(getTableList)

            return {
                listStates,
                handlePageChange,
                handlePageLimitChange,
                timeFormatter,
                goToDataDesign,
                goToDataManage,
                deleteTable,
                data,
                column
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
