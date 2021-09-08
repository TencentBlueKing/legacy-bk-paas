<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            theme="primary"
            title="设置模板"
            width="600"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="set-template-dialog"
        >
            <bk-form ref="pageTemplateFrom" class="dialog-form" :label-width="120">
                <bk-form-item label="设为项目模板" required property="isOffcial" error-display-type="normal">
                    <bk-radio-group v-model="formData.isOffcial">
                        <bk-radio :value="1" style="margin-right: 20px;">是</bk-radio>
                        <bk-radio :value="0">否</bk-radio>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item label="项目模板分类" required property="offcialType" error-display-type="normal">
                    <bk-select
                        :clearable="false"
                        v-model="formData.offcialType"
                    >
                        <bk-option v-for="item in offcialTypeList" :id="item.id" :name="item.name" :key="item.id">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="isLoading"
                    @click="handleDialogConfirm">确定</bk-button>
                <bk-button :disabled="isLoading" @click="() => isShow = false">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { PROJECT_TEMPLATE_TYPE } from '@/common/constant'

    export default {
        name: 'template-dialog',
        props: {
            refreshList: {
                type: Function
            }
        },
        data () {
            return {
                projectId: 0,
                isShow: false,
                isLoading: false,
                offcialTypeList: PROJECT_TEMPLATE_TYPE,
                formData: {
                    isOffcial: 0,
                    offcialType: ''
                }
            }
        },
        methods: {
            async handleDialogConfirm () {
                try {
                    this.isLoading = true
                    let params = {}
                    if (this.formData.isOffcial && !this.formData.offcialType) {
                        this.$bkMessage({
                            theme: 'error',
                            message: '模板分类不能为空'
                        })
                        return
                    } else {
                        params = {
                            isOffcial: this.formData.isOffcial,
                            offcialType: this.formData.isOffcial ? this.formData.offcialType : ''
                        }
                    }
                    const data = {
                        id: this.projectId,
                        fields: params
                    }
                    const res = await this.$store.dispatch('project/update', { data })
                    if (res) {
                        this.isShow = false
                        this.refreshList()
                        this.$bkMessage({
                            theme: 'success',
                            message: '设置成功'
                        })
                    }
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.isLoading = false
                }
            }
        }
    }
</script>

<style lang="postcss">
    .template-edit-dialog {
        /* z-index: 2008 !important; */
        .bk-dialog-body {
            padding: 10px 15px 25px;
        }
    }
</style>
