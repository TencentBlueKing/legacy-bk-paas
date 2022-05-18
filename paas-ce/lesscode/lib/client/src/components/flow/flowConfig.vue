<template>
    <section class="flow-config" style="height: 100%">
        <div class="flow-container" v-bkloading="{ isLoading: flowDataLoading }">
            <flow-canvas
                v-if="!flowDataLoading"
                :nodes="flowData.nodes"
                :lines="flowData.lines"
                :type="funcData.type"
                :flow-id="funcData.workflow_id"
                :editable="!funcData.is_builtin"
                :disable-edit-line="funcData.type === 'DETAIL'"
                :show-palette="!funcData.is_builtin && funcData.type !== 'DETAIL'"
                @onNodeClick="handleNodeClick">
            </flow-canvas>
        </div>
        <div class="action-wrapper">
            <bk-button size="large" @click="$router.push({ name: 'functionBasic', params: { appId, funcId: funcData.id } })">
                上一步
            </bk-button>
            <bk-button
                theme="primary"
                size="large"
                :loading="flowPending"
                :disabled="flowDataLoading"
                @click="handleNextStep">
                {{ funcData.type === 'DETAIL' ? '关闭' : '下一步' }}
            </bk-button>
        </div>
        <div v-if="nodeConfigPanelShow" class="node-config-wrapper">
            <node-config-panel
                :node-id="crtNode"
                :app-id="appId"
                :func-id="funcData.id"
                :func-type="funcData.type"
                :flow-id="funcData.workflow_id"
                :related-form="funcData.relate_worksheet"
                :create-ticket-node-id="createTicketNodeId"
                :disable-create-field="funcData.type === 'DETAIL'"
                :editable="!funcData.is_builtin"
                @close="closeConfigPanel"
                @save="handleConfigSave">
            </node-config-panel>
        </div>
    </section>
</template>
<script>
    import FlowCanvas from './flow-canvas/index.vue'
    import NodeConfigPanel from './nodeConfig/nodeConfigPanel.vue'
    export default {
        name: 'FunctionFlow',
        components: {
            FlowCanvas,
            NodeConfigPanel
        },
        props: {
            appId: {
                type: String,
                default: ''
            },
            funcData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                flowDataLoading: false,
                flowPending: false,
                flowData: { nodes: [], lines: [] },
                createTicketNodeId: '',
                nodeConfigPanelShow: false,
                crtNode: null
            }
        },
        created () {
            this.getFlowData()
        },
        methods: {
            // 获取流程图详情
            async getFlowData () {
                try {
                    this.flowDataLoading = true
                    const params = { workflow: this.funcData.workflow_id }
                    const res = await Promise.all([
                        this.$store.dispatch('setting/getFlowNodes', params),
                        this.$store.dispatch('setting/getFlowLines', params)
                    ])
                    this.flowData = {
                        nodes: res[0].data,
                        lines: res[1].data.items
                    }
                    this.createTicketNodeId = res[0].data.find(item => item.is_first_state && item.is_builtin).id
                } catch (e) {
                    console.error(e)
                } finally {
                    this.flowDataLoading = false
                }
            },
            // 节点单击
            handleNodeClick (node) {
                if (['START', 'END', 'ROUTER-P', 'COVERAGE'].includes(node.type)) {
                    return
                }
                this.nodeConfigPanelShow = true
                this.crtNode = node.id
            },
            closeConfigPanel () {
                this.nodeConfigPanelShow = false
                this.crtNode = null
            },
            handleConfigSave () {
                this.closeConfigPanel()
                this.getFlowData()
            },
            handleNextStep () {
                if (this.funcData.type === 'DETAIL') {
                    this.$router.push({ name: 'functionList', params: { appId: this.appId } })
                } else {
                    this.$router.push({ name: 'functionAdvanced', params: { appId: this.appId, funcId: this.funcData.id } })
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
.flow-config {
  position: relative;
}
.flow-container {
  height: calc(100% - 56px);
  position: relative;
}
.action-wrapper {
  position: relative;
  padding: 0 24px;
  height: 56px;
  line-height: 56px;
  text-align: right;
  background: #fafbfd;
  box-shadow: inset 0 1px 0 0 #dcdee5;
  .bk-button {
    margin-left: 4px;
    min-width: 100px;
    height: 40px;
    line-height: 40px;
  }
}
.node-config-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  z-index: 1100;
}

.tip-box {
  display: flex;
  position: absolute;
  margin-bottom: 24px;
  width: 800px;
  padding: 4px 10px;
  border: 1px solid #C5DAFF;
  border-radius: 2px;
  background: #F0F8FF;
  font-size: 12px;
  color: #63656E;
  line-height: 32px;
  z-index: 100;
  top: 12px;
  left: 72px;

  .info {
    top: 24px;
    margin: 0 8px 0 11px;
    color: #3A84FF;
    font-size: 14px ;
    line-height: 32px;
  }
  .icon-close{
    display: inline-block;
    font-size: 16px;
    margin-top: 8px;
  }
}
</style>
