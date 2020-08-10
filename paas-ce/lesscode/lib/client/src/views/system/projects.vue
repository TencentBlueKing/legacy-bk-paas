<template>
    <main class="projects page-content">
        <div class="page-head">
            <bk-button theme="primary" @click="handleCreate">新建</bk-button>
            <ul class="filter-links">
                <li
                    v-for="(link, index) in filterLinks"
                    :key="index"
                    :class="['link-item', { 'active': filter === link.value }]"
                    @click="handleClickFilter(link.value)">
                    {{link.name}}
                </li>
            </ul>
            <div class="extra">
                <bk-input
                    style="width: 400px"
                    placeholder="请输入项目名称或描述"
                    :clearable="true"
                    :right-icon="'bk-icon icon-search'"
                    v-model="keyword"
                    @clear="handleSearchClear"
                    @enter="handleSearchEnter">
                </bk-input>
            </div>
        </div>
        <div class="page-body" v-bkloading="{ isLoading: pageLoading, opacity: 1 }">
            <div class="page-body-inner" v-show="!pageLoading">
                <div class="project-list" v-show="projectList.length">
                    <div :class="['project-item', { favorite: project.favorite }]" v-for="project in projectList" :key="project.id">
                        <div class="item-bd" @click="toPage(project.id)">
                            <template v-if="pageMap[project.id] && pageMap[project.id].length > 0">
                                <div class="preview">
                                    <img :src="pageMap[project.id][0].previewImg || projectPreivewImg" alt="项目缩略预览">
                                </div>
                            </template>
                            <div class="empty" v-else>
                                暂无页面
                            </div>
                            <div class="desc">
                                <p class="desc-text">
                                    {{project.projectDesc}}
                                </p>
                            </div>
                        </div>
                        <div class="item-ft">
                            <div class="col">
                                <h3 class="name" :title="project.projectName">{{project.projectName}}</h3>
                                <div class="stat"><vnodes :vnode="getUpdateInfo(project)"></vnodes></div>
                            </div>
                            <div class="col">
                                <bk-dropdown-menu :ref="`moreActionDropdown${project.id}`">
                                    <span slot="dropdown-trigger" class="more-menu-trigger">
                                        <i class="bk-drag-icon bk-drag-more-dot"></i>
                                    </span>
                                    <ul class="bk-dropdown-list" slot="dropdown-content">
                                        <li><a href="javascript:;" @click="handleDownloadSource(project)">下载源码</a></li>
                                        <li><a href="javascript:;" @click="toPage(project.id)">页面管理</a></li>
                                        <li><a href="javascript:;" @click="handleRename(project)">重命名</a></li>
                                        <li><a href="javascript:;" @click="handleCopy(project)">复制</a></li>
                                        <li><a href="javascript:;" @click="handleDelete(project)">删除</a></li>
                                    </ul>
                                </bk-dropdown-menu>
                            </div>
                        </div>
                        <span
                            class="favorite-btn"
                            v-bk-tooltips.top="{ content: project.favorite ? '取消收藏' : '添加收藏' }"
                            @click.stop="handleClickFavorite(project)">
                            <i :class="['bk-drag-icon', `bk-drag-favorite${project.favorite ? '' : '-o' }`]"></i>
                        </span>
                    </div>
                </div>
                <div class="empty" v-show="!projectList.length">
                    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                        <div v-if="$route.query.q">无搜索结果</div>
                        <div v-else>
                            暂无项目
                            <span v-show="!filter.length || filter === 'my'">
                                ，<bk-link theme="primary" @click="handleCreate">立即创建</bk-link>
                            </span>
                        </div>
                    </bk-exception>
                </div>
            </div>
        </div>

        <bk-dialog v-model="dialog.create.visible"
            render-directive="if"
            theme="primary"
            :title="isCopy ? '复制项目' : '创建项目'"
            width="600"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            @value-change="handleCreateDialogToggle">
            <bk-form ref="createForm" :label-width="90" :rules="dialog.create.formRules" :model="dialog.create.formData">
                <bk-form-item label="项目名称" required property="projectName">
                    <bk-input maxlength="60" v-model="dialog.create.formData.projectName"
                        placeholder="请输入项目名称，60个字符以内">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="项目ID" required property="projectCode">
                    <bk-input maxlength="255" v-model="dialog.create.formData.projectCode"
                        placeholder="请输入，由字母、数字、中划线或下划线组成">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="项目简介" required property="projectDesc">
                    <bk-input
                        v-model="dialog.create.formData.projectDesc"
                        :type="'textarea'"
                        :rows="3"
                        :maxlength="100">
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="dialog.create.loading"
                    @click="handleCreateConfirm">确定</bk-button>
                <bk-button @click="handleCreateCancel" :disabled="dialog.create.loading">取消</bk-button>
            </div>
        </bk-dialog>

        <bk-dialog v-model="dialog.rename.visible"
            theme="primary"
            title="重命名"
            width="600"
            :mask-close="false"
            :auto-close="false"
            header-position="left"
            @after-leave="handleRenameDialogAfterLeave">
            <bk-form ref="renameForm" class="rename-form" :label-width="90" :rules="dialog.rename.formRules" :model="dialog.rename.formData">
                <bk-form-item label="项目名称" required property="projectName">
                    <bk-input ref="projectRenameInput"
                        maxlength="60"
                        v-model="dialog.rename.formData.projectName"
                        placeholder="请输入项目名称，60个字符以内">
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :disabled="activatedProject.projectName === dialog.rename.formData.projectName"
                    :loading="dialog.rename.loading"
                    @click="handleRenameConfirm">确定</bk-button>
                <bk-button @click="handleRenameCancel" :disabled="dialog.rename.loading">取消</bk-button>
            </div>
        </bk-dialog>

        <bk-dialog v-model="dialog.delete.visible"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="确认删除该项目？"
            width="500"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
            @value-change="handleDeleteDialogToggle">
            <bk-form ref="deleteForm" class="delete-form" :label-width="0" :rules="dialog.delete.formRules" :model="dialog.delete.formData">
                <p class="confirm-name">请输入<em title="复制名称">“{{activatedProject.projectName}}”</em>确认</p>
                <bk-form-item property="projectName">
                    <bk-input
                        maxlength="60"
                        v-model="dialog.delete.formData.projectName"
                        placeholder="请输入项目名称">
                    </bk-input>
                </bk-form-item>
            </bk-form>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="dialog.delete.loading"
                    @click="handleDeleteConfirm">删除</bk-button>
                <bk-button @click="handleDeleteCancel" :disabled="dialog.delete.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </main>
</template>

<script>
    import projectPreivewImg from '@/images/page-demo.png'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    import 'dayjs/locale/zh-cn'
    dayjs.extend(relativeTime)
    dayjs.locale('zh-cn')

    const defaultCreateFormData = {
        projectName: '',
        projectCode: '',
        projectDesc: '',
        copyFrom: null
    }

    export default {
        components: {
            vnodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnode
            }
        },
        data () {
            return {
                keyword: this.$route.query.q || '',
                projectList: [],
                pageMap: {},
                projectPreivewImg,
                filterLinks: [
                    { name: '全部项目', value: '' },
                    { name: '我创建的', value: 'my' },
                    { name: '我收藏的', value: 'favorite' },
                    { name: '我的共享', value: 'share' }
                ],
                dialog: {
                    create: {
                        visible: false,
                        loading: false,
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
                                    regex: /^[\w-]+$/,
                                    message: '需由字母、数字、中划线或下划线组成',
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
                    rename: {
                        visible: false,
                        loading: false,
                        formData: {
                            projectName: ''
                        },
                        formRules: {
                            projectName: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'blur'
                                }
                            ]
                        }
                    },
                    delete: {
                        visible: false,
                        loading: false,
                        formData: {
                            projectName: ''
                        },
                        formRules: {
                            projectName: [
                                {
                                    required: true,
                                    message: '必填项',
                                    trigger: 'blur'
                                },
                                {
                                    validator: (val) => {
                                        return this.activatedProject.projectName === val
                                    },
                                    message: '名称不一致，请重试',
                                    trigger: 'blur'
                                }
                            ]
                        }
                    }
                },
                activatedProject: {},
                pageLoading: true
            }
        },
        computed: {
            filter () {
                return this.$route.query.filter || ''
            },
            isCopy () {
                return this.dialog.create.formData.copyFrom !== null
            }
        },
        watch: {
            $route: function () {
                this.getProjectList()
            },
            keyword (val) {
                if (!val) {
                    this.handleSearchClear()
                }
            }
        },
        created () {
            this.getProjectList()
        },
        methods: {
            async getProjectList () {
                this.pageLoading = true
                try {
                    const params = this.$route.query
                    const { projectList, pageMap } = await this.$store.dispatch('project/query', { config: { params } })
                    this.projectList = projectList
                    this.pageMap = pageMap
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            getUpdateInfo (project) {
                const latestPage = this.pageMap[project.id] ? this.pageMap[project.id][0] : null
                return (
                    latestPage
                        ? <span class="user">{latestPage.updateUser || 'admin'} {dayjs(latestPage.updateTime).fromNow()}更新</span>
                        : <span class="user">{project.createUser || 'admin'} {dayjs(project.createTime).fromNow()}创建</span>
                )
            },
            async handleCreateConfirm () {
                try {
                    await this.$refs.createForm.validate()
                    const data = this.dialog.create.formData

                    this.dialog.create.loading = true
                    const projectId = await this.$store.dispatch('project/create', { data })

                    this.messageSuccess('项目创建成功')
                    this.dialog.create.visible = false

                    setTimeout(() => {
                        this.toPage(projectId)
                    }, 300)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.dialog.create.loading = false
                }
            },
            async handleClickFavorite (project) {
                try {
                    const favorite = project.favorite ? 0 : 1
                    const data = {
                        id: project.id,
                        favorite
                    }
                    await this.$store.dispatch('project/favorite', { data })
                    this.messageSuccess(`${favorite ? '添加' : '取消'}成功`)

                    // 更新数据状态
                    project.favorite = favorite
                    if (this.filter === 'favorite') {
                        this.getProjectList()
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            async handleRenameConfirm () {
                try {
                    await this.$refs.renameForm.validate()

                    const { id, projectName } = this.dialog.rename.formData
                    const data = {
                        id,
                        fields: { projectName }
                    }
                    this.dialog.rename.loading = true

                    const checkNameResult = await this.checkProjectName(projectName)
                    if (!checkNameResult) {
                        return
                    }

                    await this.$store.dispatch('project/update', { data })

                    this.messageSuccess('重命名成功')
                    this.dialog.rename.visible = false

                    const activeProject = this.projectList.find(project => project.id === id)
                    if (activeProject) {
                        activeProject.projectName = projectName
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.dialog.rename.loading = false
                }
            },
            async handleDeleteConfirm () {
                try {
                    await this.$refs.deleteForm.validate()

                    const { id } = this.dialog.delete.formData
                    const data = { id }
                    this.dialog.delete.loading = true

                    await this.$store.dispatch('project/delete', { config: { data } })

                    this.messageSuccess('删除成功')
                    this.dialog.delete.visible = false

                    this.getProjectList()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.dialog.delete.loading = false
                }
            },
            async checkProjectName (name) {
                const res = await this.$store.dispatch('project/checkname', {
                    data: { name },
                    config: { globalError: false }
                })
                if (res.code !== 0) {
                    this.messageError(res.message)
                    return false
                }
                return true
            },
            handleCreateCancel () {
                this.dialog.create.visible = false
            },
            handleRenameCancel () {
                this.dialog.rename.visible = false
            },
            handleDeleteCancel () {
                this.dialog.delete.visible = false
            },
            handleCreateDialogToggle () {
                this.dialog.create.formData = { ...defaultCreateFormData }
            },
            handleRenameDialogAfterLeave () {
                this.dialog.rename.formData.projectName = ''
            },
            handleDeleteDialogToggle () {
                this.dialog.delete.formData.projectName = ''
            },
            handleCreate () {
                defaultCreateFormData.copyFrom = null
                defaultCreateFormData.projectName = ''
                this.dialog.create.visible = true
            },
            async handleCopy (project) {
                this.hideDropdownMenu(project)
                defaultCreateFormData.copyFrom = project.id
                defaultCreateFormData.projectName = `${project.projectName}-copy`
                this.dialog.create.visible = true
            },
            async handleDownloadSource () {
            },
            async handleRename (project) {
                this.activatedProject = project
                this.hideDropdownMenu(project)

                this.dialog.rename.visible = true
                this.dialog.rename.formData.projectName = project.projectName
                this.dialog.rename.formData.id = project.id
                setTimeout(() => {
                    this.$refs.projectRenameInput && this.$refs.projectRenameInput.$el.querySelector('input').focus()
                }, 0)
            },
            async handleDelete (project) {
                this.activatedProject = project
                this.hideDropdownMenu(project)

                this.dialog.delete.visible = true
                this.dialog.delete.formData.id = project.id
            },
            handleClickFilter (filter = '') {
                const query = { ...this.$route.query, ...{ filter } }
                this.updateRoute({ query })
            },
            handleSearchClear (a, b) {
                const query = { ...this.$route.query, ...{ q: '' } }
                this.updateRoute({ query })
            },
            handleSearchEnter (value) {
                const query = { ...this.$route.query, ...{ q: value } }
                this.updateRoute({ query })
            },
            updateRoute (location) {
                this.$router.push(location).catch(e => e)
            },
            hideDropdownMenu (project) {
                this.$refs[`moreActionDropdown${project.id}`][0].hide()
            },
            toPage (projectId) {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId
                    }
                })
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

    .project-list {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        margin-top: 10px;

        .project-item {
            position: relative;
            flex: none;
            width: 312px;
            height: 242px;
            margin: 0 14px 40px 0;
            padding: 6px;
            background: #fff;
            border-radius: 0px 6px 6px 6px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.11);
            cursor: pointer;

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
            &:hover {
                box-shadow: 1px 2px 8px 2px rgba(0, 0 ,0 , 0.11);

                .desc {
                    display: block;
                }
                .favorite-btn {
                    opacity: 1;
                }
                .preview {
                    &::before {
                        background: rgba(0, 0, 0, 0.4);
                    }
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

            &.favorite {
                .favorite-btn {
                    opacity: 1;
                }
            }

            .favorite-btn {
                position: absolute;
                right: 16px;
                top: 16px;
                opacity: 0;
                transition: all .3s ease;

                .bk-drag-icon {
                    font-size: 18px;
                    color: #FAFBFD;
                    cursor: pointer;
                }
                .bk-drag-favorite {
                    color: #FE9C00;
                }
            }
            .more-menu-trigger {
                .bk-drag-more-dot {
                    display: block;
                    width: 32px;
                    height: 32px;
                    line-height: 34px;
                    text-align: center;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    color: #979BA5;
                    &:hover {
                        background: #F0F1F5;
                    }
                }
            }

            .item-bd {
                flex: none;
                position: relative;
                width: 300px;
                height: 166px;
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
            .desc {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 28px 26px 28px 21px;

                .desc-text {
                    font-size: 12px;
                    color: #fff;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
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
        }
    }

    .rename-form {
        margin: 12px 0;
    }

    /deep/ .dialog-footer {
        button + button {
            margin-left: 4px;
        }
    }

    /deep/ .delete-dialog-wrapper {
        .delete-form {
            .confirm-name {
                margin: 16px 0 8px 0;
                font-size: 14px;
                em {
                    font-style: normal;
                    font-weight: 700;
                    cursor: pointer;
                }
            }
        }
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 40px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
            }
        }
    }

    @media screen and (max-width: 1280px) {
        .project-list {
            .project-item {
                width: 310px;
                height: 240px;
            }
        }
    }
</style>
