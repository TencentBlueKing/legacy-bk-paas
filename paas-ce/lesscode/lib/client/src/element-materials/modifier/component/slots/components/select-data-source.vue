<template>
    <section>
        <div class="label">id 配置</div>
        <bk-input
            :value="sourceData.params.idKey"
            @change="val => changeParams('idKey', val)"
        />
        <div class="label mt10">name 配置</div>
        <bk-input
            :value="sourceData.params.nameKey"
            @change="val => changeParams('nameKey', val)"
        />
        <div class="label mt10">表</div>
        <choose-data-table
            class="mt10"
            :value="sourceData.tableName"
            @choose="chooseTable"
        />
    </section>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs
    } from '@vue/composition-api'
    import chooseDataTable from '@/components/choose-data-table.vue'

    interface Iprop {
        slotVal?: any,
        slotConfig?: any,
        change: (slot: any) => void
    }

    export default defineComponent({
        components: {
            chooseDataTable
        },

        props: {
            slotVal: {
                type: Object,
                required: true
            },
            slotConfig: {
                type: Object,
                default: () => ({})
            },
            change: {
                type: Function,
                default: () => {}
            }
        },

        setup (props) {
            const {
                slotVal,
                change
            } = toRefs<Iprop>(props)
            // 参数原始值
            const originSourceData = slotVal?.value?.payload?.sourceData
            // 构造此处需要使用的数据
            const sourceData = ref({
                val: [],
                tableName: originSourceData?.tableName,
                params: {
                    idKey: originSourceData?.params?.idKey,
                    nameKey: originSourceData?.params?.nameKey
                }
            })

            const chooseTable = (tableName, result) => {
                sourceData.value.val = result.list
                sourceData.value.tableName = tableName
                triggleUpdate()
            }

            const changeParams = (key, value) => {
                sourceData.value.params[key] = value
                triggleUpdate()
            }

            const triggleUpdate = () => {
                const slot = {
                    ...slotVal.value,
                    val: sourceData.value.val,
                    payload: {
                        sourceData: {
                            tableName: sourceData.value.tableName,
                            params: {
                                ...sourceData.value.params
                            }
                        }
                    }
                }
                change.value(slot)
            }

            return {
                sourceData,
                chooseTable,
                changeParams
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .label {
        line-height: 19px;
        margin-bottom: 4px;
    }
</style>
