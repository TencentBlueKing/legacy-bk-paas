<template>
    <article>
        <section class="table-section">
            <h5 class="section-title">基础信息</h5>
            <info-table :basic-info="activeTable" :is-edit="false"></info-table>
        </section>

        <section class="table-section">
            <h5 class="section-title">字段配置</h5>
            <show-column-table :columns="activeTable.columns"></show-column-table>
        </section>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType
    } from '@vue/composition-api'
    import infoTable from '../common/info-table.vue'
    import showColumnTable from '../common/show-column-table.vue'

    interface ITable {
        tableName: string,
        columns: any[]
    }

    export default defineComponent({
        components: {
            infoTable,
            showColumnTable
        },
        props: {
            activeTable: Object as PropType<ITable>
        }
    })
</script>

<style lang="postcss" scoped>
    .table-section {
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.1);
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
