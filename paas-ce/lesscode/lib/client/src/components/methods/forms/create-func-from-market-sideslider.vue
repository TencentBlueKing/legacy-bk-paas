<template>
    <bk-sideslider
        title="添加至应用"
        :is-show.sync="isShow"
        :quick-close="true"
        :width="796"
        :before-close="confirmClose"
        @hidden="handleClose">
        <section class="func-form-home" slot="content">
            <form-project
                ref="project"
                :form.sync="form"
            ></form-project>
            <form-name
                ref="name"
                :form.sync="form"
                :function-list="functionList"
                v-bkloading="{ isLoading }"
            ></form-name>
            <form-code
                ref="code"
                :form.sync="form"
                :function-list="functionList"
                v-bkloading="{ isLoading }"
            ></form-code>
            <form-group
                ref="group"
                :form.sync="form"
            ></form-group>
            <form-detail
                ref="detail"
                :form.sync="form"
            ></form-detail>
            <form-api-data
                ref="apiData"
                :form.sync="form"
            ></form-api-data>
            <form-summary
                ref="summary"
                :form.sync="form"
            ></form-summary>
            <form-monaco
                class="mt20"
                ref="monaco"
                :form.sync="form"
                :function-list="functionList"
                :variable-list="variableList"
            ></form-monaco>
        </section>
        <section slot="footer" class="add-footer">
            <bk-button theme="primary" @click="submitAddFuncFromMarket" :loading="isSubmitting">提交</bk-button>
            <bk-button @click="handleClose">取消</bk-button>
        </section>
    </bk-sideslider>
</template>

<script>
    import mixins from './form-mixins'
    import { mapGetters, mapActions } from 'vuex'
    import { messageHtmlError } from '@/common/bkmagic'

    export default {
        mixins: [mixins],

        props: {
            isShow: Boolean
        },

        data () {
            return {
                functionList: [],
                variableList: [],
                isLoading: false,
                isSubmitting: false
            }
        },

        computed: {
            ...mapGetters('projectVersion', ['currentVersionId'])
        },

        watch: {
            'form.projectId' (val) {
                if (val) {
                    this.freshList()
                } else {
                    this.clearData()
                }
            }
        },

        methods: {
            ...mapActions('functions', ['getFunctionList']),
            ...mapActions('functionMarket', ['createFunctionFromMarket']),
            ...mapActions('variable', ['getAllProjectVariable']),

            freshList () {
                this.isLoading = true
                const query = {
                    projectId: this.form.projectId,
                    versionId: this.currentVersionId
                }
                Promise.all([
                    this.getFunctionList(query),
                    this.getAllProjectVariable({
                        ...query,
                        effectiveRange: 0
                    })
                ]).then(([functionList, variableList]) => {
                    this.functionList = functionList || []
                    this.variableList = variableList || []
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoading = false
                })
            },

            clearData () {
                this.functionList = []
                this.variableList = []
            },

            submitAddFuncFromMarket () {
                this.validate().then(({ id: funcMarketId, ...functionData }) => {
                    this.isSubmitting = true
                    const postData = {
                        functionData,
                        funcMarketId
                    }
                    this.createFunctionFromMarket(postData).then(() => {
                        this.formChanged = false
                        this.messageSuccess('添加成功')
                        this.handleClose()
                    }).catch((err) => {
                        if (err?.code === 499) {
                            messageHtmlError(err.message)
                        } else {
                            this.messageError(err.message || err)
                        }
                    }).finally(() => {
                        this.isSubmitting = false
                    })
                }).catch((validator) => {
                    this.$bkMessage({ message: validator.content || validator, theme: 'error' })
                })
            },

            confirmClose () {
                if (this.formChanged) {
                    this.$bkInfo({
                        title: '请确认是否关闭',
                        subTitle: '存在未保存的函数，关闭后不会保存更改',
                        confirmFn: this.handleClose
                    })
                } else {
                    this.handleClose()
                }
            },

            handleClose () {
                this.$emit('update:isShow', false)
                this.$emit('update:funcData', {})
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
        /deep/ .func-form-bottom {
            margin-bottom: 20px;
        }
    }
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }
</style>
