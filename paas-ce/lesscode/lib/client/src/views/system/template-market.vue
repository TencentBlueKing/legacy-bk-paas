<template>
    <main class="template-market page-content">
        <div class="project-template">
            <div class="page-head" style="align-items: center">
                <span style="font-size: 16px;font-weight: 700">项目模板</span>
                <ul class="filter-links">
                    <li
                        v-for="(link, index) in projectLinks"
                        :key="index"
                        :class="['link-item', { 'active': projectFilter === link.id }]"
                        @click="handleClickProjectFilter(link.id)">
                        {{link.name}}
                    </li>
                </ul>
                <div class="extra">
                    <bk-input
                        style="width: 400px"
                        placeholder="请输入项目名称或描述"
                        :clearable="true"
                        :right-icon="'bk-icon icon-search'"
                        v-model="projectKeyWord"
                        @clear="handleSearchClear"
                        @enter="handleSearchEnter">
                    </bk-input>
                </div>
            </div>
            <div class="project-list" v-show="projectList.length">
                <div :class="['project-item']" v-for="project in projectList" :key="project.id">
                    <div class="item-bd">
                        <template>
                            <div class="preview">
                                <img v-if="project.previewImg" :src="getPreviewImg(project.previewImg)" alt="项目缩略预览">
                                <div class="empty-preview-img" v-else>页面为空</div>
                            </div>
                        </template>
                        <div class="operate-btns">
                            <bk-button style="margin-left: 22px;width: 76px" theme="primary" @click="handleApply(project)">应用</bk-button>
                            <bk-button style="margin-left: 10px;width: 76px">预览</bk-button>
                            <bk-button style="margin-left: 10px;width: 76px">下载源码</bk-button>
                        </div>
                    </div>
                    <div class="item-ft">
                        <div class="col">
                            <h3 class="name" :title="project.projectName">{{project.projectName}}</h3>
                            <div class="stat">{{project.createUser}}</div>
                        </div>
                    </div>
                    <span class="favorite-btn">
                        <i class="bk-icon icon-info-circle" v-bk-tooltips.top="{ content: project.projectDesc }"></i>
                    </span>
                </div>
            </div>
            <div class="empty" v-show="!projectList.length">
                <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                    <div>暂无项目模板</div>
                </bk-exception>
            </div>
        </div>
        <div class="page-template">
            <div class="page-head" style="align-items: center">
                <span style="font-size: 16px;font-weight: 700">页面模板</span>
                <ul class="filter-links">
                    <li
                        v-for="(link, index) in pageLinks"
                        :key="index"
                        :class="['link-item', { 'active': pageFilter === link.id }]"
                        @click="handleClickPageFilter(link.id)">
                        {{link.name}}
                    </li>
                </ul>
                <div class="extra">
                    <bk-input
                        style="width: 400px"
                        placeholder="请输入项目名称或描述"
                        :clearable="true"
                        :right-icon="'bk-icon icon-search'"
                        v-model="projectKeyWord"
                        @clear="handleSearchClear"
                        @enter="handleSearchEnter">
                    </bk-input>
                </div>
            </div>
            <div class="page-list" v-show="pageList.length">
                <div :class="['page-item']" v-for="page in pageList" :key="page.id">
                    <div class="item-bd">
                        <template>
                            <div class="preview">
                                <img v-if="page.previewImg" :src="getPreviewImg(page.previewImg)" alt="项目缩略预览">
                                <div class="empty-preview-img" v-else>页面为空</div>
                            </div>
                        </template>
                        <div class="operate-btns">
                            <bk-button style="margin-left: 17px;width: 86px" theme="primary" @click="handleAddToProject(page)">添加至项目</bk-button>
                            <bk-button style="margin-left: 10px;width: 76px">预览</bk-button>
                            <bk-button style="margin-left: 10px;width: 76px">下载源码</bk-button>
                        </div>
                    </div>
                    <div class="item-ft">
                        <div class="col">
                            <h3 class="name" :title="page.templateName">{{page.templateName}}</h3>
                            <div class="stat">{{page.createUser}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="empty" v-show="!pageList.length">
                <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                    <div>暂无项目模板</div>
                </bk-exception>
            </div>
        </div>
        
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
                    :loading="dialog.project.loading">确定</bk-button>
                <bk-button :disabled="dialog.project.loading">取消</bk-button>
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
            <div class="selected-project">已选模板：{{dialog.page.templateName}}，添加至项目后，可以在画布中拖拽使用</div>
            <bk-form ref="pageForm" :label-width="86" :rules="dialog.page.formRules" :model="dialog.page.formData">
                <bk-form-item label="项目" required property="project" error-display-type="normal" :ext-cls="'selected-template-project'">
                    <bk-select searchable
                        multiple
                        display-tag
                        v-model="dialog.page.formData.project"
                        style="background: #fff">
                        <bk-option v-for="option in dialog.page.projectList"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <template>
                    <bk-form-item label="项目名称" required property="projectName" error-display-type="normal">
                        <bk-input maxlength="60" v-model.trim="dialog.project.formData.projectName"
                            placeholder="请输入项目名称，60个字符以内">
                        </bk-input>
                    </bk-form-item>
                </template>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="dialog.page.loading">确定</bk-button>
                <bk-button :disabled="dialog.page.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </main>
</template>

<script>
    import preivewErrImg from '@/images/preview-error.png'

    const PROJECT_TEMPLATE_TYPE = [
        {
            id: '',
            name: '全部'
        },
        {
            id: 'OFFCIAL_WEBSITE',
            name: '企业官网'
        },
        {
            id: 'ADMIN_BACKEND',
            name: '管理后台'
        },
        {
            id: 'OPERATION_PRODUCT',
            name: '运维产品'
        }
    ]
    const PAGE_TEMPLATE_TYPE = [
        {
            id: '',
            name: '全部'
        },
        {
            id: 'FORM',
            name: '表单'
        },
        {
            id: 'CHART',
            name: '图表'
        },
        {
            id: 'INFO',
            name: '信息'
        }
    ]
    const defaultCreateFormData = {
        projectName: '',
        projectCode: '',
        projectDesc: '',
        copyFrom: null
    }

    export default {
        name: 'template-market',
        data () {
            return {
                projectFilter: '',
                pageFilter: '',
                projectKeyWord: '',
                pageKeyWord: '',
                projectLinks: [...PROJECT_TEMPLATE_TYPE],
                pageLinks: [...PAGE_TEMPLATE_TYPE],
                projectList: [
                    {
                        id: 1,
                        projectName: '蓝鲸配置平台',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    },
                    {
                        id: 2,
                        projectName: 'test',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    },
                    {
                        id: 3,
                        projectName: 'test',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    },
                    {
                        id: 4,
                        projectName: 'test',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    },
                    {
                        id: 5,
                        projectName: 'test',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    },
                    {
                        id: 6,
                        projectName: 'test',
                        previewImg: null,
                        projectDesc: '平台共享详情',
                        createUser: '平台共享'
                    }
                ],
                pageList: [
                    {
                        id: 1,
                        templateName: '蓝鲸配置平台',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 2,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 3,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 4,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 5,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 6,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    },
                    {
                        id: 7,
                        templateName: 'page',
                        previewImg: null,
                        projectDesc: '平台共享',
                        createUser: 'admin'
                    }
                    
                ],
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
                        templateName: '',
                        projectList: [],
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
                }
            }
        },
        methods: {
            handleClickProjectFilter (link) {
                this.projectFilter = link
                this.projectList = []
            },
            handleClickPageFilter (link) {
                this.pageFilter = link
                this.pageList = []
            },
            handleSearchClear () {},
            handleSearchEnter () {},
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
                this.dialog.page.templateName = page.templateName
                this.dialog.page.visible = true
            },
            handleProjectDialogToggle () {
                this.dialog.project.formData = { ...defaultCreateFormData }
            },
            handlePageDialogToggle () {
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import "@/css/mixins/ellipsis";

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

    .project-list{
        margin-top: 30px;
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

    .empty {
        height: 300px;
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
        /deep/ & :nth-child(2){
            width: 585px;
        }
    }

    /deep/ .dialog-footer {
        button + button {
            margin-left: 4px;
        }
    }
</style>
