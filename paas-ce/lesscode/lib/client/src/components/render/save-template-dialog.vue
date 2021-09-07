<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            theme="primary"
            title="存为模板"
            width="600"
            :mask-close="false"
            :auto-close="false"
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
                <bk-button @click="toggleIsShow(false)" :disabled="dialog.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import html2canvas from 'html2canvas'
    import { bus } from '@/common/bus'

    export default {
        name: 'template-dialog',
        props: {
            isShow: {
                type: Boolean,
                required: true
            },
            toggleIsShow: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
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
            ...mapGetters('drag', [
                'curSelectedComponentData'
            ]),
            ...mapGetters('page', [
                'pageDetail'
            ]),
            projectId () {
                return this.$route.params.projectId
            }
        },
        watch: {
            isShow (val) {
                if (val) {
                    setTimeout(() => {
                        this.$refs.nameInput && this.$refs.nameInput.$el.querySelector('input').focus()
                    }, 50)
                }
            }
        },
        created () {
            this.getTemplateCategory()
        },
        methods: {
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
                    html2canvas(document.querySelector(`div[data-component-id="${this.curSelectedComponentData.name}-${this.curSelectedComponentData.componentId}"]`)).then(async (canvas) => {
                        try {
                            const imgData = canvas.toDataURL('image/png')
                            const data = {
                                projectId: this.projectId,
                                params: {
                                    templateName: this.dialog.formData.templateName,
                                    categoryId: this.dialog.formData.categoryId,
                                    belongProjectId: this.projectId,
                                    fromPageCode: this.pageDetail && this.pageDetail.pageCode,
                                    content: JSON.stringify(this.curSelectedComponentData),
                                    previewImg: imgData
                                }
                            }
                            
                            const res = await this.$store.dispatch('pageTemplate/create', data)
                            if (res) {
                                this.dialog.loading = false
                                this.$bkMessage({
                                    theme: 'success',
                                    message: `另存为模板成功`
                                })
                                this.toggleIsShow(false)
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
                    })
                } catch (err) {
                    this.dialog.loading = false
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                }
            }
        }
    }
</script>

<style lang="postcss">
    .template-operate-dialog {
        z-index: 2000 !important;
        .bk-dialog-body {
            padding: 10px 15px 25px;
        }
    }
</style>
