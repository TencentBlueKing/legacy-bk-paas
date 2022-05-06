<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            :width="nocodeType ? 750 : 1080"
            ext-cls="page-from-template-dialog"
            :position="{ top: 80 }"
            :mask-close="false"
            :auto-close="false"
            @value-change="handleDialogToggle">
            <div slot="header">
                <div class="header">
                    <div>
                        <span class="main-title">新建页面</span>
                        <span class="sub-title">{{subTitle}}</span>
                    </div>
                    <div class="bk-button-group" style="margin-left: 200px" v-if="!nocodeType">
                        <bk-button
                            :ext-cls="'type-button'"
                            @click="changeCreateFrom('EMPTY')"
                            :class="pageFrom !== 'TEMPLATE' ? 'is-selected' : ''">
                            <i class="bk-drag-icon bk-drag-border-all"> </i>
                            新建空白页面
                        </bk-button>
                        <bk-button
                            :ext-cls="'type-button'"
                            @click="changeCreateFrom('TEMPLATE')"
                            :class="pageFrom === 'TEMPLATE' ? 'is-selected' : ''">
                            <i class="bk-drag-icon bk-drag-template-fill"> </i>
                            从模板新建
                        </bk-button>
                    </div>
                </div>
            </div>

            <page-from-template :platform="platform" :create-from-template="createFromTemplate" :template-change="changeTemplate">
                <bk-form ref="templateForm" :label-width="createFromTemplate ? 150 : 86" :rules="formRules" :model="formData" :form-type="createFromTemplate ? 'vertical' : 'horizontal'">
                    <bk-form-item label="当前已选模板" property="templateName" error-display-type="normal" v-if="createFromTemplate">
                        <bk-input readonly v-model.trim="selectTemplate.templateName"
                            placeholder="模板名称">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="页面名称" required property="pageName" error-display-type="normal">
                        <bk-input
                            maxlength="60"
                            v-model.trim="formData.pageName"
                            placeholder="请输入页面名称，60个字符以内">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="页面ID" required property="pageCode" error-display-type="normal">
                        <bk-input maxlength="60" v-model.trim="formData.pageCode"
                            placeholder="以小写字母开头，由字母与数字组成，创建后不可更改">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="布局模板" error-display-type="normal">
                        <layout-thumb-list :toolkit="['select']" :list="showLayoutList" @change-checked="handleLayoutChecked" />
                        <bk-link theme="primary" class="jump-link" icon="bk-drag-icon bk-drag-jump-link" @click="handleCreateLayout">跳转新建</bk-link>
                    </bk-form-item>
                    <bk-form-item label="页面路由" required property="pageRoute"
                        error-display-type="normal">
                        <bk-input maxlength="60" v-model.trim="formData.pageRoute"
                            placeholder="由数字、字母、下划线、中划线(-)、冒号(:)或反斜杠(/)组成">
                            <template slot="prepend">
                                <div class="group-text">{{layoutRoutePath}}</div>
                            </template>
                        </bk-input>
                    </bk-form-item>
                </bk-form>
            </page-from-template>

            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="loading"
                    @click="handleCreateConfirm">确定</bk-button>
                <bk-button @click="handleDialogCancel" :disabled="loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { compile } from 'path-to-regexp'
    import LayoutThumbList from '@/components/project/layout-thumb-list'
    import pageFromTemplate from './page-from-template.vue'

    export default {
        name: 'page-from-template-dialog',
        components: {
            LayoutThumbList,
            pageFromTemplate
        },
        props: {
            platform: {
                type: String,
                default: 'PC'
            },
            nocodeType: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                isShow: false,
                loading: false,
                pageFrom: 'EMPTY',
                formData: {},
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
                },
                layoutList: [],
                selectedLayout: {},
                selectTemplate: {}
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            projectId () {
                return this.$route.params.projectId
            },
            createFromTemplate () {
                return !this.nocodeType && this.pageFrom === 'TEMPLATE'
            },
            subTitle () {
                let title = ''
                if (this.nocodeType) {
                    switch (this.nocodeType) {
                        case 'FORM':
                            title = '普通表单页'
                            break
                        case 'FORM_MANAGE':
                            title = '表单数据管理页'
                            break
                        case 'FLOW':
                            title = '流程页'
                            break
                        case 'FLOW_MANAGE':
                            title = '流程数据管理页'
                            break
                        default:
                    }
                } else {
                    title = this.platform === 'MOBILE' ? '移动端页面' : '自定义页面'
                }
                return title
            },
            layoutRoutePath () {
                const { routePath } = this.selectedLayout
                if (routePath) {
                    return routePath.endsWith('/') ? routePath : `${routePath}/`
                }
                return ''
            },
            showLayoutList () {
                return this.layoutList.filter(layout => layout.layoutType === this.platform)
            }
        },
        methods: {
            changeCreateFrom (from = 'EMPTY') {
                this.pageFrom = from
            },
            changeTemplate (template = {}) {
                this.selectTemplate = template
            },
            async initData () {
                try {
                    const layoutList = await this.$store.dispatch('layout/getList', { projectId: this.projectId, versionId: this.versionId })
                    
                    layoutList.forEach(item => {
                        item.checked = item.isDefault === 1
                        item.defaultName = item.showName || item.defaultName
                        // 不需要显示选中态标签
                        item.isDefault = false
                    })
                    this.layoutList = layoutList
                    this.selectedLayout = layoutList.find(item => item.checked) || this.showLayoutList[0]
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                }
            },
            async handleCreateConfirm () {
                try {
                    this.loading = true
                    await this.$refs.templateForm.validate()

                    let templateFormData = {}
                    if (this.createFromTemplate) {
                        const template = this.selectTemplate
                        if (!template?.id) {
                            this.$bkMessage({
                                theme: 'error',
                                message: '未选择模板'
                            })
                            return
                        }
                        const content = []
                        content.push(JSON.parse(template.content))
                        templateFormData = { previewImg: template.previewImg, content: JSON.stringify(content) }
                    }
                    
                    const formData = {
                        pageName: this.formData.pageName,
                        pageCode: this.formData.pageCode
                    }
                    const nameExist = await this.$store.dispatch('page/checkName', {
                        data: {
                            ...formData,
                            projectId: this.projectId,
                            versionId: this.versionId,
                            from: 'create'
                        }
                    })
                    if (nameExist) return
                    
                    const payload = {
                        data: {
                            pageData: Object.assign({}, this.formData, templateFormData),
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    }

                    const { id, routePath } = this.showLayoutList.find(layout => layout.checked)
                    payload.data.layout = { id, routePath }

                    const res = await this.$store.dispatch('page/create', payload)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: '新建页面成功'
                        })
                        const toPageRouteName = this.nocodeType ? 'editNocode' : 'new'
                        this.$router.push({
                            name: toPageRouteName,
                            params: {
                                projectId: this.projectId,
                                pageId: res
                            }
                        })
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loading = false
                }
            },
            handleDialogCancel () {
                this.isShow = false
            },
            handleDialogToggle () {
                if (this.isShow) {
                    this.pageFrom = 'EMPTY'
                    this.formData = {
                        pageType: this.platform || 'PC',
                        pageName: '',
                        pageCode: '',
                        pageRoute: '',
                        nocodeType: this.nocodeType
                    }
                    this.initData()
                }
            },
            handleLayoutChecked (layout) {
                this.showLayoutList.forEach(item => (item.checked = false))
                layout.checked = true
                this.selectedLayout = layout
            },
            handleCreateLayout () {
                this.$router.push({
                    name: 'layout',
                    params: {
                        projectId: this.projectId
                    }
                })
                setTimeout(() => {
                    this.isShow = false
                }, 160)
            }
        }
    }
</script>

<style lang="postcss">
    .page-from-template-dialog {
        .bk-dialog-tool{
            display: none;
        }
        .bk-dialog-header{
            position: absolute;
            top: 20px;
            .header {
                display: flex;
                justify-content: space-between;
                .main-title {
                    font-size: 20px;
                    color: #63656e;
                }
                .sub-title {
                    margin-left: 10px;
                    font-size: 12px;
                    color: #979ba5;
                }
            }
            .type-button {
                width: 240px;
            }
        }
        .bk-dialog-body{
            padding: 0;
            height: 570px;
            display:flex;
            font-size:12px;
        }

        .dialog-footer {
            button + button {
                margin-left: 4px;
            }
        }
    }
</style>
