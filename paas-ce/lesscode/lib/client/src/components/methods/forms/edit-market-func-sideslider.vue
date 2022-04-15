<template>
    <bk-sideslider
        :is-show="isShow"
        :quick-close="true"
        :width="796"
        :title="form.id ? '编辑函数' : '新建函数'"
        :before-close="confirmClose"
        @hidden="handleClose">
        <section class="func-form-home" slot="content">
            <form-name :form.sync="form" ref="name" :function-list="functionList"></form-name>
            <form-detail :form.sync="form" ref="detail"></form-detail>
            <form-api-data :form.sync="form" ref="apiData"></form-api-data>
            <form-summary :form.sync="form" :require-summary="true" ref="summary"></form-summary>
            <form-monaco :form.sync="form" :function-list="[]" class="mt20" ref="monaco"></form-monaco>
        </section>
        <section slot="footer" class="add-footer">
            <bk-button theme="primary" @click="submitAddMarketFunc" :loading="isLoading">提交</bk-button>
            <bk-button @click="handleClose">取消</bk-button>
        </section>
    </bk-sideslider>
</template>

<script>
    import mixins from './form-mixins'
    import { mapActions } from 'vuex'
    import { messageHtmlError } from '@/common/bkmagic'

    export default {
        mixins: [mixins],

        props: {
            functionList: Array,
            isShow: Boolean,
            title: String
        },

        data () {
            return {
                isLoading: false
            }
        },

        methods: {
            ...mapActions('functionMarket', [
                'createFunction',
                'updateFunction'
            ]),

            submitAddMarketFunc () {
                this.validate().then((postData) => {
                    this.isLoading = true
                    const curMethod = this.form.id
                        ? this.updateFunction
                        : this.createFunction
                    curMethod(postData).then(() => {
                        this.formChanged = false
                        this.$emit('refresh')
                        this.handleClose()
                    }).catch((err) => {
                        if (err?.code === 499) {
                            messageHtmlError(err.message)
                        } else {
                            this.messageError(err.message || err)
                        }
                    }).finally(() => {
                        this.isLoading = false
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
