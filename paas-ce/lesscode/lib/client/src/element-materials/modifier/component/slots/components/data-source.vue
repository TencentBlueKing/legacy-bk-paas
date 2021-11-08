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
            const propStatus = toRefs<Iprop>(props)
            const chooseTableName = ref(propStatus.slotVal?.value?.payload?.sourceData?.tableName)

            const chooseTable = (tableName, result) => {
                chooseTableName.value = tableName
                const slot = {
                    ...propStatus.slotVal.value,
                    val: result.list,
                    payload: {
                        sourceData: {
                            tableName
                        }
                    }
                }
                propStatus.change.value(slot)
            }

            return {
                chooseTableName,
                chooseTable
            }
        }
    })
</script>
