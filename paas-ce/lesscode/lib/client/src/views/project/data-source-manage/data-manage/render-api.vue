<template>
    <article>
        <bk-table
            class="g-hairless-table"
            :outer-border="false"
            :data="apiList"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
        >
            <bk-table-column
                show-overflow-tooltip
                label="请求地址"
                prop="url"
            >
                <template slot-scope="props">
                    <span class="api-url">{{ props.row.url }}</span>
                    <copy-icon :value="props.row.url"></copy-icon>
                </template>
            </bk-table-column>
            <bk-table-column
                label="请求方法"
            >
                <template slot-scope="props">
                    <span :class="[props.row.type, 'api-type']">{{ firstUpperCase(props.row.type) }}</span>
                </template>
            </bk-table-column>
            <bk-table-column
                label="请求参数"
                prop="params"
            >
                <template slot-scope="props">
                    <bk-button text @click="showDetail('查看请求参数', props.row.params)">查看请求参数</bk-button>
                </template>
            </bk-table-column>
            <bk-table-column
                label="返回数据"
                prop="result"
            >
                <template slot-scope="props">
                    <bk-button text @click="showDetail('查看返回数据', props.row.result)">查看返回数据</bk-button>
                </template>
            </bk-table-column>
            <bk-table-column
                show-overflow-tooltip
                label="描述"
                prop="summary"
            ></bk-table-column>
        </bk-table>
        <span class="function-tips">注：可以将请求地址复制到函数中使用，具体使用方式可以参考函数示例</span>

        <bk-dialog
            v-model="isShowDetail"
            header-position="left"
            width="800"
            :show-footer="false"
            :title="detailTitle">
            <monaco
                read-only
                language="json"
                :height="500"
                :value="showDetailValue"
            ></monaco>
        </bk-dialog>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRef,
        computed,
        ref
    } from '@vue/composition-api'
    import {
        FUNCTION_METHOD
    } from 'shared/function/'
    import router from '@/router'
    import copyIcon from '@/components/copy-icon.js'
    import monaco from '@/components/monaco.vue'

    interface ITable {
        tableName: string,
        columns: any[]
    }

    // 默认提供的函数
    const getDataApiList = (tableName, projectId, columns) => {
        const url = `/data-source/user/projectId/${projectId}/tableName/${tableName}`
        const dataObject = columns.reduce((acc, cur) => {
            acc[cur.name] = `${cur.name}的值`
            return acc
        }, {})
        const dataWithOutId = columns.reduce((acc, cur) => {
            if (cur.name !== 'id') {
                acc[cur.name] = `${cur.name}的值`
            }
            return acc
        }, {})
        return [
            {
                url,
                type: FUNCTION_METHOD.GET,
                params: {
                    page: 'query 参数，数字类型，表示分页的页码。不传表示获取所有数据',
                    pageSize: 'query 参数，数字类型，表示每页数量。不传表示获取所有数据'
                },
                result: {
                    code: '状态码,-1表示接口异常',
                    data: {
                        list: [dataObject],
                        count: '数字类型，数量'
                    },
                    message: '接口返回的消息'
                },
                summary: `分页获取 ${tableName} 表的数据,返回该页数据和数据总数目`
            },
            {
                url,
                type: FUNCTION_METHOD.POST,
                params: dataWithOutId,
                result: {
                    code: '状态码,-1表示接口异常',
                    data: dataObject,
                    message: '接口返回的消息'
                },
                summary: `新增 ${tableName} 表的数据。注意：非空字段必填`
            },
            {
                url,
                type: FUNCTION_METHOD.PUT,
                params: dataObject,
                result: {
                    code: '状态码,-1表示接口异常',
                    data: '数字类型，返回更新操作影响的行数',
                    message: '接口返回的消息'
                },
                summary: `更新 ${tableName} 表的数据。注意：传入的数据一定要包含 id 字段`
            },
            {
                url,
                type: FUNCTION_METHOD.DELETE,
                params: {
                    id: 'query 参数，表示删除数据的 id 字段'
                },
                result: {
                    code: '状态码,-1表示接口异常',
                    data: '数字类型，返回删除操作影响的行数',
                    message: '接口返回的消息'
                },
                summary: `删除 ${tableName} 表的数据`
            }
        ]
    }

    export default defineComponent({
        components: {
            copyIcon,
            monaco
        },
        props: {
            activeTable: Object as PropType<ITable>
        },
        setup (props) {
            const projectId = router?.currentRoute?.params?.projectId
            const activeTable = toRef(props, 'activeTable')
            const isShowDetail = ref(false)
            const showDetailValue = ref('')
            const detailTitle = ref('')

            const apiList = computed(() => getDataApiList(activeTable.value.tableName, projectId, activeTable.value.columns))

            const showDetail = (title, value) => {
                detailTitle.value = title
                showDetailValue.value = JSON.stringify(value, null, 4)
                isShowDetail.value = true
            }

            const firstUpperCase = (val) => {
                return val?.replace(/.?/, x => x.toUpperCase())
            }

            return {
                apiList,
                isShowDetail,
                showDetailValue,
                detailTitle,
                showDetail,
                firstUpperCase
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
    .api-url {
        display: inline-block;
        max-width: calc(100% - 30px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
    }
    .api-type {
        display: inline-block;
        text-align: center;
        width: 48px;
        height: 22px;
        line-height: 22px;
        border-radius: 2px;
        &.delete {
            background: #f8d8d4;
        }
        &.put {
            background: #fff2c9;
        }
        &.get {
            background: #cde8fb;
        }
        &.post {
            background: #dbd4ed;
        }
    }
</style>
