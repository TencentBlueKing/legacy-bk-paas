<template>
    <article>
        <bk-table
            class="g-hairless-table"
            :outer-border="false"
            :data="functionList"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
        >
            <bk-table-column
                label="函数名称"
                prop="funcName"
            ></bk-table-column>
            <bk-table-column
                label="简介"
                prop="funcSummary"
            ></bk-table-column>
            <bk-table-column label="操作" width="180">
                <template slot-scope="props">
                    <bk-button text @click="showCode(props.row)" class="mr10">查看源码</bk-button>
                    <bk-button text @click="addToProject(props.row)">添加至应用</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <span class="function-tips">注：如需使用函数，可添加至应用然后在应用中使用</span>

        <edit-func-sideslider
            title="添加至应用"
            :is-show="showAddFunc.isShow"
            :func-data="showAddFunc.func"
            :is-edit="false"
            @close="handleClose"
        />

        <show-func-dialog
            :is-show.sync="showSource.isShow"
            :func-data="showSource.func"
            :is-show-export="false"
        />
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        computed,
        toRef
    } from '@vue/composition-api'
    import ShowFuncDialog from '@/components/methods/forms/show-func-dialog.vue'
    import EditFuncSideslider from '@/components/methods/forms/edit-func-sideslider.vue'
    import {
        FUNCTION_TYPE,
        getDefaultFunction
    } from 'shared/function'
    import router from '@/router'

    interface ITable {
        tableName: string,
        columns: any[]
    }

    // 默认提供的函数
    const getDataFuncList = (tableName, projectId) => {
        const funcApiUrl = `/data-source/user/projectId/${projectId}/tableName/${tableName}`
        return [
            {
                funcName: 'getDataList',
                funcParams: ['page', 'pageSize'],
                funcType: FUNCTION_TYPE.EMPTY,
                funcBody: `return this.$http.get(\`${funcApiUrl}?page=\${page}&pageSize=\${pageSize}\`).then(res => {\r\n`
                    + '    // 可以在这里添加业务操作\r\n'
                    + '    return res\r\n'
                    + '}).catch((err) => {\r\n'
                    + '    console.log(err)\r\n'
                    + '})\r\n',
                funcSummary: `分页获取 ${tableName} 表的数据,返回该页数据和数据总数目`,
                projectId
            },
            {
                funcName: 'addData',
                funcParams: ['data'],
                funcType: FUNCTION_TYPE.EMPTY,
                funcBody: `return this.$http.post('${funcApiUrl}', data).then(res => {\r\n`
                    + '    // 可以在这里添加业务操作\r\n'
                    + '    return res\r\n'
                    + '}).catch((err) => {\r\n'
                    + '    console.log(err)\r\n'
                    + '})\r\n',
                funcSummary: `新增 ${tableName} 表的数据。注意：非空字段必填`,
                projectId
            },
            {
                funcName: 'updateData',
                funcParams: ['data'],
                funcType: FUNCTION_TYPE.EMPTY,
                funcBody: `return this.$http.put('${funcApiUrl}', data).then(res => {\r\n`
                    + '    // 可以在这里添加业务操作\r\n'
                    + '    return res\r\n'
                    + '}).catch((err) => {\r\n'
                    + '    console.log(err)\r\n'
                    + '})\r\n',
                funcSummary: `更新 ${tableName} 表的数据。注意：传入的数据一定要包含 id 字段`,
                projectId
            },
            {
                funcName: 'deleteData',
                funcParams: ['id'],
                funcType: FUNCTION_TYPE.EMPTY,
                funcBody: `return this.$http.delete(\`${funcApiUrl}?id=\${id}\`).then(res => {\r\n`
                    + '    // 可以在这里添加业务操作\r\n'
                    + '    return res\r\n'
                    + '}).catch((err) => {\r\n'
                    + '    console.log(err)\r\n'
                    + '})\r\n',
                funcSummary: `删除 ${tableName} 表的数据`,
                projectId
            }
        ]
    }

    export default defineComponent({
        components: {
            ShowFuncDialog,
            EditFuncSideslider
        },
        props: {
            activeTable: Object as PropType<ITable>
        },
        setup (props) {
            const projectId = router?.currentRoute?.params?.projectId
            const activeTable = toRef(props, 'activeTable')
            const functionList = computed(() => getDataFuncList(activeTable.value.tableName, projectId).map(getDefaultFunction))

            const showAddFunc = reactive({
                isShow: false,
                loading: false,
                func: {}
            })

            const showSource = reactive({
                isShow: false,
                func: {}
            })

            const showCode = (row) => {
                showSource.isShow = true
                showSource.func = row
            }

            const handleClose = () => {
                showAddFunc.isShow = false
            }

            const addToProject = (row) => {
                showAddFunc.isShow = true
                showAddFunc.func = row
            }

            return {
                functionList,
                showAddFunc,
                showSource,
                showCode,
                handleClose,
                addToProject
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .function-tips {
        font-size: 12px;
        margin-top: 12px;
        display: inline-block;
    }
</style>
