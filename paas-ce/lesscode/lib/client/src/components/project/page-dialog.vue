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
                <bk-form-item label="页面类型" required property="pageType" v-if="action !== 'rename'" error-display-type="normal">
                    <div class="bk-button-group">
                        <bk-button
                            :ext-cls="'type-button'"
                            @click="handleChangePageType('PC')"
                            :class="!isMobile ? 'is-selected' : ''">
                            <i class="bk-drag-icon bk-drag-pc"> </i>
                            PC 页面
                        </bk-button>
                        <bk-button
                            :ext-cls="'type-button'"
                            @click="handleChangePageType('MOBILE')"
                            :class="isMobile ? 'is-selected' : ''">
                            <i class="bk-drag-icon bk-drag-mobilephone"> </i>
                            Mobile 页面
                        </bk-button>
                    </div>
                </bk-form-item>
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
                <bk-form-item label="布局模板" v-if="action === 'create'" error-display-type="normal">
                    <layout-thumb-list :toolkit="['select']" :list="layoutList" @change-checked="handleLayoutChecked" />
                    <bk-link theme="primary" class="jump-link" icon="bk-drag-icon bk-drag-jump-link" @click="handleCreateLayout">跳转新建</bk-link>
                </bk-form-item>
                <bk-form-item label="页面路由" required property="pageRoute" v-if="action !== 'rename'"
                    :style="{ marginTop: action === 'create' ? 0 : '' }"
                    error-display-type="normal">
                    <div class="page-route">
                        <div class="mobile-tag" v-if="isMobile">/mobile</div>
                        <bk-input maxlength="60" v-model.trim="dialog.formData.pageRoute"
                            placeholder="由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成">
                            <template slot="prepend">
                                <div class="group-text">
                                    {{layoutRoutePath}}
                                </div>
                            </template>
                        </bk-input>
                    </div>
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
        name: 'page-dialog',
        components: {
            LayoutThumbList
        },
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
                pageCodeOldValue: '',
                layoutList: [],
                layoutListMap: { 'PC': [], 'MOBILE': [] },
                dialog: {
                    visible: false,
                    loading: false,
                    formData: {
                        pageType: 'PC',
                        pageName: '',
                        pageCode: '',
                        pageRoute: '',
                        layoutId: null
                    },
                    formRules: {
                        pageType: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            }
                        ],
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
                },
                selectedLayout: {}
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
            },
            isMobile () {
                return this.dialog.formData.pageType === 'MOBILE'
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
                    this.title = val === 'create' ? '新建页面' : (this.action === 'rename' ? '重命名' : '复制页面')
                    this.requestMethod = val === 'create' ? 'page/create' : (this.action === 'rename' ? 'page/update' : 'page/copy')
                    this.actionName = val === 'create' ? '新建' : (this.action === 'rename' ? '重命名' : '复制')
                },
                immediate: true
            },
            'dialog.formData.layoutId' (layoutId) {
                if (this.action === 'copy' && layoutId) {
                    this.selectedLayout = this.layoutList.find(item => item.id === layoutId)
                }
            }
        },
        created () {
            this.getProjectLayout()
        },
        methods: {
            async getProjectLayout () {
                try {
                    const layoutList = await this.$store.dispatch('layout/getList', { projectId: this.projectId, versionId: this.versionId })
                    const that = this
                    layoutList.forEach(item => {
                        item.checked = item.isDefault === 1
                        item.defaultName = item.showName || item.defaultName
                        // 不需要显示选中态标签
                        item.isDefault = false
                        if (item.layoutType === 'MOBILE') {
                            item.checked = item.type === 'mobile-empty' ? 1 : 0
                            that.layoutListMap['MOBILE'].push(item)
                        } else {
                            that.layoutListMap['PC'].push(item)
                        }
                    })
                    this.layoutList = this.layoutListMap[this.dialog.formData.pageType]
                    this.selectedLayout = this.layoutList.find(item => item.checked) || {}
                } catch (e) {
                    console.error(e)
                }
            },
            async handleDialogConfirm () {
                if (!this.dialog.formData.pageName) return
                this.dialog.loading = true
                try {
                    await this.$refs.dialogForm.validate()

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
                    const payload = {
                        data: {
                            pageData: this.dialog.formData,
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    }
                    if (this.action === 'create') {
                        const { id, routePath } = this.layoutList.find(layout => layout.checked)
                        payload.data.layout = { id, routePath }
                    }
                    const res = await this.$store.dispatch(this.requestMethod, payload)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: `${this.actionName}成功`
                        })
                        this.dialog.visible = false
                        if (this.action === 'create') {
                            this.$router.push({
                                name: 'new',
                                params: {
                                    projectId: this.projectId,
                                    pageId: res
                                }
                            })
                        } else {
                            this.refreshList()
                        }
                    }
                } catch (err) {
                    console.error(err)
                } finally {
                    this.dialog.loading = false
                }
            },
            handleLayoutChecked (layout) {
                this.layoutList.forEach(item => (item.checked = false))
                layout.checked = true
                this.selectedLayout = layout
            },
            handleDialogCancel () {
                this.dialog.visible = false
            },
            handleCreateLayout () {
                this.$router.push({
                    name: 'layout',
                    params: {
                        projectId: this.projectId
                    }
                })
                setTimeout(() => {
                    this.dialog.visible = false
                }, 160)
            },
            handleChangePageType (pageType) {
                this.dialog.formData.pageType = pageType
                this.layoutList = this.layoutListMap[this.dialog.formData.pageType]
                this.selectedLayout = this.layoutList.find(item => item.checked) || {}
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

        .jump-link {
            margin-top: -16px;
        }

        /deep/ {
            .bk-form-control.control-prepend-group {
                background: #fff;
            }
            .bk-form-control .group-box .group-text {
                line-height: 30px;
                padding: 0 8px;
            }
        }

        .bk-button-group {
            .type-button{
                width: 310px;

                i {
                    font-size: 18px;
                    margin-right: 3px;
                    color: #979ba5;
                }
            }

             .is-selected i {
                 color: #3a84ff;
             }
        }

        .page-route{
            display: flex;

            .mobile-tag{
                color: #63656e;
                padding: 0 15px;
                font-size: 12px;
                border: 1px solid #c4c6cc;
                border-radius: 2px 0 0 2px;
                background-color: #f2f4f8;
                border-right: none;
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
