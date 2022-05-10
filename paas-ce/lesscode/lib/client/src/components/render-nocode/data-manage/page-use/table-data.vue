<template>
    <div class="data-manage-table">
        <bk-table :data="tableData">
            <bk-table-column
                v-for="field in tableFields"
                :key="field.key"
                :prop="field.key">
                <template :slot-scope="{ row }">
                    <table-cell-value :field="field" :value="row"></table-cell-value>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <bk-button
                    v-for="(action, index) in config.innerActions"
                    :key="index"
                    :text="true">
                    {{ action.name }}
                </bk-button>
            </bk-table-column>
        </bk-table>
    </div>
</template>
<script>
    import tableCellValue from './table-cell-value.vue'

    export default {
        name: 'dataManageTable',
        components: {
            tableCellValue
        },
        props: {
            fields: {
                type: Object,
                default: () => ({})
            },
            config: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                dataLoading: false,
                tableFields: [],
                tableData: []
            }
        },
        watch: {
            config: {
                handler (val) {
                    const fields = []
                    val.fields.forEach(key => {
                        const field = this.field.find(item => item.key === key)
                        fields.push(field)
                    })
                    this.tableFields = fields
                },
                immediate: true
            }
        }
    }
</script>
