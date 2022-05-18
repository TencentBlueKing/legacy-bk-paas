<template>
    <section v-bkloading="{ isLoading: funcDataLoading, zIndex: 2999 }" class="function-edit-page">
        <div slot="header" class="steps-container">
            <bk-steps
                v-if="!funcDataLoading"
                :controllable="true"
                :steps="steps"
                :cur-step="curStep"
                @step-changed="handleStepChange"></bk-steps>
        </div>
        <div v-if="!funcDataLoading" class="function-edit-main" style="height: 100%">
            <flow-config v-if="curStep === 1"></flow-config>
            <advanced-config v-else></advanced-config>
        </div>
    </section>
</template>
<script>
    import FlowConfig from './flowConfig.vue'
    import AdvancedConfig from './advancedConfig.vue'

    const STEPS = [
        { id: 'functionFlow', icon: 1, title: '配置功能流程' },
        { id: 'functionAdvanced', icon: 2, title: '高级配置' }
    ]

    export default {
        name: 'FunctionEditPage',
        components: {
            FlowConfig,
            AdvancedConfig
        },
        props: {
            appId: {
                type: String,
                default: ''
            },
            funcId: [Number, String] // 通过路由获取的为字符串
        },
        data () {
            return {
                steps: [],
                curStep: 0,
                funcDataLoading: !!this.funcId,
                functionData: {}
            }
        },
        computed: {
            title () {
                return this.funcId ? '编辑功能' : '新建功能'
            }
        },
        created () {
            if (this.funcId) {
                this.getFuncData()
            } else {
                this.functionData = {
                    type: '',
                    name: '',
                    worksheet_ids: [],
                    desc: ''
                }
            }
        },
        methods: {
            async getFuncData () {
                try {
                    this.funcDataLoading = true
                    const res = await this.$store.dispatch('setting/getFunctionData', this.funcId)
                    this.functionData = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.funcDataLoading = false
                }
            },
            handleBackClick () {
                this.$bkInfo({
                    title: '此操作会导致您的编辑没有保存，确认吗？',
                    type: 'warning',
                    width: 500,
                    confirmFn: () => {
                        this.$router.push({ name: 'functionList', params: { appId: this.appId } })
                    }
                })
            },
            handleStepChange (val) {
                if (!this.funcId && [1, 2].includes(val)) {
                    return
                }
                const name = STEPS.find(item => item.icon === val).id
                this.$router.push({ name, params: { appId: this.appId, funcId: this.funcId } })
            },
            updateFuncData (data) {
                this.functionData = data
            }
        }
    }
</script>
<style lang="postcss" scoped>
/deep/ .page-header-container {
  .title-area {
    position: absolute;
    left: 0;
    top: 0;
  }
  .header-extend-area {
    margin: 0 auto;
    min-width: 658px;
  }
}
</style>
