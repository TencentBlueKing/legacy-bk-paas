<template>
    <bk-table
        class="g-hairless-table"
        :header-border="false"
        :header-cell-style="{ background: '#f0f1f5' }"
        :outer-border="false"
        :data="columns"
    >
        <bk-table-column label="字段名称" prop="name" show-overflow-tooltip></bk-table-column>
        <bk-table-column label="字段类型" prop="type"></bk-table-column>
        <bk-table-column label="主键" prop="primary" :formatter="boolFormatter"></bk-table-column>
        <bk-table-column label="长度" prop="length"></bk-table-column>
        <bk-table-column label="小数点" prop="scale"></bk-table-column>
        <bk-table-column label="索引" prop="index" :formatter="boolFormatter"></bk-table-column>
        <bk-table-column label="可空" prop="nullable" :formatter="boolFormatter"></bk-table-column>
        <bk-table-column label="默认值" prop="default" show-overflow-tooltip></bk-table-column>
        <bk-table-column label="备注" prop="comment" show-overflow-tooltip></bk-table-column>
    </bk-table>
</template>

<script lang="ts">
    import {
        defineComponent
    } from '@vue/composition-api'

    export default defineComponent({
        props: {
            columns: Array
        },

        setup () {
            const boolFormatter = (row, column, cellValue, index) => {
                const valMap = {
                    true: '是'
                }
                return valMap[cellValue] || '否'
            }
            return {
                boolFormatter
            }
        }
    })
</script>
