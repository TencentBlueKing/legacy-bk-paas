<template>
    <section>
        <bk-select @change="chooseTable" :value="value" searchable>
            <bk-option v-for="table in tableList"
                :key="table.tableName"
                :id="table.tableName"
                :name="table.tableName">
            </bk-option>
            <div slot="extension" @click="handleCreate" style="cursor: pointer;">
                <i class="bk-icon icon-plus-circle"></i>新增
            </div>
        </bk-select>
        <bk-button
            class="mt10"
            theme="primary"
            size="small"
            :disabled="!value"
            :loading="isLoading"
            @click="chooseTable(value)"
        >获取数据</bk-button>
    </section>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref
    } from '@vue/composition-api'
    import { messageError } from '@/common/bkmagic'
    import store from '@/store'
    import router from '@/router'

    export default defineComponent({
        props: {
            value: String
        },

        setup (_, { emit }) {
            const isLoading = ref(false)
            const projectId = router?.currentRoute?.params?.projectId
            const tableList = store?.state?.dataSource?.tableList

            const chooseTable = (tableName) => {
                isLoading.value = true
                const queryData = {
                    projectId,
                    environment: 'preview',
                    tableName
                }
                store.dispatch('dataSource/getOnlineTableDatas', queryData).then((data) => {
                    const table = tableList.find((table) => table.tableName === tableName)
                    emit('update:value', tableName)
                    emit('choose', tableName, data, table)
                }).catch((error) => {
                    messageError(error.message || error)
                }).finally(() => {
                    isLoading.value = false
                })
            }

            const handleCreate = () => {
                window.open(`/project/${projectId}/data-source-manage/`, '_blank')
            }

            return {
                isLoading,
                tableList,
                chooseTable,
                handleCreate
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .icon-plus-circle {
        display: inline-block;
        vertical-align: baseline;
        font-size: 12px;
        margin-right: 4px;
    }
</style>
