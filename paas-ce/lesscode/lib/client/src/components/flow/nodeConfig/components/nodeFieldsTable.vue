<template>
    <div class="node-fields-table" v-bkloading="{ isLoading: fieldListLoading }">
        <bk-form form-type="vertical">
            <bk-form-item label="字段配置">
                <fields-table
                    :list="fieldList"
                    :node="node"
                    :app-id="appId"
                    :func-id="funcId"
                    :func-type="funcType"
                    :flow-id="flowId"
                    :related-form="relatedForm"
                    :disable-create-field="disableCreateField"
                    :editable="editable"
                    @change="updateFieldList">
                </fields-table>
            </bk-form-item>
        </bk-form>
    </div>
</template>
<script>
    import FieldsTable from './fieldsTable.vue'

    export default {
        name: 'NodeFieldsTable',
        components: {
            FieldsTable
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
            funcId: [Number, String],
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
        },
        data () {
            return {
                fieldListLoading: false,
                fieldList: []
            }
        },
        created () {
            this.getFieldList()
        },
        methods: {
            async getFieldList () {
                try {
                    this.fieldListLoading = true
                    const res = await this.$store.dispatch('setting/getNodeFields', {
                        workflow: this.flowId,
                        state: this.node.id
                    })
                    this.fieldList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fieldListLoading = false
                }
            },
            updateFieldList (list) {
                this.fieldList = list
                const fieldIds = this.fieldList.map(item => item.id)
                this.$emit('updateFieldIds', fieldIds)
            }
        }
    }
</script>
