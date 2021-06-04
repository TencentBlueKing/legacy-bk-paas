<template>
    <bk-dialog
        :render-directive="'if'"
        :class="$style['public-scope-dialog']"
        title="公开范围设置"
        :value="isShow"
        @cancel="handleCancel"
        :mask-close="false"
        :width="700"
        header-position="left">
        <div :class="{ 'scope-specify': scope === ScopeValue.Specify }">
            <bk-radio-group v-model="scope" class="scope-radio-group">
                <bk-radio :value="ScopeValue.Self">仅本项目</bk-radio>
                <bk-radio :value="ScopeValue.Specify">特定项目</bk-radio>
                <bk-radio :value="ScopeValue.All">所有项目，包含后续新增</bk-radio>
            </bk-radio-group>
            <div class="scope-transfer-wrapper" v-if="scope === ScopeValue.Specify">
                <bk-transfer
                    :target-list="selectedProjetList"
                    :source-list="sourceProjectList"
                    v-bind="transfer"
                    :sortable="true"
                    @change="handleChange">
                </bk-transfer>
            </div>
        </div>
        <div slot="footer">
            <bk-button
                theme="primary"
                :disabled="dialog.disabled"
                :loading="dialog.loading"
                @click="handleConfirm">确定</bk-button>
            <bk-button @click="handleCancel" :disabled="dialog.loading">取消</bk-button>
        </div>
    </bk-dialog>
</template>
<script>
    export default {
        name: '',
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => ({
                    scope: [],
                    comp: {}
                })
            }
        },
        data () {
            return {
                ScopeValue: {
                    Self: 0,
                    Specify: -1,
                    All: 1
                },
                sourceProjectList: [],
                selectedProjetList: [],
                targetProjects: [],
                scope: 0,
                dialog: {
                    disabled: false,
                    loading: false
                },
                transfer: {
                    title: ['项目列表', '公开项目'],
                    emptyContent: ['无项目', '未选择项目'],
                    displayKey: 'projectName',
                    settingKey: 'id'
                }
            }
        },
        computed: {
            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },
        watch: {
            data (data) {
                this.scope = data.scope[1]
                if (this.scope === this.ScopeValue.Specify) {
                    this.selectedProjetList = data.scope[0].map(item => item.projectId)
                } else {
                    this.selectedProjetList = []
                }
            },
            scope (scope) {
                this.dialog.disabled = scope === this.ScopeValue.Specify
            },
            selectedProjetList () {
                this.appendSourceProject()
            }
        },
        async created () {
            const projectList = await this.$store.dispatch('project/my', { config: {} })
            projectList.splice(projectList.findIndex(item => item.id === this.projectId), 1)
            this.sourceProjectList = projectList
        },
        methods: {
            appendSourceProject () {
                if (this.scope === this.ScopeValue.Specify) {
                    const targetProjects = this.data.scope[0] || []
                    // 用户A1共享项目P给A2，P项目组件C公开范围为特定项目P1此项目只属于A1，A2查看项目P的组件C公开范围设置时，在“公开项目”中看不到P1
                    // 因为逻辑上设置特定项目时的项目数据只能是当前用户A2的项目（包括共享项目），P1项目不属于A2
                    // 所以，此处将P1项目也共享给A2即可在设置中正常显示出P1，但由于共享其它项目的组件并非强制项目一定要属于用户，因此为了满足设置上的需求
                    // 在现有数据的基础上，将非当前用户的项目数据追加到项目列表中
                    const appendProjects = targetProjects.filter(item => this.sourceProjectList.findIndex(source => source.id === item.projectId) === -1)
                    this.sourceProjectList.push(...appendProjects.map(item => ({
                        id: item.projectId,
                        ...item
                    })))
                }
            },
            async handleConfirm () {
                if (this.scope !== this.ScopeValue.Specify && this.scope === this.data.scope[1]) {
                    this.$emit('update:isShow', false)
                    return
                }

                try {
                    this.dialog.loading = true
                    const data = {
                        scope: this.scope,
                        targetProjects: this.targetProjects,
                        compId: this.data.comp.id,
                        projectId: this.data.comp.belongProjectId
                    }

                    await this.$store.dispatch('components/scope', { data })

                    this.messageSuccess('设置成功')
                    this.$emit('update:isShow', false)
                    this.$emit('on-update')
                } catch (e) {
                    console.error(e)
                } finally {
                    this.dialog.loading = false
                }
            },
            handleCancel () {
                this.scope = this.data.scope[1]
                this.$emit('update:isShow', false)
            },
            handleChange (sourceList, targetList, targetValueList) {
                this.dialog.disabled = targetValueList.length === 0
                this.targetProjects = targetValueList
            }
        }
    }
</script>
<style lang="postcss" module>
    .public-scope-dialog {
    }

    :global {
        .scope-radio-group {
            margin-bottom: 40px;
            margin-top: 8px;

            .bk-form-radio {
                width: 160px;

                &:last-child {
                    width: 180px;
                }
            }
        }

        .scope-transfer-wrapper {
            height: 320px;
            .source-list,
            .target-list {
                height: 320px;
            }
        }

        .scope-specify {
            .scope-radio-group {
                margin-bottom: 22px;
            }
        }
    }

</style>
