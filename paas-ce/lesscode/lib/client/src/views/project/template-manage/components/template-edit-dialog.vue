<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            theme="primary"
            title="编辑模板"
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
                <section v-if="isSuperAdmin" style="margin-top: 20px;">
                    <bk-form-item label="设置为公开模板" required property="isOffcial" error-display-type="normal">
                        <bk-radio-group v-model="dialog.formData.isOffcial">
                            <bk-radio :value="1" style="margin-right: 20px;">是</bk-radio>
                            <bk-radio :value="0">否</bk-radio>
                        </bk-radio-group>
                    </bk-form-item>
                    <bk-form-item label="公开模板分类" required property="offcialType" error-display-type="normal">
                        <bk-select
                            :clearable="false"
                            v-model="dialog.formData.offcialType"
                        >
                            <bk-option v-for="item in offcialTypeList" :id="item.id" :name="item.name" :key="item.id">
                            </bk-option>
                        </bk-select>
                    </bk-form-item>
                </section>
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
    // import { mapGetters } from 'vuex'
    import { PAGE_TEMPLATE_TYPE } from '@/common/constant'

    export default {
        name: 'template-dialog',
        data () {
            return {
                isSuperAdmin: true,
                isShow: false,
                categoryList: [],
                offcialTypeList: PAGE_TEMPLATE_TYPE,
                templateId: '',
                dialog: {
                    loading: false,
                    formData: {
                        templateName: '',
                        categoryId: '',
                        isOffcial: 0,
                        offcialType: ''
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
                    const data = {
                        id: this.templateId,
                        params: {
                            templateName: this.dialog.formData.templateName,
                            categoryId: this.dialog.formData.categoryId
                        }
                    }
                    const res = await this.$store.dispatch('pageTemplate/update', data)
                    console.log(res, 235)
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
        /* z-index: 2000 !important; */
        .bk-dialog-body {
            padding: 10px 15px 25px;
        }
    }
</style>
