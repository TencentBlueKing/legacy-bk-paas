<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            title="存为模板"
            width="600"
            :mask-close="false"
            :auto-close="false"
            :close-icon="false"
            :esc-icon="false"
            :draggable="false"
            header-position="left"
            ext-cls="template-operate-dialog"
        >
            <bk-form ref="pageTemplateFrom" class="dialog-form" :label-width="86" :rules="dialog.formRules" :model="dialog.formData">
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
                <bk-button @click="closeDialog" :disabled="dialog.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import LC from '@/element-materials/core'
    import { mapGetters } from 'vuex'
    import html2canvas from 'html2canvas'
    import { bus } from '@/common/bus'

    export default {
        name: 'template-dialog',
        data () {
            return {
                isShow: false,
                isWholePage: false,
                categoryList: [],
                dialog: {
                    loading: false,
                    formData: {
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
            ...mapGetters('page', [
                'pageDetail'
            ]),
            ...mapGetters('layout', ['pageLayout']),
            projectId () {
                return this.$route.params.projectId
            }
        },
        watch: {
            isShow (val) {
                if (val) {
                    this.getTemplateCategory()
                    setTimeout(() => {
                        this.$refs.nameInput && this.$refs.nameInput.$el.querySelector('input').focus()
                    }, 50)
                } else {
                    this.dialog.formData.templateName = ''
                    this.dialog.formData.categoryId = ''
                }
            }
        },
        created () {
            this.eventData = {}
            const showCallback = (event) => {
                this.isShow = true
                this.eventData = event
            }
            LC.addEventListener('saveTemplate', showCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('saveTemplate', showCallback)
            })
        },
        methods: {
            async getTemplateCategory () {
                try {
                    this.categoryList = await this.$store.dispatch('pageTemplate/categoryList', { projectId: this.projectId })
                    this.dialog.formData.categoryId = (this.categoryList[0] && this.categoryList[0].id) || ''
                } catch (e) {
                    this.categoryList = []
                }
            },
            async handleDialogConfirm () {
                await this.$refs.pageTemplateFrom.validate()
                
                this.dialog.loading = true
                const $rootElm = this.eventData.target.$elm
                html2canvas($rootElm).then(async (canvas) => {
                    try {
                        const imgData = canvas.toDataURL('image/png')
                        
                        const data = {
                            projectId: this.projectId,
                            params: {
                                templateName: this.dialog.formData.templateName,
                                categoryId: this.dialog.formData.categoryId,
                                belongProjectId: this.projectId,
                                templateType: this.pageDetail.pageType,
                                versionId: this.versionId,
                                fromPageCode: this.pageDetail && this.pageDetail.pageCode,
                                content: JSON.stringify(this.eventData.value),
                                previewImg: imgData
                            }
                        }
                        const res = await this.$store.dispatch('pageTemplate/create', data)
                        if (res) {
                            this.dialog.loading = false
                            this.$bkMessage({
                                theme: 'success',
                                message: '另存为模板成功'
                            })
                            this.isShow = false
                            bus.$emit('update-template-list')
                        }
                    } catch (err) {
                        this.$bkMessage({
                            theme: 'error',
                            message: err.message || err
                        })
                    } finally {
                        this.dialog.loading = false
                    }
                }).catch((err) => {
                    this.dialog.loading = false
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                })
            },
            closeDialog () {
                this.isShow = false
            }
        }
    }
</script>

<style lang="postcss">
    .template-operate-dialog {
        z-index: 2100 !important;
        .bk-dialog-body {
            padding: 10px 15px 25px;
        }
    }
</style>
