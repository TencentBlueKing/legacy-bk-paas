<template>
    <main class="func-main">
        <section class="func-form-home">
            <section class="func-form-main">
                <form-market
                    v-if="!form.id"
                    :form.sync="form"
                    ref="market"
                    form-type="vertical">
                </form-market>
                <form-name
                    :function-list="functionList"
                    :form.sync="form"
                    ref="name"
                    form-type="vertical">
                </form-name>
                <form-code
                    :function-list="functionList"
                    :form.sync="form"
                    :disabled="!!form.id"
                    ref="code"
                    form-type="vertical">
                </form-code>
                <form-group
                    :form.sync="form"
                    ref="group"
                    form-type="vertical"
                ></form-group>
                <form-detail
                    :form.sync="form"
                    ref="detail"
                    form-type="vertical">
                </form-detail>
                <form-api-data
                    :form.sync="form"
                    ref="apiData"
                    form-type="vertical">
                </form-api-data>
                <form-summary
                    :form.sync="form"
                    ref="summary"
                    form-type="vertical">
                </form-summary>
            </section>
            <form-monaco
                height="100%"
                class="monaco"
                ref="monaco"
                :form.sync="form"
                :function-list="functionList"
                :variable-list="variableList"
            >
                <template v-slot:tools>
                    <i class="bk-drag-icon bk-drag-close-line icon-style" @click="handleClose"></i>
                </template>
            </form-monaco>
        </section>
        <footer class="main-footer">
            <bk-button
                class="mr5"
                theme="primary"
                :loading="isSubmitting"
                :disabled="!formChanged"
                @click="handleSaveFunction"
            >保存</bk-button>
            <bk-button
                v-if="eventData"
                :loading="isSubmitting"
                :disabled="!formChanged"
                @click="handleSaveChooseFunction"
            >保存并使用</bk-button>
        </footer>
    </main>
</template>

<script>
    import mixins from './form-mixins'
    import { mapGetters, mapActions } from 'vuex'
    import LC from '@/element-materials/core'

    export default {
        mixins: [mixins],

        props: {
            eventData: Object
        },

        data () {
            return {
                isSubmitting: false
            }
        },

        computed: {
            ...mapGetters('projectVersion', ['currentVersionId']),
            ...mapGetters('variable', ['variableList']),
            ...mapGetters('functions', ['functionList']),

            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },

        methods: {
            ...mapActions('functions', [
                'editFunction',
                'createFunction',
                'getAllGroupAndFunction'
            ]),

            handleClose () {
                const confirmFn = () => {
                    this.$emit('close')
                }
                const monacoRef = this.$refs?.monaco?.$refs?.monaco
                if (monacoRef?.isFull) {
                    monacoRef?.exitFullScreen()
                } else if (this.formChanged) {
                    this.$bkInfo({
                        title: '请确认是否关闭',
                        subTitle: '存在未保存的函数，关闭后不会保存更改',
                        confirmFn
                    })
                } else {
                    confirmFn()
                }
            },

            handleSaveChooseFunction () {
                this.handleSaveFunction().then(() => {
                    // 设置 event
                    LC(this.eventData.componentId).mergeRenderEvents({
                        [this.eventData.eventName]: {
                            methodCode: this.form.funcCode
                        }
                    })
                    // 关闭弹框
                    this.handleClose()
                })
            },

            handleSaveFunction () {
                return new Promise(async (resolve, reject) => {
                    try {
                        this.isSubmitting = true
                        const form = await this.validate()
                        if (form.id) {
                            await this.submitEdit(form)
                        } else {
                            await this.submitCreate(form)
                        }
                        resolve()
                    } catch (err) {
                        if (err?.code === 499) {
                            this.messageHtmlError(err.message)
                        } else if (err?.content) {
                            this.messageError(err.content || err)
                        } else {
                            this.messageError(err.message || err)
                        }
                        reject(err)
                    } finally {
                        this.isSubmitting = false
                        this.refreshLayoutFunctionList()
                    }
                })
            },

            submitEdit (form) {
                return this.editFunction(form).then(() => {
                    this.formChanged = false
                    this.messageSuccess('编辑函数成功')
                    this.$emit('success-save')
                })
            },

            submitCreate (form) {
                return this.createFunction({
                    ...form,
                    projectId: this.projectId,
                    versionId: this.currentVersionId
                }).then(() => {
                    this.formChanged = false
                    this.messageSuccess('新增函数成功')
                    this.$emit('success-save')
                })
            },

            refreshLayoutFunctionList () {
                this.getAllGroupAndFunction({
                    projectId: this.projectId,
                    versionId: this.currentVersionId
                }).then((functionData) => {
                    this.$store.commit('functions/setFunctionData', functionData)
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .func-main {
        height: 100%;
        .func-form-home {
            height: calc(100% - 50px);
            overflow: hidden;
        }
    }
    .func-form-main {
        float: left;
        width: 350px;
        height: 100%;
        overflow-y: auto;
        margin: 7px 0;
        padding: 0 20px 20px;
        /deep/ .func-form-item {
            margin-top: 8px;
        }
        /deep/ .func-market-home {
            padding: 8px 12px 16px;
        }
        /deep/ .func-title {
            margin: 16px 0 8px;
        }
        &::-webkit-scrollbar {
            width: 6px;
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: #dcdee5;
            -webkit-box-shadow: inset 0 0 6px hsla(0, 0%, 80%, .3);
        }
    }
    .main-footer {
        padding: 9px 20px;
        height: 50px;
        background: #fafbfd;
        border: 1px solid #dcdee5;
    }
    .monaco {
        margin: 0;
        height: 100%;
        margin-left: 350px;
    }
</style>
