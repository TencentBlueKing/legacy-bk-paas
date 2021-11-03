<template>
    <article>
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                数据管理
            </span>
        </render-header>
        <div class="g-page-tab">
            <div
                v-for="environment in environmentList"
                :key="environment.key"
                :class="{ active: pageStatus.activeEnvironment === environment.key, 'tab-item': true }"
                @click="setEnvironment(environment.key)"
            >{{ environment.name }}</div>
        </div>

        <main class="data-manage-main" v-bkloading="{ isLoading: pageStatus.isLoading }">
            <aside class="table-list">
                <bk-input
                    clearable
                    class="filter-table-name"
                    placeholder="请输入表名"
                    right-icon="bk-icon icon-search"
                    v-model="pageStatus.tableName"
                    @change="getTableList"
                ></bk-input>

                <ul class="table-item-list">
                    <li
                        @click="setActiveTable(item)"
                        v-for="item in pageStatus.tableList"
                        :key="item.tableName"
                        :class="{
                            active: item.tableName === pageStatus.activeTable.tableName,
                            'table-item': true
                        }"
                    >
                        <span class="table-item-name">
                            <i class="bk-drag-icon bk-drag-data-table"></i>
                            {{ item.tableName }}
                        </span>
                        <span class="table-item-num">{{ item.columns.length }}</span>
                    </li>
                </ul>
            </aside>

            <bk-tab class="data-main">
                <bk-tab-panel
                    v-for="(panel, index) in panels"
                    v-bind="panel"
                    :key="index">
                    <component
                        v-if="!pageStatus.isLoading"
                        :is="panel.name"
                        :environment="pageStatus.activeEnvironment"
                        :active-table="pageStatus.activeTable"
                    ></component>
                </bk-tab-panel>
            </bk-tab>
        </main>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        reactive,
        onBeforeMount
    } from '@vue/composition-api'
    import {
        messageError
    } from '@/common/bkmagic'
    import router from '@/router'
    import store from '@/store'
    import renderHeader from '../common/header'
    import renderData from './render-data.vue'
    import renderStruct from './render-struct.vue'
    import renderFunction from './render-function.vue'
    import renderApi from './render-api.vue'

    const environmentList = [
        { key: 'preview', name: '预览环境' }
    ]

    const panels = [
        { name: 'render-data', label: '数据', count: 10 },
        { name: 'render-struct', label: '表结构', count: 20 },
        { name: 'render-function', label: '函数示例', count: 30 },
        { name: 'render-api', label: 'API', count: 40 }
    ]

    export default defineComponent({
        components: {
            renderHeader,
            renderData,
            renderStruct,
            renderFunction,
            renderApi
        },

        setup () {
            const projectId = router?.currentRoute?.params?.projectId
            const tableName = router?.currentRoute?.query?.tableName
            const pageStatus = reactive({
                activeEnvironment: 'preview',
                isLoading: false,
                tableName: '',
                activeTable: {
                    tableName: '',
                    comment: '',
                    columns: []
                },
                tableList: []
            })

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            const setEnvironment = (val) => {
                pageStatus.activeEnvironment = val
            }

            const setActiveTable = (item) => {
                pageStatus.activeTable = item || pageStatus.tableList[0]
            }

            const getTableList = () => {
                pageStatus.isLoading = true
                const queryData = {
                    environment: pageStatus.activeEnvironment,
                    projectId
                }
                store.dispatch('dataSource/getOnlineTableList', queryData).then((data) => {
                    pageStatus.tableList = data
                    const activeTable = data.find(x => x.tableName === tableName)
                    setActiveTable(activeTable)
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    pageStatus.isLoading = false
                })
            }

            onBeforeMount(getTableList)

            return {
                environmentList,
                panels,
                pageStatus,
                goBack,
                setEnvironment,
                setActiveTable,
                getTableList
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
    .data-manage-main {
        display: flex;
        height: calc(100% - 96px);
        .table-list {
            width: 336px;
            padding: 14px 0;
            background: #fafbfd;
            height: 100%;
            overflow-y: auto;
            .filter-table-name {
                padding: 0 15px;
                ::v-deep .right-icon {
                    right: 25px !important;
                }
            }
            .table-item-list {
                margin-top: 9px;
            }
            .table-item {
                padding: 0 15px;
                height: 40px;
                line-height: 19px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                cursor: pointer;
                &.active {
                    background: #e1ecff;
                    color: #3a84ff;
                    .table-item-num {
                        background: #a3c5fd;
                        color: #ffffff;
                    }
                }
            }
            .table-item-name {
                line-height: 19px;
                flex: 1;
                max-width: 250px;
                .bk-drag-data-table {
                    margin-right: 3px;
                    font-size: 16px;
                }
            }
            .table-item-num {
                height: 20px;
                padding: 0 7px;
                background: #f0f1f5;
                font-size: 12px;
                color: #979ba5;
                border-radius: 2px;
            }
        }
        .data-main {
            flex: 1;
            ::v-deep .bk-tab-section {
                padding: 16px 15px;
                height: calc(100% - 50px);
                overflow-y: auto;
                background-color: #fff;
            }
        }
    }
</style>
