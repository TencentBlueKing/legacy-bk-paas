<template>
    <div class="data-page">
        <div class="operating-buttons">
            <bk-button
                v-for="(item, index) in operatingButtons"
                :key="index"
                class="btn-item"
                size="small">
                {{ item.name }}
            </bk-button>
            <bk-button
                icon="plus"
                size="small"
                @click="addOpBtn">
                {{ operatingButtons.length > 0 ? '' : '添加功能' }}
            </bk-button>
        </div>
        <div class="data-filter-area">
            <bk-form class="filters-form" form-type="vertical">
                <bk-form-item
                    v-for="(item, index) in filters"
                    :key="index"
                    style="width: 230px; margin-right: 16px;"
                    label="字段">
                    <bk-input size="small" />
                </bk-form-item>
                <div class="add-filter-btn">
                    <bk-button
                        icon="plus"
                        size="small"
                        @click="addFilterForm">
                        {{ filters.length > 0 ? '' : '筛选条件' }}
                    </bk-button>
                </div>
            </bk-form>
        </div>
        <div class="data-table-edit">
            <bk-table :data="tableConfig">
                <bk-table-column label="操作">
                    <i class="bk-icon icon-plus"></i>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'DataPage',
        data () {
            return {
                operatingButtons: [],
                filters: [],
                tableActions: [],
                tableConfig: [{}]
            }
        },
        methods: {
            addOpBtn () {
                this.operatingButtons.push({ name: '', type: '', id: '' })
            },
            addFilterForm () {
                this.filters.push({ name: '', type: '', id: '' })
            },
            addTableAction () {}
        }
    }
</script>
<style lang="postcss" scoped>
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
</style>
