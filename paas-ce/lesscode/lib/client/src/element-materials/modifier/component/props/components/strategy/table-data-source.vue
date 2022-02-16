<template>
    <choose-data-table :value="chooseTableName" @choose="chooseTable"></choose-data-table>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs
    } from '@vue/composition-api'
    import chooseDataTable from '@/components/choose-data-table.vue'

    interface Iprop {
        name?: string,
        type?: string,
        payload?: any
        defaultValue?: any,
        change: (name: string, val: any, type: string, payload: any) => void,
        batchUpdate: (data: any) => void
    }

    export default defineComponent({
        components: {
            chooseDataTable
        },

        props: {
            name: String,
            type: String,
            payload: {
                type: Object,
                default: () => ({})
            },
            defaultValue: {
                type: [Object, Array, Number, String]
            },
            change: {
                type: Function,
                default: () => {}
            },
            batchUpdate: {
                type: Function,
                default: () => {}
            }
        },

        setup (props) {
            const propStatus = toRefs<Iprop>(props)
            const chooseTableName = ref(propStatus.payload?.value?.sourceData?.tableName)

            const chooseTable = (tableName, result, table) => {
                chooseTableName.value = tableName
                propStatus.change.value(
                    props.name,
                    result.list,
                    props.type,
                    {
                        sourceData: {
                            tableName,
                            columns: table.columns.map(({ name }) => name)
                        }
                    }
                )
            }

            return {
                chooseTableName,
                chooseTable
            }
        }
    })
</script>
