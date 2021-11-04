<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            title="存为模板"
            width="600"
            :show-mask="true"
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
                <bk-button @click="toggleIsShow(false)" :disabled="dialog.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import html2canvas from 'html2canvas'
    import safeStringify from '@/common/json-safe-stringify'
    import { uuid } from '@/common/util'
    import { bus } from '@/common/bus'

    const initGridData = {
        componentId: 'grid-' + uuid(),
        renderKey: uuid(),
        name: 'grid',
        type: 'render-grid',
        tabPanelActive: 'props',
        renderProps: {
            'margin-horizontal': {
                type: 'number',
                val: 0
            },
            'margin-vertical': {
                type: 'number',
                val: 0
            }
        },
        renderStyles: {},
        renderEvents: {},
        renderDirectives: [],
        renderSlots: {
            default: {
                type: 'column',
                val: [{ span: 1, children: [], width: '100%' }]
            }
        }
    }

    export default {
        name: 'template-dialog',
        props: {
            isShow: {
                type: Boolean,
                required: true
            },
            isWholePage: {
                type: Boolean,
                default: false
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
                'targetData',
                'curSelectedComponentData'
            ]),
            ...mapGetters('page', [
                'pageDetail'
            ]),
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('components', ['interactiveComponents']),
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
                    this.dialog.formData.categoryId = (this.categoryList[0] && this.categoryList[0].id) || ''
                } catch (e) {
                    this.categoryList = []
                }
            },
            async handleDialogConfirm () {
                await this.$refs.pageTemplateFrom.validate()
                try {
                    this.dialog.loading = true
                    
                    const className = this.isWholePage ? (this.pageLayout && this.pageLayout.layoutType !== 'empty' ? '.container-content' : '.main-content') : `div[data-component-id="${this.curSelectedComponentData.name}-${this.curSelectedComponentData.componentId}"]`
                    html2canvas(document.querySelector(className)).then(async (canvas) => {
                        try {
                            const imgData = canvas.toDataURL('image/png')
                            let content = {}
                            if (this.isWholePage) {
                                if (this.targetData.length === 1) {
                                    content = this.targetData[0]
                                } else if (this.targetData.length > 1) {
                                    content = Object.assign({}, initGridData)
                                    const children = this.targetData.filter(component => !this.interactiveComponents.includes(component.type))
                                    content.renderSlots.default.val[0].children = children
                                }
                            } else {
                                content = this.curSelectedComponentData
                            }
                            
                            const data = {
                                projectId: this.projectId,
                                params: {
                                    templateName: this.dialog.formData.templateName,
                                    categoryId: this.dialog.formData.categoryId,
                                    belongProjectId: this.projectId,
                                    fromPageCode: this.pageDetail && this.pageDetail.pageCode,
                                    content: safeStringify(content),
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
        background: rgba(0, 0, 0, 0.6);
        z-index: 2000 !important;
        .bk-dialog-body {
            padding: 10px 15px 25px;
        }
    }
</style>
