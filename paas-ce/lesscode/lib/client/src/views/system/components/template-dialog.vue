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
            :close-icon="false">
            <div slot="header">
                <span>从模板新建项目</span>
            </div>
            <div class="layout-left">
                <bk-input
                    clearable
                    :placeholder="'请输入模板名称'"
                    :right-icon="'bk-icon icon-search'"
                    :ext-cls="'search-input'"
                    v-model="searchFilter">
                </bk-input>
                <ul class="filter-links">
                    <li
                        v-for="(link, index) in filterLinks"
                        :key="index"
                        :class="['link-item', { 'active': filter === link.value }]"
                        @click="handleClickFilter(link.value)">
                        {{link.name}}
                    </li>
                </ul>
                <div class="template-container">
                    <div class="template-list">
                        <li v-for="template in templateList" :key="template.id"
                            :class="['list-item', { checked: template.checked }]"
                            @click="handleClickItem(template)">
                            <div class="checkbox">
                                <i class="bk-icon icon-check-1 checked-icon"></i>
                            </div>
                            <div class="layout-img">
                            <!--                            <img :src="getPreviewImg(layout)" />-->
                            </div>
                            <div class="layout-name">
                                <span class="template-name" :title="template.name">{{ template.name }}</span>
                                <span class="template-preview">预览</span>
                            </div>
                        </li>
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
    const defaultFormData = {
        templateName: '',
        projectName: '',
        projectCode: '',
        projectDesc: '',
        copyFrom: null
    }
    const defaultTemplate = {
        name: '',
        id: -1,
        checked: false
    }
    
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
                            message: '必填项'
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
                filterLinks: [
                    { name: '全部', value: '' },
                    { name: '企业官网', value: 'my' },
                    { name: '管理后台', value: 'favorite' },
                    { name: '运维产品', value: 'share' }
                ],
                filter: '',
                searchFilter: '',
                templateList: [
                    { name: '蓝鲸配置平台1', id: 1, checked: false },
                    { name: '蓝鲸配置平台2', id: 2, checked: false },
                    { name: '蓝鲸配置平台3', id: 3, checked: false },
                    { name: '蓝鲸配置平台4', id: 4, checked: false },
                    { name: '蓝鲸配置平台5', id: 5, checked: false },
                    { name: '蓝鲸配置平台6', id: 6, checked: false },
                    { name: '蓝鲸配置平台7', id: 7, checked: false }
                ],
                selectTemplate: { ...defaultTemplate }
            }
        },
        methods: {
            handleClickFilter (link) {
                this.filter = link
            },
            handleClickItem (template) {
                template.checked = !template.checked
                this.selectTemplate.checked = false
                if (!template.checked) {
                    this.selectTemplate = { ...defaultTemplate }
                } else {
                    this.selectTemplate = template
                }
                this.formData.templateName = this.selectTemplate.name
            },
            handleCreateConfirm () {},
            handleDialogCancel () {
                this.isShow = false
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
                    overflow-y: auto;
                    @mixin scroller;
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
                            background-color: rgba(128, 128, 128, 0.29);

                            img {
                                width: 100%;
                                height: 100%;
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
