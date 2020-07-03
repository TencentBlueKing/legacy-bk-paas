<template>
    <main class="projects page-content">
        <div class="page-head">
            <bk-button theme="primary" @click="handleCreate">新建</bk-button>
            <ul class="filter-links">
                <router-link tag="li"
                    :class="['link-item', { 'router-link-exact-active': !$route.query.filter }]"
                    :to="{ name: 'projects', query: { filter: '' } }">
                    全部项目
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'my' } }">
                    我创建的
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'favorite' } }">
                    我收藏的
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'share' } }">
                    我的共享
                </router-link>
            </ul>
            <div class="extra">
                <bk-input
                    :style="{ width: '400px' }"
                    placeholder="请输入项目名称或描述"
                    :clearable="true"
                    :right-icon="'bk-icon icon-search'"
                    v-model="keyword">
                </bk-input>
            </div>
        </div>
        <div class="page-body">
            <div class="project-list">
                <div class="project-item" v-for="project in projectList" :key="project.id">
                    <div class="item-bd">
                        <template v-if="pageMap[project.id] && pageMap[project.id].length > 0">
                            <div class="preview">
                                <img :src="projectPreivewImg" alt="项目缩略预览">
                            </div>
                            <div class="desc">
                                <p class="desc-text">
                                    {{project.projectDesc}}
                                </p>
                            </div>
                        </template>
                        <div class="empty" v-else>暂无页面</div>
                    </div>
                    <div class="item-ft">
                        <div class="col">
                            <h3 class="name">{{project.projectName}}</h3>
                            <div class="stat"><vnodes :vnode="getUpdateInfo(project)"></vnodes></div>
                        </div>
                        <div class="col">
                            <bk-dropdown-menu :ref="`moreActionDropdown${project.id}`">
                                <span slot="dropdown-trigger" class="more-menu-trigger">
                                    <i class="bk-drag-icon bk-drag-more-dot"></i>
                                </span>
                                <ul class="bk-dropdown-list" slot="dropdown-content">
                                    <li><a href="javascript:;" @click="handleDownloadSource(project)">下载源码</a></li>
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
                        @click="handleClickFavorite(project)">
                        <i :class="['bk-drag-icon', `bk-drag-favorite${project.favorite ? '' : '-o' }`]"></i>
                    </span>
                </div>
            </div>
            <bk-exception v-if="!projectList.length" class="exception-wrap-item exception-part" type="empty" scene="part">
                暂无项目，<bk-link theme="primary" @click="handleCreate">立即创建</bk-link>
            </bk-exception>
        </div>

        <bk-dialog v-model="dialog.create.visible"
            render-directive="if"
            theme="primary"
            title="创建项目"
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
            @after-leave="handleRenameAfterLeave">
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
                    :loading="dialog.rename.loading"
                    @click="handleRenameConfirm">确定</bk-button>
                <bk-button @click="handleRenameCancel" :disabled="dialog.rename.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </main>
</template>

<script>
    import projectPreivewImg from '@/images/homeBg.jpg'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    import 'dayjs/locale/zh-cn'
    dayjs.extend(relativeTime)
    dayjs.locale('zh-cn')

    const defaultCreateFormData = {
        projectName: '',
        projectCode: '',
        projectDesc: ''
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
                keyword: '',
                projectList: [],
                pageMap: {},
                projectPreivewImg,
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
                    }
                },
                activatedProject: {}
            }
        },
        watch: {
            '$route.query': function (query) {
                const { filter } = query
                console.log(filter)
            }
        },
        created () {
            this.getProjectList()
        },
        methods: {
            beforeRouteUpdate (to, from, next) {
                console.log(to, from)
                next()
            },
            async getProjectList () {
                try {
                    const params = {}
                    const { projectList, pageMap } = await this.$store.dispatch('project/query', { config: { params } })
                    this.projectList = projectList
                    this.pageMap = pageMap
                } catch (e) {
                    console.error(e)
                }
            },
            getUpdateInfo (project) {
                const latestPage = this.pageMap[project.id] ? this.pageMap[project.id][0] : null
                return (
                    latestPage
                        ? <span>{latestPage.updateUser || 'admin'} {dayjs(latestPage.updateTime).fromNow()}更新</span>
                        : <span>{project.createUser || 'admin'} {dayjs(project.createTime).fromNow()}创建</span>
                )
            },
            handleCreate () {
                this.dialog.create.visible = true
            },
            async handleCreateConfirm () {
                try {
                    await this.$refs.createForm.validate()
                    const data = this.dialog.create.formData

                    this.dialog.create.loading = true
                    await this.$store.dispatch('project/create', { data })

                    this.messageSuccess('项目创建成功')
                    this.dialog.create.visible = false

                    // TODO用当前条件重新执行一次列表查询
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
                        fields: { favorite }
                    }
                    await this.$store.dispatch('project/update', { data })
                    this.messageSuccess(`${favorite ? '添加' : '取消'}成功`)

                    // 更新数据状态
                    project.favorite = favorite
                } catch (e) {
                    console.error(e)
                }
            },
            async handleRenameConfirm () {
                try {
                    await this.$refs.renameForm.validate()

                    const { id, projectName } = this.dialog.rename.formData
                    const data = {
                        id: id,
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
            handleCreateDialogToggle () {
                this.dialog.create.formData = { ...defaultCreateFormData }
            },
            handleRenameAfterLeave () {
                this.dialog.rename.formData.projectName = ''
            },
            async handleDownloadSource () {
            },
            async handleRename (project) {
                this.activatedProject = project
                this.$refs[`moreActionDropdown${project.id}`][0].hide()
                this.dialog.rename.visible = true
                this.dialog.rename.formData.projectName = project.projectName
                this.dialog.rename.formData.id = project.id
                setTimeout(() => {
                    this.$refs.projectRenameInput && this.$refs.projectRenameInput.$el.querySelector('input').focus()
                }, 0)
            },
            async handleCopy () {
            },
            async handleDelete () {
            }
        }
    }
</script>

<style lang="postcss" scoped>
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

            &.router-link-exact-active {
                background: #E1ECFF;
                color: #3A84FF;
            }
        }
    }

    .project-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        .project-item {
            position: relative;
            flex: none;
            width: 312px;
            height: 243px;
            margin: 0 14px 30px 0;
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
                .desc {
                    transform: translateY(0%);
                }
                .favorite-btn {
                    opacity: 1;
                }
                .preview {
                    &::before {
                        background: rgba(0, 0, 0, 0.4);
                    }
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
                    color: #63656E;
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
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 28px 26px 28px 21px;
                transform: translateY(100%);
                transition: all .375s ease-in-out;

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
</style>
