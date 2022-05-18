<template>
    <div class="normal-node-form">
        <node-fields-table
            :node="node"
            :app-id="appId"
            :func-id="funcId"
            :flow-id="flowId"
            :func-type="funcType"
            :related-form="relatedForm"
            :disable-create-field="disableCreateField"
            :editable="editable"
            @updateFieldIds="$emit('updateFieldIds', $event)">
        </node-fields-table>
    </div>
</template>
<script>
    import NodeFieldsTable from './components/nodeFieldsTable.vue'

    export default {
        name: 'NormalNode',
        components: {
            NodeFieldsTable
        },
        props: {
            node: {
                type: Object,
                default: () => ({})
            },
            appId: {
                type: String,
                default: ''
            },
            funcId: [String, Number],
            funcType: String,
            flowId: Number,
            relatedForm: {
                type: Array,
                default: () => []
            },
            disableCreateField: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            }
        }
    }
</script>
<style lang="postcss" scoped>
.normal-node-form {
  margin-top: 24px;
}
</style>
