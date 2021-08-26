<template>
    <section>
        <bk-dialog v-model="isShow"
            render-directive="if"
            theme="primary"
            width="1080"
            :position="{ top: 100 }"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            ext-cls="create-template-dialog"
            :close-icon="false"
            @value-change="handleDialogToggle">
            <div slot="header">
                <span>从模板新建项目</span>
            </div>
            <div class="layout-left">
                <bk-input
                    clearable
                    :placeholder="'请输入模板名称'"
                    :right-icon="'bk-icon icon-search'"
                    :ext-cls="'search-input'"
                    v-model="searchFilter"
                    @enter="handleSearchEnter"
                    @clear="handleSearchClear">
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
                        <div class="template-list" v-show="!pageLoading">
                            <li v-for="template in list" :key="template.id"
                                :class="['list-item', { checked: template.checked }]"
                                @click="handleClickItem(template)">
                                <div class="checkbox">
                                    <i class="bk-icon icon-check-1 checked-icon"></i>
                                </div>
                                <div class="layout-img">
                                    <img v-if="template.previewImg" :src="getPreviewImg(template.previewImg)" alt="模板缩略预览">
                                    <div class="empty-preview-img" v-else>页面为空</div>
                                </div>
                                <div class="layout-name">
                                    <span class="template-name" :title="template.projectName">{{ template.projectName }}</span>
                                    <span class="template-preview" @click.stop.prevent="handlePreview(template.id)">预览</span>
                                </div>
                            </li>
                        </div>
                        <div class="empty" v-show="!list.length">
                            <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                                <div>暂无项目</div>
                            </bk-exception>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layout-right">
                <bk-form ref="templateForm" :label-width="86" :rules="formRules" :model="formData" :form-type="'vertical'">
                    <bk-form-item label="模板名称" required property="templateName" error-display-type="normal">
                        <bk-input maxlength="60" readonly v-model.trim="formData.templateName"
                            placeholder="模板名称">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="项目名称" required property="projectName" error-display-type="normal">
                        <bk-input maxlength="60" v-model.trim="formData.projectName"
                            placeholder="请输入项目名称，60个字符以内">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="项目ID" required property="projectCode" error-display-type="normal">
                        <bk-input maxlength="60" v-model.trim="formData.projectCode"
                            placeholder="只能由小写字母组成，该ID将作为自定义组件前缀，创建后不可更改">
                        </bk-input>
                    </bk-form-item>
                    <bk-form-item label="项目简介" required property="projectDesc" error-display-type="normal">
                        <bk-input
                            v-model.trim="formData.projectDesc"
                            :type="'textarea'"
                            :rows="3"
                            :maxlength="100">
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
    </section>
</template>

<script>
    import preivewErrImg from '@/images/preview-error.png'

    const defaultFormData = {
        templateName: '',
        projectName: '',
        projectCode: '',
        projectDesc: '',
        copyFrom: null
    }
    const projectTemplateType = [
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
    
    export default {
        name: 'template-dialog',
        data () {
            return {
                isShow: false,
                loading: false,
                formData: { ...defaultFormData },
                formRules: {
                    templateName: [
                        {
                            required: true,
                            message: '必选项',
                            trigger: 'click'
                        }
                    ],
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
                },
                filterLinks: [...projectTemplateType],
                filter: '',
                searchFilter: '',
                templateList: [],
                list: [],
                pageLoading: false
            }
        },
        watch: {
            searchFilter (val) {
                if (!val) {
                    this.handleSearchClear()
                }
            }
        },
        methods: {
            async getTemplateList () {
                this.pageLoading = true
                try {
                    const params = { isOfficial: 1, officialType: this.filter }
                    const { projectList } = await this.$store.dispatch('project/query', { config: { params } })
                    this.templateList = projectList.map(function (item) {
                        item['checked'] = false
                        return item
                    })
                    this.handleSearchEnter()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            async handleCreateConfirm () {
                try {
                    await this.$refs.templateForm.validate()
                    const data = this.formData

                    this.loading = true
                    const projectId = await this.$store.dispatch('project/create', { data })

                    this.messageSuccess('项目创建成功')
                    this.isShow = false

                    setTimeout(() => {
                        this.$emit('to-page', projectId)
                    }, 300)
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
            handleClickFilter (link) {
                this.filter = link
                this.getTemplateList()
            },
            handleClickItem (template) {
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
                    this.formData.templateName = template.projectName
                    this.formData.copyFrom = template.id
                }
            },
            handlePreview (id) {
                this.$emit('preview', id)
            },
            handleSearchClear () {
                this.list.splice(0, this.list.length, ...this.templateList)
            },
            handleSearchEnter () {
                const checked = this.templateList.find(item => item.checked)
                if (checked) checked.checked = false
                this.list.splice(0, this.list.length, ...this.templateList.filter(item => {
                    return item.projectName.toUpperCase().includes(this.searchFilter.toUpperCase())
                }))
                this.handleReSelect()
            },
            handleReSelect () {
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
                    this.filter = ''
                    this.searchFilter = ''
                    this.formData = { ...defaultFormData }
                    this.getTemplateList()
                }
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .create-template-dialog{
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

                .template-list{
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
                            .layout-name .template-preview{
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
                            width: 100%;
                            height: 128px;

                            &::before {
                                content: "";
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 128px;
                                background: rgba(0, 0, 0, 0.4);
                            }

                            img {
                                width: 100%;
                                height: 100%;
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
