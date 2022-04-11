<template>
    <main class="template-market page-content">
        <div style="height: 100%" v-bkloading="{ isLoading: pageLoading, opacity: 1 }">
            <div v-show="!pageLoading">
                <div class="project-template">
                    <div class="page-head" style="align-items: center">
                        <span style="font-size: 16px;font-weight: 700">项目模板</span>
                        <ul class="filter-links">
                            <li
                                v-for="(link, index) in template.project.links"
                                :key="index"
                                :class="['link-item', { 'active': template.project.filter === link.id }]"
                                @click="handleClickProjectFilter(link.id)">
                                {{link.name}}
                            </li>
                        </ul>
                        <div class="extra">
                            <bk-input
                                style="width: 400px"
                                placeholder="请输入关键词"
                                :clearable="true"
                                :right-icon="'bk-icon icon-search'"
                                v-model="template.project.keyword"
                                @clear="handleProjectSearchClear"
                                @enter="handleFilter('project')">
                            </bk-input>
                        </div>
                    </div>
                    <div class="page-body">
                        <div class="project-list" v-show="template.project.list.length">
                            <div :class="['project-item']" v-for="project in template.project.list" :key="project.id">
                                <div class="item-bd">
                                    <template>
                                        <div class="preview">
                                            <page-preview-thumb alt="项目缩略预览" :project-id="project.id" />
                                        </div>
                                    </template>
                                    <div class="operate-btns">
                                        <bk-button style="margin-left: 22px;width: 76px" theme="primary" @click="handleApply(project)">应用</bk-button>
                                        <bk-button style="margin-left: 10px;width: 76px" @click="handlePreviewProject(project.id)">预览</bk-button>
                                        <bk-button style="margin-left: 10px;width: 76px" @click="handleDownloadProject(project)">下载源码</bk-button>
                                    </div>
                                </div>
                                <div class="item-ft">
                                    <div class="col">
                                        <h3 class="name" :title="project.projectName">{{project.projectName}}</h3>
                                        <div class="stat">{{project.createUser ? `由 ${project.createUser} 上传` : ''}}</div>
                                    </div>
                                </div>
                                <span class="favorite-btn">
                                    <i class="bk-icon icon-info-circle" v-bk-tooltips.top="{ content: project.projectDesc }"></i>
                                </span>
                            </div>
                        </div>
                        <div class="empty" v-show="!template.project.list.length">
                            <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                                <div>暂无项目模板</div>
                            </bk-exception>
                        </div>
                    </div>
                </div>
                <div class="page-template">
                    <div class="page-head" style="align-items: center">
                        <span style="font-size: 16px;font-weight: 700">页面模板</span>
                        <ul class="filter-links">
                            <li
                                v-for="(link, index) in template.page.links"
                                :key="index"
                                :class="['link-item', { 'active': template.page.filter === link.id }]"
                                @click="handleClickPageFilter(link.id)">
                                {{link.name}}
                            </li>
                        </ul>
                        <div class="extra">
                            <bk-input
                                style="width: 400px"
                                placeholder="请输入关键词"
                                :clearable="true"
                                :right-icon="'bk-icon icon-search'"
                                v-model="template.page.keyword"
                                @clear="handlePageSearchClear"
                                @enter="handleFilter('page')">
                            </bk-input>
                        </div>
                    </div>
                    <div class="page-body">
                        <div class="page-list" v-show="template.page.list.length">
                            <div :class="['page-item']" v-for="page in template.page.list" :key="page.id">
                                <div class="item-bd">
                                    <template>
                                        <div class="preview">
                                            <img class="page-img" v-if="page.previewImg" :src="getPreviewImg(page.previewImg)" alt="项目缩略预览">
                                            <div class="empty-preview-img" v-else>页面为空</div>
                                        </div>
                                    </template>
                                    <div class="operate-btns">
                                        <bk-button style="margin-left: 17px;width: 86px" theme="primary" @click="handleAddToProject(page)">添加至项目</bk-button>
                                        <bk-button style="margin-left: 10px;width: 76px" @click="handlePreviewTemplate(page)">预览</bk-button>
                                        <bk-button style="margin-left: 10px;width: 76px" @click="handleDownloadTemplate(page)">下载源码</bk-button>
                                    </div>
                                </div>
                                <div class="item-ft">
                                    <div class="col">
                                        <h3 class="name" :title="page.templateName">{{page.templateName}}</h3>
                                        <div class="stat">{{page.createUser ? `由 ${page.createUser} 上传` : ''}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="empty" v-show="!template.page.list.length">
                            <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                                <div>暂无页面模板</div>
                            </bk-exception>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <download-dialog ref="downloadDialog"></download-dialog>

        <bk-dialog v-model="dialog.project.visible"
            render-directive="if"
            theme="primary"
            :title="'应用模板'"
            width="750"
            :position="{ top: 100 }"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="project-create-dialog"
            @value-change="handleProjectDialogToggle">
            <div class="selected-project">已选模板：{{dialog.project.templateName}}</div>
            <bk-form ref="createForm" :label-width="86" :rules="dialog.project.formRules" :model="dialog.project.formData">
                <bk-form-item label="项目名称" required property="projectName" error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.project.formData.projectName"
                        placeholder="请输入项目名称，60个字符以内">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="项目ID" required property="projectCode" error-display-type="normal">
                    <bk-input maxlength="60" v-model.trim="dialog.project.formData.projectCode"
                        placeholder="只能由小写字母组成，该ID将作为自定义组件前缀，创建后不可更改">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="项目简介" required property="projectDesc" error-display-type="normal">
                    <bk-input
                        v-model.trim="dialog.project.formData.projectDesc"
                        :type="'textarea'"
                        :rows="3"
                        :maxlength="100">
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="dialog.project.loading"
                    @click="handleCreateConfirm">确定</bk-button>
                <bk-button @click="handleCreateCancel" :disabled="dialog.project.loading">取消</bk-button>
            </div>
        </bk-dialog>

        <bk-dialog v-model="dialog.page.visible"
            render-directive="if"
            theme="primary"
            :title="'应用模板'"
            width="750"
            :position="{ top: 100 }"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="page-create-dialog"
            @value-change="handlePageDialogToggle">
            <div class="selected-project">已选模板：{{dialog.page.curPage.templateName}}，添加至项目后，可以在画布中拖拽使用</div>
            <bk-form :label-width="86">
                <bk-form-item label="项目" required :ext-cls="'selected-template-project'">
                    <bk-select searchable
                        multiple
                        display-tag
                        :placeholder="'请选择项目，可多选'"
                        v-model="dialog.page.formData.project"
                        :loading="dialog.page.selectLoading"
                        @change="handleSelectChange"
                        @clear="handleSelectClear"
                        style="background: #fff">
                        <bk-option v-for="option in dialog.page.projectList"
                            :key="option.id"
                            :id="option.id"
                            :name="option.projectName">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
            </bk-form>
            <template v-if="dialog.page.selectedList.length">
                <div style="margin: 20px 0">请指定添加至对应项目的模板分类：</div>
                <div style="min-height: 140px">
                    <bk-form ref="pageForm" :label-width="180">
                        <bk-form-item v-for="item in dialog.page.selectedList"
                            :key="item.id"
                            :label="item.projectName" required>
                            <bk-select searchable
                                :clearable="false"
                                v-model="item.selectedCategory">
                                <bk-option v-for="option in item.categoryList"
                                    :key="option.id"
                                    :id="option.id"
                                    :name="option.name">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                    </bk-form>
                </div>
            </template>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    @click="handlePageConfirm"
                    :loading="dialog.page.loading">确定</bk-button>
                <bk-button @click="handlePageCancel" :disabled="dialog.page.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </main>
</template>

<script>
    import preivewErrImg from '@/images/preview-error.png'
    import DownloadDialog from './components/download-dialog'
    import PagePreviewThumb from '@/components/project/page-preview-thumb.vue'
    import { PROJECT_TEMPLATE_TYPE, PAGE_TEMPLATE_TYPE } from '@/common/constant'
    import { mapActions } from 'vuex'
    import { parseFuncAndVar } from '@/common/parse-function-var'
    import LC from '@/element-materials/core'

    const PROJECT_TYPE_LIST = [{ id: '', name: '全部' }].concat(PROJECT_TEMPLATE_TYPE)
    const PAGE_TYPE_LIST = [{ id: '', name: '全部' }].concat(PAGE_TEMPLATE_TYPE)
    const defaultCreateFormData = {
        projectName: '',
        projectCode: '',
        projectDesc: '',
        copyFrom: null
    }

    export default {
        name: 'template-market',
        components: {
            DownloadDialog,
            PagePreviewThumb
        },
        data () {
            return {
                template: {
                    project: {
                        list: [],
                        filter: '',
                        links: [...PROJECT_TYPE_LIST],
                        keyword: ''
                    },
                    page: {
                        list: [],
                        filter: '',
                        keyword: '',
                        links: [...PAGE_TYPE_LIST]
                    }
                },
                projectList: [],
                pageList: [],
                dialog: {
                    project: {
                        visible: false,
                        loading: false,
                        templateName: '',
                        formData: { ...defaultCreateFormData },
                        formRules: {
                            projectName: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'blur'
                                }
                            ],
                            projectCode: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'blur'
                                },
                                {
                                    regex: /^[a-z]+$/,
                                    message: '只能由小写字母组成',
                                    trigger: 'blur'
                                }
                            ],
                            projectDesc: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'blur'
                                }
                            ]
                        }
                    },
                    page: {
                        visible: false,
                        loading: false,
                        selectLoading: false,
                        curPage: {},
                        projectList: [],
                        selectedList: [],
                        formData: {
                            project: []
                        },
                        formRules: {
                            project: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'click'
                                }
                            ]
                        }
                    }
                },
                pageLoading: false,
                formLoading: false
            }
        },
        watch: {
            'template.project.keyword' (val) {
                if (!val) {
                    this.handleProjectSearchClear()
                }
            },
            'template.page.keyword' (val) {
                if (!val) {
                    this.handlePageSearchClear()
                }
            }
        },
        created () {
            this.getTemplateList()
        },
        methods: {
            ...mapActions('functions', [
                'getAllGroupAndFunction'
            ]),
            ...mapActions('variable', ['getAllVariable']),
            async getTemplateList () {
                this.pageLoading = true
                try {
                    const params = { filter: 'official', officialType: this.template.project.filter }
                    const [{ projectList }, pageTemplateList] = await Promise.all([
                        this.$store.dispatch('project/query', { config: { params } }),
                        this.$store.dispatch('pageTemplate/list', { type: 'OFFCIAL' })
                    ])
                    this.projectList = projectList
                    this.pageList = pageTemplateList
                    this.template.project.list = projectList
                    this.template.page.list = pageTemplateList
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            async handleCreateConfirm () {
                try {
                    await this.$refs.createForm.validate()
                    const data = this.dialog.project.formData

                    this.dialog.project.loading = true
                    const projectId = await this.$store.dispatch('project/create', { data })

                    this.messageSuccess('项目创建成功')
                    this.dialog.project.visible = false

                    setTimeout(() => {
                        this.toPage(projectId)
                    }, 300)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.dialog.project.loading = false
                }
            },
            async getProjectList () {
                this.selectLoading = true
                try {
                    const { projectList } = await this.$store.dispatch('project/query', { config: {} })
                    this.dialog.page.projectList.splice(0, this.dialog.page.projectList.length, ...projectList)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.selectLoading = false
                }
            },
            async getTemplateCategory (item) {
                this.formLoading = true
                try {
                    item['categoryList'] = await this.$store.dispatch('pageTemplate/categoryList', { projectId: item.id })
                    item['selectedCategory'] = item.categoryList.length > 0 ? item.categoryList[0].id : ''
                } catch (e) {
                    console.error(e)
                } finally {
                    this.formLoading = false
                }
            },
            handleFilter (type) {
                switch (type) {
                    case 'project':
                        this.template.project.list.splice(0, this.template.project.list.length, ...this.projectList)
                        if (this.template.project.filter !== '') {
                            this.template.project.list = this.template.project.list.filter(item => {
                                return item.offcialType && item.offcialType.includes(this.template.project.filter)
                            })
                        }
                        if (this.template.project.keyword !== '') {
                            this.template.project.list = this.template.project.list.filter(item => {
                                return item.projectName.toUpperCase().includes(this.template.project.keyword.toUpperCase())
                            })
                        }
                        break
                    case 'page':
                        this.template.page.list.splice(0, this.template.page.list.length, ...this.pageList)
                        if (this.template.page.filter !== '') {
                            this.template.page.list = this.template.page.list.filter(item => {
                                return item.offcialType && item.offcialType.includes(this.template.page.filter)
                            })
                        }
                        if (this.template.page.keyword !== '') {
                            this.template.page.list = this.template.page.list.filter(item => {
                                return item.templateName.toUpperCase().includes(this.template.page.keyword.toUpperCase())
                            })
                        }
                        break
                    default:
                        break
                }
            },
            handleClickProjectFilter (link) {
                this.template.project.filter = link
                this.handleFilter('project')
            },
            handleClickPageFilter (link) {
                this.template.page.filter = link
                this.handleFilter('page')
            },
            handleProjectSearchClear () {
                this.template.project.keyword = ''
                this.handleFilter('project')
            },
            handlePageSearchClear () {
                this.template.page.keyword = ''
                this.handleFilter('page')
            },
            getPreviewImg (previewImg) {
                if (previewImg && previewImg.length > 20) {
                    return previewImg
                }
                return preivewErrImg
            },
            handleApply (project) {
                defaultCreateFormData.copyFrom = project.id
                defaultCreateFormData.projectName = ''
                this.dialog.project.templateName = project.projectName
                this.dialog.project.visible = true
            },
            handleAddToProject (page) {
                this.dialog.page.curPage = page
                this.dialog.page.visible = true
            },
            handleProjectDialogToggle () {
                this.dialog.project.formData = { ...defaultCreateFormData }
            },
            handlePageDialogToggle (val) {
                if (val) {
                    this.getProjectList()
                    this.handleSelectClear()
                }
            },
            handleCreateCancel () {
                this.dialog.project.visible = false
            },
            handlePageCancel () {
                this.dialog.page.visible = false
            },
            async handlePageConfirm () {
                this.dialog.page.loading = true
                if (!this.dialog.page.selectedList.length) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '未选择项目'
                    })
                    return
                }
                try {
                    const fromTemplate = this.dialog.page.curPage
                    const templateInfo = this.dialog.page.selectedList.map(item => ({
                        belongProjectId: item.id,
                        categoryId: item.selectedCategory
                    }))
                    const data = {
                        id: fromTemplate.id,
                        fromProjectId: fromTemplate.belongProjectId,
                        templateInfo
                    }
                    const [variableList, funcGroups] = await Promise.all([
                        this.getAllVariable({
                            projectId: fromTemplate.belongProjectId,
                            versionId: fromTemplate.versionId,
                            pageCode: fromTemplate.fromPageCode,
                            effectiveRange: 0
                        }, false),
                        this.getAllGroupAndFunction({ projectId: fromTemplate.belongProjectId, versionId: fromTemplate.versionId })
                    ])
                    
                    const templateNode = LC.parseTemplate(JSON.parse(fromTemplate.content || {}))
                    // 解析出模板targetData绑定的变量和函数
                    const { varList: valList = [], funcList = [] } = parseFuncAndVar(templateNode, variableList, funcGroups)
                    Object.assign(data, { valList, funcList })
                    console.log(data, 'submit data')
                    const res = await this.$store.dispatch('pageTemplate/apply', data)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: res
                        })
                        this.dialog.page.visible = false
                    }
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.dialog.page.loading = false
                }
            },
            handleSelectClear () {
                this.dialog.page.selectedList = []
                this.dialog.page.formData.project = []
            },
            async handleSelectChange (newValue, oldValue) {
                if (newValue.length > oldValue.length) {
                    const selectedProject = this.dialog.page.projectList.find(project => project.id === newValue[newValue.length - 1])
                    const selected = { id: selectedProject.id, projectName: selectedProject.projectName, selectedCategory: '' }
                    // check是否已被添加到被选中的项目
                    const hasApply = await this.$store.dispatch('pageTemplate/checkIsExist', { belongProjectId: selectedProject.id, parentId: this.dialog.page.curPage.id })
                    if (hasApply === true) {
                        this.dialog.page.formData.project.pop()
                        this.$bkMessage({
                            theme: 'warning',
                            message: '模板已被该项目应用,无需重复添加'
                        })
                    } else {
                        await this.getTemplateCategory(selected)
                        this.dialog.page.selectedList.push(selected)
                    }
                } else {
                    const that = this
                    oldValue.forEach(function (item, index) {
                        if (newValue.indexOf(item) < 0) {
                            that.dialog.page.selectedList.splice(index, 1)
                        }
                    })
                }
            },
            toPage (projectId) {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId
                    }
                })
            },
            handlePreviewProject (id) {
                window.open(`/preview/project/${id}/`, '_blank')
            },
            handlePreviewTemplate (template) {
                window.open(`/preview-template/project/${template.belongProjectId}/${template.id}`, '_blank')
            },
            handleDownloadProject (project) {
                this.$refs.downloadDialog.isShow = true
                this.$refs.downloadDialog.projectId = project.id
                this.$refs.downloadDialog.projectName = project.projectName
            },
            handleDownloadTemplate (template) {
                const targetData = []
                targetData.push(JSON.parse(template.content))
                this.$store.dispatch('vueCode/getPageCode', {
                    targetData,
                    projectId: template.belongProjectId
                }).then((res) => {
                    const downlondEl = document.createElement('a')
                    const blob = new Blob([res])
                    downlondEl.download = `bklesscode-template-${template.id}.vue`
                    downlondEl.href = URL.createObjectURL(blob)
                    downlondEl.style.display = 'none'
                    document.body.appendChild(downlondEl)
                    downlondEl.click()
                    document.body.removeChild(downlondEl)
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import "@/css/mixins/ellipsis";
    @import "@/css/mixins/scroller";

    .filter-links {
        display: flex;
        align-items: center;
        margin-left: 16px;
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

    .empty{
        height: 300px;
    }

    .project-list{
        margin-top: 10px;
    }
    .page-list{
        margin-bottom: 10px;
    }

    .project-list, .page-list {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        .project-item{
            margin: 0 14px 40px 0;
            &::before {
                content: "";
                position: absolute;
                top: -10px;
                left: 0;
                width: 156px;
                height: 10px;
                border-radius: 6px 0px 0px 0px;
                background: linear-gradient(-160deg, transparent 9px, #dcdee5 0)
            }
        }
        .page-item{
             margin: 0 14px 30px 0;
        }
        .project-item, .page-item {
            position: relative;
            flex: none;
            width: 304px;
            height: 234px;
            padding: 6px;
            background: #fff;
            border-radius: 0px 6px 6px 6px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.11);
            cursor: pointer;

            &:hover {
                box-shadow: 1px 2px 8px 2px rgba(0, 0 ,0 , 0.11);

                .favorite-btn {
                    opacity: 1;
                }
                .preview {
                    &::before {
                        background: rgba(0, 0, 0, 0.4);
                    }
                }
                .operate-btns {
                    opacity: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                }
                .empty {
                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.4);
                    }
                }
            }

            .item-bd {
                flex: none;
                position: relative;
                width: 292px;
                height: 158px;
                background: #fff;
                border-radius: 4px 4px 0px 0px;
                overflow: hidden;
            }
            .item-ft {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 16px 10px 0 10px;
            }

            .preview {
                position: relative;
                font-size: 0;
                height: 100%;
                overflow: hidden;
                border-radius: 4px 4px 0px 0px;
                img {
                    max-width: 100%;
                }
                .page-img {
                    height: 100%;
                    object-fit: contain;
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
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
            .operate-btns {
                display: none;
                .bk-button{
                    padding: 0 0;
                }
            }
            .empty {
                display: flex;
                position: relative;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 700;
                color: #C4C6CC;
                height: 100%;
                background: #f0f1f5;
                border-radius: 4px 4px 0px 0px;
            }
            .name {
                margin: 0;
                font-size: 14px;
                font-weight: 700;
                color: #63656E;
                @mixin ellipsis 240px, block;
            }
            .stat {
                font-size: 12px;
                color: #979BA5;
                padding: 4px 0;
            }
            .favorite-btn {
                position: absolute;
                right: 16px;
                top: 16px;
                opacity: 0;
                transition: all .3s ease;
                .icon-info-circle {
                    color: #fff;
                    font-size: 16px;
                    margin-right: 4px;
                }
            }
        }
    }

    /deep/ .bk-dialog-header{
            padding: 3px 24px 10px;
    }

    .selected-project{
        font-size: 12px;
        color: #63656e;
        margin-bottom: 14px;
    }

    .selected-template-project {
        height: 64px;
        padding-top: 16px;
        background: rgb(240, 241, 245);
    }

    .page-create-dialog{
        /deep/ & .bk-form-content{
            padding-right: 30px;
        }
        /deep/ & .bk-dialog-body{
            height: 360px;
            overflow-y: auto;
            @mixin scroller;
        }
    }

    /deep/ .dialog-footer {
        button + button {
            margin-left: 4px;
        }
    }
</style>
