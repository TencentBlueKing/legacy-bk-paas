<template>
    <div class="data-manage-use-page">
        <operate-area :buttons="tableConfig.operatingButtons"></operate-area>
        <filter-area :filters="filters" :fields="fields"></filter-area>
        <table-data :config="tableConfig"></table-data>
    </div>
</template>
<script>
    import operateArea from './operate-area.vue'
    import filterArea from './filter-area.vue'
    import tableData from './table-data.vue'

    export default {
        name: 'dataManageUsePage',
        components: {
            operateArea,
            filterArea,
            tableData
        },
        data () {
            return {
                fields: [], // 表单字段列表
                formId: null, // 表单id
                filters: ['key1', 'key2', 'key3'],
                tableConfig: {
                    operatingButtons: [
                        { type: 'ADD', name: '添加' },
                        { type: 'BATCH_DELETE', name: '批量删除' },
                        { type: 'DOWNLOAD_FILES', name: '下载附件' }
                    ],
                    fields: [],
                    innerActions: []
                }
            }
        },
        methods: {
            getFields () {} // 加载表单字段
        }
    }
</script>
