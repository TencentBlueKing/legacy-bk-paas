<template>
    <article v-bkloading="{ isLoading: pageStatus.isLoading }">
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
                :class="{ active: pageStatus.activeEnvironment.key === environment.key, 'tab-item': true }"
                @click="setEnvironment(environment)"
            >{{ environment.name }}</div>
        </div>

        <template v-if="!pageStatus.isLoading">
            <layout class="data-manage-main" v-if="!pageStatus.errorCode">
                <aside class="table-list" slot="left">
                    <bk-input
                        clearable
                        class="filter-table-name"
                        placeholder="请输入表名"
                        right-icon="bk-icon icon-search"
                        v-model="pageStatus.tableName"
                    ></bk-input>

                    <ul class="table-item-list" v-if="displayTableList.length">
                        <li
                            @click="setActiveTable(item)"
                            v-for="item in displayTableList"
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
                        </li>
                    </ul>
                    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part" v-else>
                        <div>暂无搜索结果</div>
                    </bk-exception>
                </aside>
                <bk-tab class="data-main">
                    <bk-tab-panel
                        v-for="(panel, index) in panels"
                        v-bind="panel"
                        :key="index">
                        <component
                            :is="panel.name"
                            :environment="pageStatus.activeEnvironment.key"
                            :active-table="pageStatus.activeTable"
                        ></component>
                    </bk-tab-panel>
                </bk-tab>
            </layout>
            <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part" v-else>
                <div v-if="!pageStatus.tableList.length">
                    {{ pageStatus.activeEnvironment.name }}未查询到表，无法进行数据管理，请修改数据库后再试
                </div>
            </bk-exception>
        </template>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        reactive,
        computed,
        watch
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
    import layout from '@/components/ui/layout.vue'

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
            renderApi,
            layout
        },

        setup () {
            const projectId = router?.currentRoute?.params?.projectId
            const tableName = router?.currentRoute?.query?.tableName
            const pageStatus = reactive({
                activeEnvironment: { key: 'preview', name: '预览环境' },
                isLoading: false,
                tableName: '',
                activeTable: {
                    tableName: '',
                    comment: '',
                    columns: []
                },
                tableList: [],
                errorCode: ''
            })

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            const setEnvironment = (val) => {
                pageStatus.activeEnvironment = val
            }

            const setActiveTable = (item = pageStatus.tableList[0]) => {
                pageStatus.activeTable = item
            }

            const getTableList = () => {
                pageStatus.isLoading = true
                const queryData = {
                    environment: pageStatus.activeEnvironment?.key,
                    projectId
                }
                store.dispatch('dataSource/getOnlineTableList', queryData).then((data) => {
                    pageStatus.tableList = data || []
                    const activeTable = data.find(x => x.tableName === tableName)
                    setActiveTable(activeTable)
                }).catch((error) => {
                    // 清除数据
                    pageStatus.tableList = []
                    setActiveTable()
                    messageError(error.message || error)
                }).finally(() => {
                    pageStatus.errorCode = pageStatus.tableList.length <= 0 ? 'NO_DATA' : ''
                    pageStatus.isLoading = false
                })
            }

            const displayTableList = computed(() => {
                return pageStatus.tableList.filter((table) => {
                    return table.tableName.includes(pageStatus.tableName)
                })
            })

            watch(
                pageStatus.activeEnvironment,
                getTableList,
                {
                    immediate: true
                }
            )

            return {
                environmentList,
                panels,
                pageStatus,
                displayTableList,
                goBack,
                setEnvironment,
                setActiveTable
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
        height: calc(100vh - 160px);
        z-index: auto;
        .table-list {
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
            height: 100%;
            ::v-deep .bk-tab-section {
                padding: 16px 15px;
                height: calc(100% - 50px);
                overflow-y: auto;
                background-color: #fff;
            }
        }
    }
    .exception-wrap-item {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
    }
</style>
