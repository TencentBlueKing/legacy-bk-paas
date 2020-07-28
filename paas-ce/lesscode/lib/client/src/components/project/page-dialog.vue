<template>
    <section>
        <bk-dialog v-model="dialog.visible"
            theme="primary"
            :title="title"
            width="600"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="page-operate-dialog"
        >
            <bk-form ref="dialogForm" class="dialog-form" :label-width="90" :rules="dialog.formRules" :model="dialog.formData">
                <bk-form-item label="页面名称" required property="pageName">
                    <bk-input ref="projectDialogInput"
                        maxlength="60"
                        v-model="dialog.formData.pageName"
                        placeholder="请输入页面名称，60个字符以内">
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :disabled="currentName === dialog.formData.pageName || !dialog.formData.pageName"
                    :loading="dialog.loading"
                    @click="handleDialogConfirm">确定</bk-button>
                <bk-button @click="handleDialogCancel" :disabled="dialog.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    export default {
        name: 'page-dialog',
        props: {
            action: {
                type: String,
                default: ''
            },
            currentName: {
                type: String,
                default: ''
            },
            reflashList: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                preName: '',
                title: '',
                actionName: '',
                requestMethod: '',
                dialog: {
                    visible: false,
                    loading: false,
                    formData: {
                        pageName: ''
                    },
                    formRules: {
                        pageName: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            }
                        ]
                    }
                }
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        watch: {
            'dialog.visible' (val) {
                if (val) {
                    setTimeout(() => {
                        this.$refs.projectDialogInput && this.$refs.projectDialogInput.$el.querySelector('input').focus()
                    }, 50)
                }
            },
            action (val) {
                this.title = val === 'create' ? '新建页面' : (this.action === 'rename' ? '重命名' : '复制页面')
                this.requestMethod = val === 'create' ? 'page/create' : (this.action === 'rename' ? 'page/update' : 'page/copy')
                this.actionName = val === 'create' ? '新建' : (this.action === 'rename' ? '重命名' : '复制')
            }
        },
        methods: {
            async handleDialogConfirm () {
                if (!this.dialog.formData.pageName) return
                this.dialog.loading = true
                try {
                    const nameExist = await this.$store.dispatch('page/checkName', {
                        data: {
                            pageName: this.dialog.formData.pageName,
                            projectId: this.projectId
                        }

                    })
                    if (nameExist) return
                    const res = await this.$store.dispatch(this.requestMethod, {
                        data: {
                            pageData: this.dialog.formData,
                            projectId: this.projectId
                        }
                    })
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: `${this.actionName}成功`
                        })
                        this.dialog.visible = false
                        // TODO: 路由连起来之后再跳转
                        // if (this.action === 'create') {
                        //     this.$router.push('/')
                        // } else {
                        //     this.reflashList()
                        // }
                        this.reflashList()
                    }
                } catch (err) {
                    console.error(err)
                } finally {
                    this.dialog.loading = false
                }
            },
            handleDialogCancel () {
                this.dialog.visible = false
            }
        }
    }
</script>

<style lang="postcss" scoped>
   .dialog-form {
       margin: 30px 0;
   }
</style>
