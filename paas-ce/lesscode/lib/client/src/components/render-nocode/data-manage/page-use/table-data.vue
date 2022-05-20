<template>
    <div class="data-manage-table">
        <bk-table :data="tableData">
            <bk-table-column
                v-for="field in tableFields"
                :key="field.key"
                :label="field.name"
                :prop="field.key">
                <template slot-scope="{ row }">
                    <table-cell-value :field="field" :value="row"></table-cell-value>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="{ row }">
                    <table-action-group @click="(action) => handleClick(row,action)" />
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>
<script>
    import tableCellValue from './table-cell-value.vue'
    import tableActionGroup from '../page-edit/tableActionGroup'
    import mockData from '../../common/mockFormData.json'

    export default {
        name: 'dataManageTable',
        components: {
            tableCellValue,
            tableActionGroup
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
                tableFields: mockData,
                tableData: [{
                    'id': '1',
                    'dan_xing_wen_ben': 'code',
                    'Uc19bcd5b4a04f1bb6a868184ebbc45b': '吃饭',
                    'dan_xuan_xia_la_kuang': 'XUANXIANG1',
                    'dfd5ddc9dd17423fae2755fb00071bb0': '111212',
                    'duo_xuan_xia_la_kuang': 'XUANXIANG1,XUANXIANG2',
                    'ri_qi': '2021-05-20'
                }]
            }
        },
        watch: {
            // config: {
            //     handler (val) {
            //         const fields = []
            //         val.fields.forEach(key => {
            //             const field = this.field.find(item => item.key === key)
            //             fields.push(field)
            //         })
            //         this.tableFields = fields
            //     },
            //     immediate: true
            // }
        },
        methods: {
            handleClick (row, action) {
                console.log(row, action)
                const ACTION_FUN_MAP = {
                    'edit': 'handleEdit',
                    'del': 'handleDelete',
                    'detail': 'viewDetail'
                }
                this[ACTION_FUN_MAP[action]](row)
            },
            handleEdit (row) {
                console.log('handleEdit')
            },
            handleDelete (row) {
                console.log('handleDelete')
            },
            viewDetail (row) {
                console.log('viewDetail')
            }
        }
    }
</script>
