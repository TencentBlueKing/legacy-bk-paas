<template>
    <bk-table :outer-border="false" :data="columns">
        <bk-table-column label="字段名称" prop="name" show-overflow-tooltip></bk-table-column>
        <bk-table-column label="字段类型" prop="type"></bk-table-column>
        <bk-table-column label="主键" prop="primary" :formatter="boolFormatter"></bk-table-column>
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
