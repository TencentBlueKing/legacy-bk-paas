<template>
    <section>
        <bk-dialog v-model="dialog.visible"
            render-directive="if"
            theme="primary"
            :title="title"
            width="750"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="page-operate-dialog"
        >
            <bk-form ref="dialogForm" class="dialog-form" :label-width="86" :rules="dialog.formRules" :model="dialog.formData">
                <bk-form-item label="页面名称" required property="pageName" error-display-type="normal">
                    <bk-input ref="projectDialogInput"
                        maxlength="60"
                        v-model.trim="dialog.formData.pageName"
                        placeholder="请输入页面名称，60个字符以内">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="页面ID" required property="pageCode" v-if="action !== 'rename'" error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.formData.pageCode"
                        placeholder="以小写字母开头，由字母与数字组成，创建后不可更改">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="页面路由" required property="pageRoute" v-if="action !== 'rename'"
                    error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.formData.pageRoute"
                        placeholder="由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成">
                        <template slot="prepend">
                            <div class="group-text">
                                {{layoutRoutePath}}
                            </div>
                        </template>
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :disabled="disabled"
                    :loading="dialog.loading"
                    @click="handleDialogConfirm">确定</bk-button>
                <bk-button @click="handleDialogCancel" :disabled="dialog.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { compile } from 'path-to-regexp'
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
            refreshList: {
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
                layoutId: '',
                layoutList: [],
                selectedLayout: {},
                dialog: {
                    visible: false,
                    loading: false,
                    formData: {
                        id: '',
                        pageName: '',
                        pageCode: '',
                        pageRoute: ''
                    },
                    formRules: {
                        pageName: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            }
                        ],
                        pageCode: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            },
                            {
                                regex: /^[a-z][a-zA-Z0-9]{0,60}$/,
                                message: '以小写字母开头，由字母与数字组成',
                                trigger: 'blur'
                            }
                        ],
                        pageRoute: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            },
                            {
                                validator: function (value) {
                                    try {
                                        compile(value)
                                        if (!/^[\w-_:\/?]+$/.test(value)) {
                                            this.message = '由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成'
                                            return false
                                        } else if (/\/{2,}/.test(value)) {
                                            this.message = '请检查路径正确性'
                                            return false
                                        }
                                    } catch (e) {
                                        this.message = '请检查路径正确性'
                                        return false
                                    }
                                    return true
                                },
                                trigger: 'blur'
                            }
                        ]
                    }
                }
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            projectId () {
                return this.$route.params.projectId
            },
            disabled () {
                if (this.action === 'rename') {
                    return this.currentName === this.dialog.formData.pageName || !this.dialog.formData.pageName
                }
                return !this.dialog.formData.pageName || !this.dialog.formData.pageCode || !this.dialog.formData.pageRoute
            },
            layoutRoutePath () {
                const { routePath } = this.selectedLayout
                if (routePath) {
                    return routePath.endsWith('/') ? routePath : `${routePath}/`
                }
                return ''
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
            action: {
                handler: function (val) {
                    this.title = this.action === 'rename' ? '重命名' : '复制页面'
                    this.requestMethod = this.action === 'rename' ? 'page/update' : 'page/copy'
                    this.actionName = this.action === 'rename' ? '重命名' : '复制'
                },
                immediate: true
            },
            layoutId (layoutId) {
                if (this.action === 'copy' && layoutId) {
                    this.selectedLayout = this.layoutList.find(item => item.id === layoutId)
                }
            }
        },
        async created () {
            this.layoutList = await this.$store.dispatch('layout/getList', { projectId: this.projectId, versionId: this.versionId })
        },
        methods: {
            async handleDialogConfirm () {
                this.dialog.loading = true
                try {
                    await this.$refs.dialogForm.validate()

                    // 先校验是否重名
                    const formData = {
                        pageName: this.dialog.formData.pageName
                    }
                    if (this.action !== 'rename') {
                        formData.pageCode = this.dialog.formData.pageCode
                    }
                    const nameExist = await this.$store.dispatch('page/checkName', {
                        data: {
                            ...formData,
                            projectId: this.projectId,
                            versionId: this.versionId,
                            currentName: this.currentName,
                            from: this.action
                        }
                    })
                    if (nameExist) return

                    // 提交复制或重名数据
                    const pageData = this.action === 'copy' ? this.dialog.formData : { id: this.dialog.formData.id, pageName: this.dialog.formData.pageName }
                    const payload = {
                        data: {
                            pageData,
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    }
                    const res = await this.$store.dispatch(this.requestMethod, payload)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: `${this.actionName}成功`
                        })
                        this.dialog.visible = false
                        this.refreshList()
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
    @import "@/css/mixins/scroller";

    .dialog-form {
        max-height: 446px;
        overflow-y: overlay;
        padding: 0 16px;
        @mixin scroller;

        /deep/ {
            .bk-form-control.control-prepend-group {
                background: #fff;
            }
            .bk-form-control .group-box .group-text {
                line-height: 30px;
                padding: 0 8px;
            }
        }
    }
</style>
<style lang="postcss">
    .page-operate-dialog {
        .bk-dialog-body {
            padding: 3px 6px 26px;
        }
    }
</style>
