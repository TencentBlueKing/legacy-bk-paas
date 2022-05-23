<template>
    <bk-sideslider
        transfer
        :is-show="isShow"
        :quick-close="true"
        :title="title"
        :width="796"
        :before-close="handleClose"
    >
        <section class="func-form-home" slot="content">
            <form-market
                :form.sync="form"
                ref="market"
            ></form-market>
            <form-name
                v-bkloading="{ isLoading }"
                :function-list="functionList"
                :form.sync="form"
                ref="name"
            ></form-name>
            <form-code
                v-bkloading="{ isLoading }"
                :function-list="functionList"
                :form.sync="form"
                :disabled="!!form.id"
                ref="code"
            ></form-code>
            <form-group
                :form.sync="form"
                ref="group"
            ></form-group>
            <form-detail
                :form.sync="form"
                ref="detail"
            ></form-detail>
            <form-api-data
                :form.sync="form"
                ref="apiData"
            ></form-api-data>
            <form-summary
                :form.sync="form"
                ref="summary"
            ></form-summary>
            <form-monaco
                :form.sync="form"
                :function-list="functionList"
                :variable-list="variableList"
                class="mt20"
                ref="monaco"
            ></form-monaco>
        </section>
        <section slot="footer" class="add-footer">
            <bk-button theme="primary" @click="handleSubmit" :loading="isSubmitting">提交</bk-button>
            <bk-button @click="handleClose">取消</bk-button>
        </section>
    </bk-sideslider>
</template>

<script>
    import mixins from './form-mixins'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        mixins: [mixins],

        props: {
            title: String,
            isShow: Boolean,
            isEdit: Boolean
        },

        data () {
            return {
                functionList: [],
                isLoading: false,
                isSubmitting: false
            }
        },

        computed: {
            ...mapGetters('projectVersion', ['currentVersionId']),
            ...mapGetters('variable', ['variableList']),

            projectId () {
                return this.$route.params.projectId
            }
        },

        created () {
            this.freshFunctionList()
        },

        methods: {
            ...mapActions('functions', [
                'getFunctionList',
                'createFunction',
                'editFunction'
            ]),

            freshFunctionList () {
                this.isLoading = true
                this.getFunctionList({
                    projectId: this.projectId,
                    versionId: this.currentVersionId
                }).then((functionList) => {
                    this.functionList = functionList || []
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoading = false
                })
            },

            handleSubmit () {
                this.validate().then((form) => {
                    if (this.isEdit) {
                        this.submitEdit(form)
                    } else {
                        this.submitCreate(form)
                    }
                }).catch((validator) => {
                    this.$bkMessage({ message: validator.content || validator, theme: 'error' })
                })
            },

            submitEdit (form) {
                this.isSubmitting = true
                this.editFunction(form).then(() => {
                    this.formChanged = false
                    this.messageSuccess('编辑函数成功')
                    this.handleClose()
                    this.$emit('success-submit')
                }).catch((err) => {
                    if (err?.code === 499) {
                        this.messageHtmlError(err.message)
                    } else {
                        this.messageError(err.message || err)
                    }
                }).finally(() => {
                    this.isSubmitting = false
                })
            },

            submitCreate (form) {
                this.isSubmitting = true
                this.createFunction({
                    ...form,
                    projectId: this.projectId,
                    versionId: this.currentVersionId
                }).then(() => {
                    this.formChanged = false
                    this.messageSuccess('新增函数成功')
                    this.handleClose()
                    this.$emit('success-submit')
                }).catch((err) => {
                    if (err?.code === 499) {
                        this.messageHtmlError(err.message)
                    } else {
                        this.messageError(err.message || err)
                    }
                }).finally(() => {
                    this.isSubmitting = false
                })
            },

            handleClose () {
                const confirmFn = () => {
                    this.$emit('close')
                }
                if (this.formChanged) {
                    this.$bkInfo({
                        title: '请确认是否关闭',
                        subTitle: '存在未保存的函数，关闭后不会保存更改',
                        confirmFn
                    })
                } else {
                    confirmFn()
                }
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .func-form-home {
        padding: 20px 30px;
        /deep/ .func-form-item {
            margin-top: 20px;
        }
        /deep/ .func-title {
            margin: 19px 0 17px;
            padding-left: 4px;
        }
    }
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }
</style>
