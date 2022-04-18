<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            theme="primary"
            :title="dialogTitle"
            width="600"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="template-import-dialog"
        >
            <bk-form ref="pageTemplateFrom" class="import-dialog-form" :label-width="120" :rules="dialog.formRules" :model="dialog.formData">
                <bk-form-item label="导入模板json" required property="templateName" error-display-type="normal">
                    <bk-upload
                        with-credentials
                        :multiple="false"
                        :url="uploadUrl"
                        :limit="1"
                        accept=".json"
                        @on-success="handleUploadSuccess"
                        @on-error="handleUploadReset"
                        @on-delete="handleUploadReset"
                    ></bk-upload>
                </bk-form-item>
                <bk-form-item label="模板名称" required property="templateName" error-display-type="normal">
                    <bk-input ref="nameInput"
                        maxlength="60"
                        v-model.trim="dialog.formData.templateName"
                        placeholder="请输入模板名称，50个字符以内">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="模板分类" required property="categoryId" error-display-type="normal">
                    <bk-select
                        :clearable="false"
                        v-model="dialog.formData.categoryId"
                    >
                        <bk-option v-for="item in categoryList" :id="item.id" :name="item.name" :key="item.id">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="dialog.loading"
                    @click="handleDialogConfirm">确定</bk-button>
                <bk-button :disabled="dialog.loading" @click="() => isShow = false">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import templateMixin from './template-mixin'

    export default {
        name: 'template-import-dialog',
        mixins: [templateMixin],
        props: {
            actionType: {
                type: String,
                default: 'update'
            },
            refreshList: {
                type: Function
            }
        },
        data () {
            return {
                isShow: false,
                categoryList: [],
                templateJson: {},
                dialog: {
                    loading: false,
                    formData: {
                        jsonStr: '',
                        templateName: '',
                        categoryId: ''
                    },
                    formRules: {
                        templateName: [
                            {
                                required: true,
                                message: '必填项',
                                trigger: 'blur'
                            },
                            {
                                max: 50,
                                message: '名称不能超过40个字符',
                                trigger: 'blur'
                            }
                        ],
                        categoryId: [
                            {
                                required: true,
                                message: '必选项',
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
            dialogTitle () {
                return '导入模板'
            },
            uploadUrl () {
                return `${AJAX_URL_PREFIX}/page/importJson`
            }
        },
        watch: {
            isShow (val) {
                if (val) {
                    this.dialog.formData.categoryId = (this.categoryList[0] && this.categoryList[0].id) || ''
                }
            }
        },
        created () {
            this.getTemplateCategory()
        },
        methods: {
            handleUploadSuccess (res) {
                this.dialog.formData.jsonStr = res.responseData.data
                this.templateJson = JSON.parse(res.responseData.data)
                if (typeof this.templateJson.template !== 'object' || typeof this.templateJson.vars !== 'object' || typeof this.templateJson.functions !== 'object') {
                    this.$$bkMessage({
                        theme: 'error',
                        message: '请上传符合规范的模板json'
                    })
                    return
                }
                this.dialog.formData.templateName = this.templateJson.template.templateName
            },
            handleUploadReset () {
                this.dialog.formData.jsonStr = ''
                this.templateJson = {}
            },
            async getTemplateCategory () {
                try {
                    this.categoryList = await this.$store.dispatch('pageTemplate/categoryList', { projectId: this.projectId })
                } catch (e) {
                    this.categoryList = []
                }
            },
            async handleDialogConfirm () {
                await this.$refs.pageTemplateFrom.validate()
                try {
                    this.dialog.loading = true
                    const { template, vars } = this.templateJson
                    Object.assign(template, { templateName: this.dialog.formData.templateName, categoryId: this.dialog.formData.categoryId, belongProjectId: this.projectId, fromPageCode: '', isOffcial: 0, offcialType: '', parentId: 0 })
                    const newVars = (vars.length && vars.map(item => ({
                        ...item,
                        projectId: this.projectId,
                        pageCode: '',
                        effectiveRange: 0
                    }))) || []
                    Object.assign(this.templateJson, { belongProjectId: this.projectId, versionId: this.versionId, template, vars: newVars })
                    
                    const res = await this.$store.dispatch('pageTemplate/import', this.templateJson)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: '导入成功'
                        })
                        this.refreshList()
                        this.isShow = false
                    }
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.dialog.loading = false
                }
            }
        }
    }
</script>

<style lang="postcss">
    .template-import-dialog {
        /* z-index: 2008 !important; */
        .bk-dialog-body {
            padding: 0 30px 30px;
        }
    }
</style>
