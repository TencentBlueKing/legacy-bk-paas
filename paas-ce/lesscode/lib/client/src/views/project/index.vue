<template>
    <main :class="['project-layout', { 'no-breadcrumb': !hasBreadcrumb }]">
        <aside class="aside">
            <div class="side-hd">
                <i class="back-icon bk-drag-icon bk-drag-arrow-back" title="返回项目列表" @click="toProjects"></i>
                <span class="seperate-line">|</span>
                <span class="bk-drag-icon template-logo" title="返回项目列表" @click="toProjects">
                    <svg aria-hidden="true" width="16" height="16">
                        <use xlink:href="#bk-drag-logo"></use>
                    </svg>
                </span>
                <span class="seperate-line">|</span>
                <bk-select ext-cls="select-project" ext-popover-cls="select-project-dropdown" v-model="projectId" :clearable="false" :searchable="true" @selected="changeProject">
                    <bk-option v-for="option in projectList"
                        :key="option.id"
                        :id="option.id"
                        :name="option.projectName">
                    </bk-option>
                </bk-select>
            </div>
            <div class="side-bd" :class="{ 'no-click': pageLoading }">
                <nav class="nav-list">
                    <router-link tag="div" class="nav-item" v-for="item in navList" :key="item.title" :to="item.toPath">
                        <i :class="`bk-drag-icon bk-drag-${item.icon}`"></i>{{ item.title }} <i v-if="item.redPoint" class="red-point"></i>
                    </router-link>
                </nav>
            </div>
        </aside>
        <div class="breadcrumbs" v-if="hasBreadcrumb">
            <div class="page-top">
                <h3 class="current">{{ currentPage }}</h3>
                <div class="version-selector" v-if="isShowProjectVersionSelector">
                    当前版本：
                    <project-version-selector :bordered="false" :popover-width="200" v-model="projectVersionId" @change="handleChangeProjectVersion" />
                </div>
            </div>
            <extra-links></extra-links>
        </div>
        <!-- 使用v-if因子组件依赖获取的项目信息 -->
        <div class="main-container" v-bkloading="{ isLoading: pageLoading }">
            <router-view v-if="!pageLoading" :key="routeKey"></router-view>
        </div>
    </main>
</template>

<script>
    import { bus } from '@/common/bus'
    import ExtraLinks from '@/components/ui/extra-links'
    export default {
        components: {
            ExtraLinks
        },
        data () {
            return {
                pageLoading: false,
                projectId: '',
                projectVersionId: '',
                navList: [
                    {
                        title: '页面列表',
                        icon: 'list-fill',
                        toPath: {
                            name: 'pageList'
                        }
                    },
                    {
                        title: '自定义组件库',
                        icon: 'template-fill',
                        toPath: {
                            name: 'componentManage'
                        }
                    },
                    {
                        title: '函数库',
                        icon: 'function-fill',
                        toPath: {
                            name: 'functionManage'
                        }
                    },
                    {
                        title: '模板库',
                        icon: 'template-fill',
                        toPath: {
                            name: 'templateManage'
                        },
                        redPoint: true
                    },
                    {
                        title: '变量管理',
                        icon: 'variable-manage',
                        toPath: {
                            name: 'variableManage'
                        }
                    },
                    {
                        title: '数据源管理',
                        icon: 'data-source-manage',
                        toPath: {
                            name: 'dataSourceManage'
                        }
                    },
                    {
                        title: '布局模板实例',
                        icon: 'template-fill-2',
                        toPath: {
                            name: 'layout'
                        }
                    },
                    {
                        title: '路由配置',
                        icon: 'router',
                        toPath: {
                            name: 'routes'
                        }
                    },
                    {
                        title: '版本管理',
                        icon: 'version',
                        toPath: {
                            name: 'versions'
                        }
                    },
                    {
                        title: '成员管理',
                        icon: 'user-group',
                        toPath: {
                            name: 'memberManage'
                        }
                    },
                    {
                        title: '基本信息',
                        icon: 'info-fill',
                        toPath: {
                            name: 'basicInfo'
                        }
                    },
                    {
                        title: '操作审计',
                        icon: 'audit',
                        toPath: {
                            name: 'logs'
                        }
                    }
                ],
                projectList: [],
                countdown: 3,
                timer: null
            }
        },
        computed: {
            routeKey () {
                const { id } = this.$store.getters['projectVersion/currentVersion']
                return `${this.$route.path}_${id}`
            },
            currentPage () {
                return this.$route.meta.title
            },
            isShowProjectVersionSelector () {
                const withSelectorRoutes = ['pageList', 'functionManage', 'variableManage', 'layout', 'routes']
                return withSelectorRoutes.includes(this.$route.name)
            },
            hasBreadcrumb () {
                return this.currentPage?.length > 0
            }
        },
        beforeRouteUpdate (to, from, next) {
            this.projectId = parseInt(to.params.projectId)
            this.setCurrentProject()
            next()
        },
        async created () {
            try {
                this.pageLoading = true
                this.updateCurrentVersion(this.getInitialVersion())
                bus.$on('update-project-version', this.updateCurrentVersion)
                bus.$on('update-project-list', this.getProjectList)

                this.projectId = parseInt(this.$route.params.projectId)
                await this.getProjectList()
                await this.setCurrentProject()
            } catch (e) {
                console.error(e)
            } finally {
                this.pageLoading = false
            }
        },
        methods: {
            toProjects () {
                this.$router.push({
                    name: 'projects'
                })
            },
            async setCurrentProject () {
                const project = this.projectList.find(item => item.id === this.projectId)
                this.$store.commit('project/setCurrentProject', project)
                await this.$store.dispatch('member/setCurUserPermInfo', project)
            },
            updateCurrentVersion (version) {
                this.projectVersionId = version.id
                this.setCurrentVersion(version)
            },
            async getProjectList () {
                const projectList = await this.$store.dispatch('project/my', { config: {} })
                this.projectList = projectList
            },
            changeProject (id) {
                this.$store.dispatch('member/setCurUserPermInfo', { id })
                this.$router.replace({
                    params: {
                        projectId: id
                    }
                })
            },
            handleChangeProjectVersion (versionId, version) {
                this.setCurrentVersion(version)
            },
            getInitialVersion () {
                return this.$store.getters['projectVersion/initialVersion']()
            },
            setCurrentVersion (version) {
                this.$store.commit('projectVersion/setCurrentVersion', version)
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/ellipsis";
    @import "@/css/mixins/scroller";

    .select-project-dropdown .bk-select-search-input {
        padding: 0 10px 0 30px;
    }

    .project-layout {
        --side-hd-height: 52px;
        --aside-width: 258px;
        --footer-height: 50px;
        --breadcrumb-height: 52px;
        min-width: 1280px;
        height: calc(100vh - 64px);
        margin-top: 64px;

        .aside {
            position: relative;
            width: var(--aside-width);
            height: 100%;
            border-right: 1px solid #DCDEE5;
            background: #FFF;
            float: left;
            z-index: 1;
            transition: width .2s cubic-bezier(0.4, 0, 0.2, 1);

            .side-hd {
                height: var(--side-hd-height);
                line-height: var(--side-hd-height);
                display: flex;
                align-items: center;
                .back-icon {
                    color: #3a84ff;
                    padding: 10px;
                    cursor: pointer;
                }
                .template-logo {
                    margin: 0 10px;
                    cursor: pointer;
                    svg {
                        vertical-align: middle;
                    }
                }
                .seperate-line {
                    width: 1px;
                    color: #d8d8d8;
                    margin-left: -2px;
                }
                .select-project {
                    width: 186px;
                    border: none;
                    margin-left: 2px;
                    .bk-select-name {
                        font-size: 16px;
                        color: #313238;
                    }
                    &.is-focus {
                        box-shadow: none;
                    }
                }
            }
            .side-bd {
                height: calc(100% - var(--side-hd-height) - var(--side-ft-height, 0px));
                overflow-y: auto;
                @mixin scroller;
            }
            .no-click {
                pointer-events: none;
            }
        }

        .breadcrumbs {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: var(--breadcrumb-height);
            background: #fff;
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
            padding-left: 24px;

            .page-top {
                display: flex;
                align-items: center;

                .version-selector {
                    margin-left: 25px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    font-size: 12px;

                    &::before {
                        content: '|';
                        position: absolute;
                        left: -13px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #C4C6CC;
                    }

                    .project-version-selector {
                        width: 90px;
                    }
                }
            }

            .current {
                color: #000;
                font-size: 16px;
                font-weight: normal;
            }
        }

        .main-container {
            height: calc(100% - var(--breadcrumb-height));
            overflow: auto;
            @mixin scroller;

            .exception-page {
                height: 100%;
                display: flex;
                align-items: center;
            }
        }

        .nav-list {
            .nav-item {
                display: flex;
                align-items: center;
                font-size: 14px;
                height: 42px;
                line-height: 42px;
                padding: 0 12px 0 22px;
                margin: 0;
                white-space: nowrap;
                cursor: pointer;

                .bk-drag-icon {
                    font-size: 16px;
                    margin-right: 16px;
                }
                &:hover {
                    background: #F6F6F9;
                }
                &.router-link-active {
                    background: #E1ECFF;
                    color: #3A84FF;
                }
            }
        }

        &.no-breadcrumb {
            .main-container {
                height: 100%;
            }
        }
    }
</style>
