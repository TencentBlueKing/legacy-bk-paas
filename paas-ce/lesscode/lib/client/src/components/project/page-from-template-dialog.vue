<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            width="1080"
            ext-cls="page-from-template-dialog"
            :position="{ top: 100 }"
            :mask-close="false"
            :auto-close="false"
            @value-change="handleDialogToggle">
            <div slot="header">
                <span>从模板新建页面</span>
            </div>
            <div class="layout-left">
                <bk-input
                    clearable
                    :placeholder="'请输入模板名称'"
                    :right-icon="'bk-icon icon-search'"
                    :ext-cls="'search-input'"
                    v-model="searchFilter"
                    @enter="changeList"
                    @clear="changeList">
                </bk-input>
                <ul class="filter-links">
                    <li
                        v-for="link in filterLinks"
                        :key="link.id"
                        :class="['link-item', { 'active': filter === link.id }]"
                        @click="handleClickFilter(link.id)">
                        {{link.name}}
                    </li>
                </ul>
                <div class="template-container" v-bkloading="{ isLoading: pageLoading, opacity: 1 }">
                    <div class="template-container-wrapper" v-show="!pageLoading">
                        <div class="page-template-list" v-show="!pageLoading">
                            <li v-for="template in list" :key="template.id"
                                :class="['list-item', { checked: template.checked }]"
                                @click="handleClickItem(template)">
                                <section>
                                    <div class="checkbox">
                                        <i class="bk-icon icon-check-1 checked-icon"></i>
                                    </div>
                                    <div class="layout-img">
                                        <img :src="getPreviewImg(template.previewImg)" alt="模板缩略预览">
                                        <div v-if="template.isOffcial && template.hasInstall === false" class="mask">
                                            <bk-button class="apply-btn" theme="primary" @click.stop="handleApply(template)">应用</bk-button>
                                        </div>
                                    </div>
                                </section>
                                <div class="layout-name">
                                    <span class="template-name" :title="template.templateName">{{ template.templateName }}</span>
                                    <span class="template-preview" @click.stop.prevent="handlePreview(template)">预览</span>
                                </div>
                                <span v-if="template.isOffcial" class="default-share-tag">共享</span>
                            </li>
                        </div>
                        <div class="empty" v-show="!list.length">
                            <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                                <div>暂无模板</div>
                            </bk-exception>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layout-right">
                <bk-form ref="templateForm" :label-width="150" :rules="formRules" :model="formData" :form-type="'vertical'">
                    <bk-form-item label="当前已选模板" property="templateName" error-display-type="normal">
                        <bk-input readonly v-model.trim="formData.templateName"
                            placeholder="模板名称">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="页面名称" required property="pageName" error-display-type="normal">
                        <bk-input ref="projectDialogInput"
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
                        <layout-thumb-list :toolkit="['select']" :list="layoutList" @change-checked="handleLayoutChecked" />
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
            </div>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="loading"
                    @click="handleCreateConfirm">确定</bk-button>
                <bk-button @click="handleDialogCancel" :disabled="loading">取消</bk-button>
            </div>
        </bk-dialog>
        <template-edit-dialog ref="templateApplyDialog" action-type="apply" :refresh-list="initData"></template-edit-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import preivewErrImg from '@/images/preview-error.png'
    import { PAGE_TEMPLATE_TYPE } from '@/common/constant'
    import { compile } from 'path-to-regexp'
    import LayoutThumbList from '@/components/project/layout-thumb-list'
    import templateEditDialog from '@/views/project/template-manage/components/template-edit-dialog'

    export default {
        name: 'page-from-template-dialog',
        components: {
            LayoutThumbList,
            templateEditDialog
        },
        data () {
            return {
                isShow: false,
                loading: false,
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
                filterLinks: [{ id: '', name: '全部' }],
                filter: '',
                searchFilter: '',
                templateList: [],
                list: [],
                pageLoading: false,
                layoutList: [],
                selectedLayout: {},
                selectApplyTemplate: {}
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            projectId () {
                return this.$route.params.projectId
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
            searchFilter (val) {
                if (!val) {
                    this.changeList()
                }
            }
        },
        methods: {
            async initData () {
                try {
                    this.pageLoading = true
                    this.filterLinks = [{ id: '', name: '全部' }]
                    const [projectTemplateGroups, projectTemplateList, tmpMarketTemplateList, layoutList] = await Promise.all([
                        this.$store.dispatch('pageTemplate/categoryList', { projectId: this.projectId }),
                        this.$store.dispatch('pageTemplate/list', { projectId: this.projectId }),
                        this.$store.dispatch('pageTemplate/list', { type: 'OFFCIAL' }),
                        this.$store.dispatch('layout/getList', { projectId: this.projectId, versionId: this.versionId })
                    ])
                    this.templateList = projectTemplateList
                    const marketTemplateList = tmpMarketTemplateList.map(item => ({
                        ...item,
                        hasInstall: projectTemplateList.filter(template => template.parentId === item.id).length > 0
                    }))
                    marketTemplateList.map(item => {
                        if (this.templateList.filter(template => (item.id === template.id)).length === 0) {
                            this.templateList.push(item)
                        }
                    })
                    this.filterLinks = this.filterLinks.concat(projectTemplateGroups.map(item => ({ id: item.id, name: item.name }))).concat(PAGE_TEMPLATE_TYPE)
                    this.changeList()

                    layoutList.forEach(item => {
                        item.checked = item.isDefault === 1
                        item.defaultName = item.showName || item.defaultName
                        // 不需要显示选中态标签
                        item.isDefault = false
                    })
                    this.layoutList = layoutList
                    this.selectedLayout = layoutList.find(item => item.checked)
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.pageLoading = false
                }
            },
            async handleCreateConfirm () {
                try {
                    this.loading = true
                    await this.$refs.templateForm.validate()
                    const template = this.templateList.find(item => item.id === this.formData.copyFrom)
                    if (!template) {
                        this.$bkMessage({
                            theme: 'error',
                            message: '未选中模板'
                        })
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
                    const content = []
                    content.push(JSON.parse(template.content))
                    const payload = {
                        data: {
                            pageData: Object.assign({}, this.formData, { previewImg: template.previewImg, content: JSON.stringify(content) }),
                            projectId: this.projectId,
                            versionId: this.versionId
                        }
                    }

                    const { id, routePath } = this.layoutList.find(layout => layout.checked)
                    payload.data.layout = { id, routePath }

                    const res = await this.$store.dispatch('page/create', payload)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: `新建页面成功`
                        })
                        // this.isShow = false
                        this.$router.push({
                            name: 'new',
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
            getPreviewImg (previewImg) {
                if (previewImg && previewImg.length > 20) {
                    return previewImg
                }
                return preivewErrImg
            },
            changeList () {
                this.filterList = this.templateList
                if (this.filter) {
                    this.filterList = this.filterList.filter(item => item.offcialType === this.filter || item.categoryId === parseInt(this.filter))
                }
                if (this.searchFilter) {
                    this.filterList = this.filterList.filter(item => item.templateName.toUpperCase().includes(this.searchFilter.toUpperCase()))
                }
                this.list = this.filterList
                this.handleReSelect()
            },
            handleClickFilter (link) {
                this.filter = link
                this.changeList()
            },
            handleClickItem (template) {
                if (template.isOffcial && template.hasInstall === false) return
                template.checked = !template.checked
                this.list.map(function (item) {
                    if (item.id !== template.id && item.checked) {
                        item.checked = false
                    }
                    return item
                })
                if (!template.checked) {
                    this.formData.templateName = ''
                    this.formData.copyFrom = null
                } else {
                    this.formData.templateName = template.templateName
                    this.formData.copyFrom = template.id
                }
            },
            handleReSelect () {
                const checked = this.templateList.find(item => item.checked)
                if (checked) checked.checked = false
                if (this.formData.copyFrom) {
                    const template = this.list.find(item => item.id === this.formData.copyFrom)
                    if (template) {
                        template.checked = true
                    } else {
                        this.formData.templateName = ''
                        this.formData.copyFrom = null
                    }
                }
            },
            handleDialogCancel () {
                this.isShow = false
            },
            handleDialogToggle () {
                if (this.isShow) {
                    this.filterLinks = [{ id: '', name: '全部' }]
                    this.filter = ''
                    this.searchFilter = ''
                    this.templateList = []
                    this.formData = {
                        templateName: '',
                        pageName: '',
                        pageCode: '',
                        pageRoute: '',
                        copyFrom: null
                    }
                    this.initData()
                }
            },
            handleLayoutChecked (layout) {
                this.layoutList.forEach(item => (item.checked = false))
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
            },
            handlePreview (template) {
                if (!template.content) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '该页面为空页面，请先编辑页面'
                    })
                    return
                }
                window.open(`/preview-template/project/${template.belongProjectId}/${template.id}`, '_blank')
            },
            handleApply (template) {
                this.$refs.templateApplyDialog.isShow = true
                this.$refs.templateApplyDialog.templateId = template.id
                this.$refs.templateApplyDialog.fromTemplate = template
                this.$refs.templateApplyDialog.dialog.formData = {
                    categoryId: '',
                    belongProjectId: this.projectId,
                    templateName: template.templateName
                }
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .page-from-template-dialog {
        .bk-dialog-tool{
            display: none;
        }
        .bk-dialog-header{
            position: absolute;
            top: 30px;
        }
        .bk-dialog-body{
            padding: 0;
            height: 570px;
            display:flex;
            font-size:12px;

            .layout-left {
                width: 681px;
                height: 100%;
                opacity: 1;
                background: #ffffff;
                padding: 20px 0 20px 20px;

                .search-input {
                    width: 300px;
                    margin-left: calc(100% - 321px);
                }

                .template-container{
                    width: 100%;
                    height: calc(100% - 72px);
                    margin-top: 14px;

                    .template-container-wrapper{
                        width: 100%;
                        height: 100%;
                        overflow-y: auto;
                        @mixin scroller;

                        .empty{
                            margin-top: 100px;
                        }
                    }
                }

                .page-template-list {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;

                    .list-item {
                        position: relative;
                        flex: none;
                        display: flex;
                        flex-direction: column;
                        width: 206px;
                        height: 160px;
                        background: #ffffff;
                        border-radius: 2px;
                        cursor: pointer;
                        border: 1px solid #dcdee5;
                        margin-right: 10px;
                        margin-bottom: 10px;

                        &:nth-of-type(3n) {
                            margin-right: 0;
                        }

                        &:hover {
                            border-color: #3a84ff;
                            .layout-name .template-preview {
                                display: block;
                            }
                            .layout-img .mask .apply-btn {
                                display: block;
                            }
                        }

                        &.checked {
                            border-color: #3a84ff;
                            background: #e1ecff;
                            .checkbox {
                                display: block;
                            }
                            .layout-name .template-preview{
                                display: none;
                            }
                        }

                        .checkbox {
                            display: none;
                            position: absolute;
                            right: -1px;
                            bottom: -1px;
                            border-style: solid;
                            border-width: 0 0 30px 34px;
                            border-color: transparent transparent #3A84FF transparent;
                            .checked-icon {
                                position: absolute;
                                left: -20px;
                                top: 10px;
                                color: #fff;
                                font-size: 20px;
                            }
                        }

                        .layout-img {
                            position: relative;
                            width: 100%;
                            height: 128px;

                            &::before {
                                content: "";
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 128px;
                                /* background: rgba(0, 0, 0, 0.4); */
                            }

                            img {
                                width: 100%;
                                height: 100%;
                            }

                            .mask {
                                display: flex;
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: rgba(0, 0, 0, 0.1);
                                align-items: center;
                                .apply-btn {
                                    display: none;
                                    margin-left: 68px;
                                }
                            }

                            .empty-preview-img {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                font-weight: 700;
                                color: #C4C6CC;
                                height: 100%;
                                background: #f0f1f5;
                                border-radius: 4px 4px 0px 0px;
                            }
                        }
                        .layout-name {
                            padding: 0 6px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            height: 32px;
                            width: 100%;

                            .template-name{
                                color: #63656e;
                                @mixin ellipsis 80%, block;
                            }

                            .template-preview {
                                display: none;
                                color: #3A84FF;
                            }
                        }

                        .default-share-tag {
                            position: absolute;
                            right: 6px;
                            top: 6px;
                            height: 22px;
                            line-height: 22px;
                            text-align: center;
                            border-radius: 2px;
                            font-size: 12px;
                            color: #fff;
                            padding: 0 6px;
                            background: #699DF4;
                        }
                    }
                }
            }

            .layout-right {
                width: 399px;
                height: 100%;
                opacity: 1;
                background: #ffffff;
                border: 1px solid #dcdee5;
                padding: 20px;
                overflow-y: auto;
                @mixin scroller;
            }
        }

        .dialog-footer {
            button + button {
                margin-left: 4px;
            }
        }

        .filter-links {
            display: flex;
            align-items: center;
            margin-top: 10px;

            .link-item {
                padding: 6px 12px;
                margin: 0 8px;
                border-radius: 16px;
                cursor: pointer;

                &:hover {
                    background: #E1ECFF;
                }

                &.active {
                    background: #E1ECFF;
                    color: #3A84FF;
                }
            }
        }
    }
</style>
