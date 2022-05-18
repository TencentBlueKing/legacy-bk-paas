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
            ext-cls="layout-operate-dialog"
        >
            <bk-form ref="dialogForm" class="dialog-form" :label-width="90" :rules="dialog.formRules" :model="dialog.formData">
                <bk-form-item label="模板名称" required property="showName" error-display-type="normal">
                    <bk-input ref="showNameInput"
                        maxlength="60"
                        v-model.trim="dialog.formData.showName"
                        placeholder="请输入名称模板，60个字符以内">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="模板ID" required property="layoutCode" error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.formData.layoutCode"
                        placeholder="以小写字母开头，由字母与数字组成">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="模板路由" required property="routePath" error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.formData.routePath"
                        placeholder="请输入，由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成">
                        <template slot="prepend" v-if="currentLayout.layoutType === 'MOBILE'">
                            <div class="group-text">/mobile</div>
                        </template>
                    </bk-input>
                    <p class="mt5 mb0 f12" slot="tip">模板实例路由将会作为应用一级路由，请谨慎命名</p>
                </bk-form-item>
                <bk-form-item label="布局模板" v-if="action === 'create'" error-display-type="normal">
                    <layout-thumb-list :toolkit="['select']" :list="defaultLayoutList" @change-checked="handleLayoutChecked" />
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
    import LayoutThumbList from '@/components/project/layout-thumb-list'

    export default {
        components: {
            LayoutThumbList
        },
        props: {
            action: {
                type: String,
                default: ''
            },
            currentLayout: {
                type: Object,
                default: () => ({})
            },
            refreshList: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                title: '',
                actionName: '',
                requestMethod: '',
                defaultLayoutList: [],
                dialog: {
                    visible: false,
                    loading: false,
                    formData: {
                        showName: '',
                        routePath: '',
                        layoutCode: '',
                        layoutType: ''
                    },
                    formRules: {
                        showName: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            }
                        ],
                        layoutCode: [
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
                        routePath: [
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
            realRoutePath () {
                return (this.currentLayout.layoutType === 'MOBILE' ? '/mobile/' : '/') + this.dialog.formData.routePath.replace(/^\/+|\/+$/g, '')
            },
            disabled () {
                if (this.action === 'edit') {
                    return (this.dialog.formData.showName === this.currentLayout.showName || !this.dialog.formData.showName)
                        && (this.dialog.formData.layoutCode === this.currentLayout.layoutCode || !this.dialog.formData.layoutCode)
                        && (this.realRoutePath === this.currentLayout.routePath || !this.dialog.formData.routePath)
                }
                return !this.dialog.formData.showName || !this.dialog.formData.routePath
            }
        },
        watch: {
            'dialog.visible' (val) {
                if (val) {
                    setTimeout(() => {
                        this.$refs.showNameInput && this.$refs.showNameInput.$el.querySelector('input').focus()
                    }, 50)

                    if (this.action === 'edit') {
                        this.dialog.formData.showName = this.currentLayout.showName
                        this.dialog.formData.layoutCode = this.currentLayout.layoutCode
                        this.dialog.formData.routePath = this.getDisplayLayoutPath(this.currentLayout.routePath)
                        this.dislog.formData.layoutType = this.currentLayout.layoutType
                    } else {
                        this.dialog.formData.showName = ''
                        this.dialog.formData.layoutCode = ''
                        this.dialog.formData.routePath = ''
                        this.currentLayout.layoutType = ''
                    }
                    this.defaultLayoutList.forEach((item, index) => {
                        item.checked = index === 0
                    })
                }
            },
            action: {
                handler: function (val) {
                    this.title = val === 'create' ? '新建模板' : '修改模板'
                    this.requestMethod = val === 'create' ? 'layout/create' : 'layout/update'
                    this.actionName = val === 'create' ? '新建' : '修改'
                },
                immediate: true
            }
        },
        created () {
            this.getDefaultLayout()
        },
        methods: {
            getDisplayLayoutPath (path) {
                return this.currentLayout.layoutType === 'MOBILE' && path.startsWith('/mobile') ? path.replace('/mobile', '') : path
            },
            async getDefaultLayout () {
                try {
                    const res = await this.$store.dispatch('layout/getPlatformList')
                    const layoutList = res.filter(item => item.type !== 'empty' && item.layoutType !== 'MOBILE')
                    layoutList.forEach((item, index) => {
                        item.checked = index === 0
                    })
                    this.defaultLayoutList = layoutList
                } catch (e) {
                    console.error(e)
                }
            },
            async handleDialogConfirm () {
                this.dialog.loading = true
                try {
                    await this.$refs.dialogForm.validate()
 
                    const formData = {
                        showName: this.dialog.formData.showName,
                        layoutCode: this.dialog.formData.layoutCode,
                        routePath: this.realRoutePath
                    }

                    if (this.action === 'create') {
                        const layoutChecked = this.defaultLayoutList.find(layout => layout.checked)
                        formData.layoutId = layoutChecked.id
                        formData.content = layoutChecked.defaultContent
                    }
                    if (this.action === 'edit') {
                        formData.id = this.currentLayout.id
                        if (formData.showName === this.currentLayout.showName) {
                            delete formData.showName
                        }
                        if (formData.layoutCode === this.currentLayout.layoutCode) {
                            delete formData.layoutCode
                        }
                        if (formData.routePath === this.currentLayout.routePath) {
                            delete formData.routePath
                        }
                    }
                    await this.$store.dispatch('layout/checkName', {
                        data: {
                            ...formData,
                            routePath: this.realRoutePath,
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    })

                    const res = await this.$store.dispatch(this.requestMethod, {
                        data: {
                            layoutData: formData,
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    })
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
                this.dialog.formData.showName = ''
                this.dialog.formData.routePath = ''
            },
            handleLayoutChecked (layout) {
                this.defaultLayoutList.forEach(item => (item.checked = false))
                layout.checked = true
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";

   .dialog-form {
        margin: 30px 0;
        max-height: 446px;
        overflow-y: overlay;
        padding: 0 16px;
        @mixin scroller;
   }
</style>
<style lang="postcss">
    .layout-operate-dialog {
        .bk-dialog-body {
            padding: 3px 6px 26px;
        }
    }
</style>
