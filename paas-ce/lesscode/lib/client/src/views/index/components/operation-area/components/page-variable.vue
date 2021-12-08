<template>
    <article class="page-variable-home" v-bkloading="{ isLoading }">
        <header class="page-variable-header">
            <h3 class="variable-header-title">本页面可用变量详情
                <bk-button :text="true" title="primary" @click="showVariableForm" class="add-button">
                    <i class="bk-drag-icon bk-drag-add-line"></i>
                    新建变量
                </bk-button>
            </h3>
            <span>项目级变量的修改，请跳转至
                <a :href="`/project/${projectId}/variable-manage`" target="_blank" class="variable-header-link">
                    变量管理
                    <i class="bk-drag-icon bk-drag-jump-link"></i>
                </a>
            </span>
        </header>

        <variable-table simple-display />
    </article>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import variableTable from '@/components/variable/variable-table.vue'

    export default {
        components: {
            variableTable
        },

        data () {
            return {
                isLoading: false
            }
        },

        computed: {
            ...mapGetters('page', ['pageDetail']),

            projectId () {
                return this.$route.params.projectId
            }
        },

        created () {
            this.getList()
        },

        methods: {
            ...mapActions('variable', ['getAllVariable', 'setVariableFormData']),

            getList () {
                this.isLoading = true
                const params = {
                    projectId: this.projectId,
                    pageCode: this.pageDetail.pageCode,
                    effectiveRange: 0
                }
                this.getAllVariable(params).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    this.isLoading = false
                })
            },

            showVariableForm () {
                const data = { show: true, form: {} }
                this.setVariableFormData(data)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .page-variable-home {
        padding: 28px 30px;
    }
    .page-variable-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 19px;
        font-size: 12px;
        margin-bottom: 15px;
        .variable-header-title {
            margin: 0 38px 0 0;
            font-size: 14px;
        }
        .variable-header-link {
            color: #3a84ff;
            .bk-drag-jump-link {
                font-size: 14px;
            }
        }
    }
    .add-button {
        font-size: 12px;
        margin-left: 6px;
        /deep/ span {
            display: flex;
            align-items: center;
            .bk-drag-add-line {
                margin-right: 3px;
            }
        }
    }
</style>
