<template>
    <div
        v-hover="{ type: 'page', deletable: false, click: handleCompClick }"
        class="data-manage-content">
        <div class="operating-buttons">
            <bk-button
                v-for="(item, index) in operatingButtons"
                v-hover="{ type: 'operatingBtn', index, click: handleCompClick, delete: handleCompDel }"
                :key="index"
                class="btn-item"
                size="small">
                {{ item.name }}
            </bk-button>
            <bk-button
                icon="plus"
                size="small"
                @click.stop="addOpBtn">
                {{ operatingButtons.length > 0 ? '' : '添加功能' }}
            </bk-button>
        </div>
        <div class="data-filter-area">
            <bk-form class="filters-form" form-type="vertical">
                <bk-form-item
                    v-for="(item, index) in filters"
                    v-hover="{ type: 'filters', index, click: handleCompClick, delete: handleCompDel }"
                    :key="index"
                    style="width: 230px; margin-right: 16px;"
                    label="字段">
                    <bk-input size="small" style="pointer-events: none;" />
                </bk-form-item>
                <div class="add-filter-btn">
                    <bk-button
                        icon="plus"
                        size="small"
                        @click.stop="addFilterForm">
                        {{ filters.length > 0 ? '' : '筛选条件' }}
                    </bk-button>
                </div>
            </bk-form>
        </div>
        <div class="data-table-edit">
            <bk-table :data="tableConfig">
                <bk-table-column label="操作">
                    <template slot-scope="prop">
                        <div class="table-actions-wrapper">
                            <bk-button
                                v-for="(item, index) in prop.row.innerActions"
                                v-hover="{ type: 'tableAction', index, click: handleCompClick, delete: handleCompDel }"
                                class="table-action-btn"
                                size="small"
                                :key="index"
                                :text="true">
                                {{ item.name }}
                            </bk-button>
                            <i class="bk-icon icon-plus add-action-btn" @click.stop="addTableAction"></i>
                        </div>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
        <!-- <page-element-operate :hover="hoverData" :active="selectedData"></page-element-operate> -->
    </div>
</template>
<script>
    import hoverDiretive from './hover-directive.js'

    export default {
        name: 'DataPage',
        directives: {
            hover: hoverDiretive
        },
        data () {
            return {
                pageActive: false,
                operatingButtons: [],
                filters: [],
                tableConfig: [{ innerActions: [] }],
                hoverComp: {
                    el: null,
                    data: {}
                }
            }
        },
        methods: {
            addOpBtn () {
                this.operatingButtons.push({ name: '默认', type: '', id: '' })
            },
            addFilterForm () {
                this.filters.push({ name: '', type: '', id: '' })
            },
            addTableAction () {
                this.tableConfig[0].innerActions.push({ name: '默认', type: '' })
            },
            handleCompClick (data) {
                console.log('click', data)
            },
            handleCompDel (data) {
                console.log('delete', data)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .data-manage-content {
        padding: 24px;
        height: 100%;
        background: #ffffff;
    }
    .operating-buttons {
        display: flex;
        flex-wrap: wrap;
        .btn-item {
            margin-right: 8px;
            margin-bottom: 8px;
        }
    }
    .data-filter-area {
        margin-bottom: 16px;
        padding: 16px;
        min-height: 120px;
        background: #f5f7fa;
        .filters-form {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-end;
            >>> .bk-form-item {
                margin-top: 0;
            }
            .add-filter-btn {
                display: flex;
                align-items: flex-end;
            }
        }
    }
    .table-actions-wrapper {
        display: flex;
        align-items: center;
        .table-action-btn {}
        .add-action-btn {
            font-size: 20px;
            cursor: pointer;
            &:hover {
                color: #3a84ff;
            }
        }
    }
</style>
