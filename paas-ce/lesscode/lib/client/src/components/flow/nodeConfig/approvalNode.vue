<template>
    <div class="approval-node-form" v-bkloading="{ isLoading: fieldListLoading }">
        <bk-form form-type="vertical">
            <bk-form-item label="审批方式" :required="true">
                <bk-radio-group v-model="formData.isMulti">
                    <bk-radio :value="false">
                        或签
                        <i class="bk-icon bk-info" v-bk-tooltips="'任一处理人完成审批即可'"></i>
                    </bk-radio>
                    <bk-radio :value="true">
                        多签
                        <i class="bk-icon bk-info" v-bk-tooltips="'所有处理人均要进行审批。'"></i>
                    </bk-radio>
                </bk-radio-group>
            </bk-form-item>
            <node-fields-table
                style="margin-top: 24px"
                :node="node"
                :app-id="appId"
                :func-id="funcId"
                :flow-id="flowId"
                :related-form="relatedForm"
                @updateFieldIds="$emit('updateFieldIds', $event)">
            </node-fields-table>
        </bk-form>
    </div>
</template>
<script>
    import NodeFieldsTable from './components/nodeFieldsTable.vue'

    export default {
        name: 'ApprovalNode',
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
            flowId: Number,
            relatedForm: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                fieldListLoading: false,
                fieldList: [],
                formData: {
                    isMulti: this.node.is_multi
                }
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
            getData () {
                return this.formData.isMulti
            }
        }
    }
</script>
<style lang="postcss" scoped>
.approval-node-form {
  margin-top: 24px;
}
</style>
