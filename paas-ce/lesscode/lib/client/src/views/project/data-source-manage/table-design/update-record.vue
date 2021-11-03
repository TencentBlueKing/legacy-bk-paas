<template>
    <article>
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                表变更记录
            </span>
        </render-header>

        <main class="table-main">
            <bk-date-picker
                class="mr10 filter-item"
                placeholder="选择日期范围"
                type="daterange"
                v-model="recordStatus.timeRange"
                @change="getRecordList"
            ></bk-date-picker>
            <bk-input
                clearable
                class="filter-item"
                placeholder="输入执行人员"
                right-icon="bk-icon icon-search"
                v-model="recordStatus.createUser"
                @change="getRecordList"
            ></bk-input>

            <bk-table
                class="record-table"
                v-bkloading="{ isLoading: recordStatus.isLoading }"
                :outer-border="false"
                :data="recordStatus.list"
            >
                <bk-table-column label="变更时间" prop="createTime" show-overflow-tooltip :formatter="timeFormatter"></bk-table-column>
                <bk-table-column label="执行人员" prop="createUser"></bk-table-column>
                <bk-table-column label="变更内容" prop="sql" show-overflow-tooltip>
                    <template slot-scope="props">
                        <bk-button :text="true" title="primary" @click="showSql(props.row.sql)">查看</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </main>

        <confirm-dialog
            :is-show.sync="recordStatus.showConfirmDialog"
            :sql="recordStatus.sql"
        ></confirm-dialog>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        onBeforeMount,
        reactive
    } from '@vue/composition-api'
    import {
        messageError
    } from '@/common/bkmagic'
    import router from '@/router'
    import store from '@/store'
    import dayjs from 'dayjs'
    import renderHeader from '../common/header'
    import confirmDialog from '../common/confirm-dialog.vue'

    export default defineComponent({
        components: {
            renderHeader,
            confirmDialog
        },

        setup () {
            const recordStatus = reactive({
                list: [],
                isLoading: false,
                timeRange: [],
                createUser: '',
                showConfirmDialog: false,
                sql: ''
            })
            const id = router?.currentRoute?.query?.id

            const goBack = () => {
                router.push({ name: 'showTable', query: { id } })
            }

            const timeFormatter = (obj, con, val) => {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            }

            const showSql = (sql) => {
                recordStatus.showConfirmDialog = true
                recordStatus.sql = sql
            }

            const getRecordList = () => {
                recordStatus.isLoading = true
                const filterData = {
                    id,
                    timeRange: recordStatus.timeRange,
                    createUser: recordStatus.createUser
                }
                store.dispatch('dataSource/tableRecordList', filterData).then((data) => {
                    recordStatus.list = data
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    recordStatus.isLoading = false
                })
            }

            onBeforeMount(getRecordList)

            return {
                recordStatus,
                goBack,
                timeFormatter,
                showSql,
                getRecordList
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
        .filter-item {
            width: 400px;
        }
        .record-table {
            margin-top: 16px;
        }
    }
</style>
