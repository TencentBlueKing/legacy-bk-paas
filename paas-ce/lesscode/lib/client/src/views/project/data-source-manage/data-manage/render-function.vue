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
                    <bk-button text @click="addToProject(props.row)">添加至项目</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <span class="function-tips">注：如需使用函数，可添加至项目然后在项目中使用</span>

        <bk-sideslider
            title="添加至项目"
            :is-show.sync="showAddFunc.isShow"
            :quick-close="false"
            :transfer="true"
            :width="796">
            <func-form slot="content" ref="funcRef" :func-data="showAddFunc.func"></func-form>
            <section slot="footer" class="add-footer">
                <bk-button theme="primary" @click="submitAddFunc" :loading="showAddFunc.loading">提交</bk-button>
                <bk-button @click="closeAddFunc">取消</bk-button>
            </section>
        </bk-sideslider>

        <section v-if="showSource.isShow" class="source-function">
            <source-func :func-data="showSource.func" class="source-code">
                <i
                    class="bk-drag-icon bk-drag-close-line icon-style"
                    slot="tools"
                    @click="showSource.isShow = false"
                ></i>
            </source-func>
        </section>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        computed,
        onBeforeMount,
        toRef,
        ref
    } from '@vue/composition-api'
    import sourceFunc from '@/components/methods/func-form/source-func.vue'
    import funcForm from '@/components/methods/func-form/index.vue'
    import funcHelper from '@/components/methods/function-helper.js'
    import {
        FUNCTION_TYPE
    } from 'shared/function/'
    import {
        messageSuccess,
        messageError
    } from '@/common/bkmagic'
    import store from '@/store'
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
                funcSummary: `分页获取 ${tableName} 表的数据,返回该页数据和数据总数目`
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
                funcSummary: `新增 ${tableName} 表的数据。注意：非空字段必填`
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
                funcSummary: `更新 ${tableName} 表的数据。注意：传入的数据一定要包含 id 字段`
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
                funcSummary: `删除 ${tableName} 表的数据`
            }
        ]
    }

    export default defineComponent({
        components: {
            sourceFunc,
            funcForm
        },
        props: {
            activeTable: Object as PropType<ITable>
        },
        setup (props) {
            const projectId = router?.currentRoute?.params?.projectId
            const versionId = store.getters['projectVersion/currentVersionId']
            const activeTable = toRef(props, 'activeTable')
            const functionList = computed(() => getDataFuncList(activeTable.value.tableName, projectId).map(funcHelper.getDefaultFunc))
            const funcRef = ref(null)

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

            const addToProject = (row) => {
                showAddFunc.isShow = true
                showAddFunc.func = row
            }

            const submitAddFunc = () => {
                funcRef.value.validate().then((postData) => {
                    showAddFunc.loading = true
                    const varWhere = { projectId, versionId, effectiveRange: 0 }
                    store.dispatch('functions/addFunc', { groupId: postData.funcGroupId, func: { projectId, ...postData }, varWhere }).then(() => {
                        messageSuccess('添加成功')
                        initData()
                        closeAddFunc()
                    }).catch(err => {
                        messageError(err.message || err)
                    }).finally(() => {
                        showAddFunc.loading = false
                    })
                }).catch((validator) => {
                    messageError(validator.content || validator)
                })
            }

            const closeAddFunc = () => {
                showAddFunc.isShow = false
            }

            const initData = () => {
                return Promise.all([
                    store.dispatch('functions/getAllGroupFuncs', { projectId, versionId }),
                    store.dispatch('variable/getAllVariable', { projectId, versionId, effectiveRange: 0 })
                ]).catch((err) => {
                    messageError(err.message || err)
                })
            }

            onBeforeMount(initData)

            return {
                functionList,
                showAddFunc,
                showSource,
                funcRef,
                showCode,
                addToProject,
                submitAddFunc,
                closeAddFunc
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .source-function {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 3000;
        .source-code {
            position: absolute;
            background: #fff;
            width: 80%;
            height: 74%;
            top: 13%;
            left: 10%;
        }
    }
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }
    .function-tips {
        font-size: 12px;
        margin-top: 12px;
        display: inline-block;
    }
</style>
