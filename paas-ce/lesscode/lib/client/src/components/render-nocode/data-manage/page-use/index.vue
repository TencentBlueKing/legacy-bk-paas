<template>
    <div class="data-manage-use-page">
        <operate-area :buttons="tableConfig.operatingButtons" @click="handleClick"></operate-area>
        <filter-area :filters="filters" :fields="fields" @search="handleSearch"></filter-area>
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
            getFields () {}, // 加载表单字段
            handleClick (action) {
                const ACTION_FUN_MAP = {
                    'add': 'handleAdd',
                    'import': 'handleImport',
                    'export': 'handleExport',
                    'download': 'download',
                    'bacthDel': 'handleDelete'
                }
                this[ACTION_FUN_MAP[action]]()
            },
            handleAdd () {
                //  占位
                this.$router.push({
                    name: 'commonCreateTicket',
                    params: {
                        appId: 1,
                        version: 2,
                        pageId: 1,
                        funcId: 1,
                        actionId: 1,
                        actionName: '导入'
                    },
                    query: {
                        actionType: '',
                        componentId: 1
                    }
                })
            },
            handleImport () {
                console.log('handleImport')
            },
            async  handleExport () {
                // params TODO
                const params = {
                    page_id: 1,
                    version_number: 1
                }
                if (this.selection.length > 0) {
                    const ids = this.selection.map(item => item.id)
                    params.ids = ids
                }
                const res = await this.$store.dispatch('nocode/dataManage/exportData', params)
                const href = window.URL.createObjectURL(new Blob(
                    [res],
                    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                const downloadElement = document.createElement('a')
                downloadElement.href = href
                downloadElement.download = `${this.page.name}.csv` // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
            },
            handleDelete () {
                console.log('handleDelete')
            },
            handleSearch () {
                console.log('handleSearch')
            }
            // download () {
            //     console.log('download')
            // }
        }
    }
</script>
