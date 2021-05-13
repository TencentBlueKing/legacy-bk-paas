<template>
    <article class="variable-manage-home">
        <header class="variable-manage-header">
            <bk-button theme="primary" @click="showVariableForm">新建</bk-button>
            <bk-input class="header-input" placeholder="变量名称" clearable right-icon="bk-icon icon-search" v-model="variableName"></bk-input>
        </header>
        <variable-table v-bkloading="{ isLoading }" :variable-name="variableName">
            <span class="variable-tip">提示：<br>1. 可以在组件属性和指令中使用该变量，在函数中可以使用【lesscode.变量标识】唤醒编辑器自动补全功能选择对应变量，来获取或者修改该变量的值<br>2. 这里为项目级公共变量，各页面私有变量请前往页面编辑-》页面变量查看</span>
        </variable-table>
        <variable-form />
    </article>
</template>

<script>
    import { mapActions } from 'vuex'
    import variableForm from '@/components/variable/variable-form/index.vue'
    import variableTable from '@/components/variable/variable-table.vue'

    export default {
        components: {
            variableForm,
            variableTable
        },

        data () {
            return {
                isLoading: false,
                variableName: ''
            }
        },

        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },

        created () {
            this.getList()
            this.getAllGroupFuncs(this.projectId).catch((err) => this.$bkMessage({ theme: 'error', message: err.message || err }))
        },

        methods: {
            ...mapActions('variable', ['getAllVariable', 'setVariableFormData']),
            ...mapActions('functions', ['getAllGroupFuncs']),

            getList () {
                const params = {
                    projectId: this.projectId,
                    effectiveRange: 0
                }
                this.isLoading = true
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
    .variable-manage-home {
        padding: 16px 24px;
        height: 100%;
    }

    .variable-manage-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
        .header-input {
            width: 400px;
        }
    }
</style>
