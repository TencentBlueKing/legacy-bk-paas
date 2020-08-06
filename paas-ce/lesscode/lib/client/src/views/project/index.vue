<template>
    <main class="project-layout">
        <aside class="aside">
            <div class="side-hd">
                <i class="back-icon bk-drag-icon bk-drag-arrow-back" title="返回项目列表" @click="toProjects"></i>
                <span class="seperate-line">|</span>
                <bk-select ext-cls="select-project" v-model="projectId" :clearable="false" :searchable="true" @selected="changeProject">
                    <bk-option v-for="option in projectList"
                        :key="option.id"
                        :id="option.id"
                        :name="option.projectName">
                    </bk-option>
                </bk-select>
            </div>
            <div class="side-bd">
                <nav class="nav-list">
                    <router-link tag="div" class="nav-item" v-for="item in navList" :key="item.toPath" :to="item.toPath">
                        <i :class="`bk-drag-icon bk-drag-${item.icon}`"></i>{{ item.title }}
                    </router-link>
                </nav>
            </div>
        </aside>
        <div class="breadcrumbs">
            <h3 class="current">{{ currentPage.title }}</h3>
        </div>
        <div class="main-container">
            <router-view :key="$route.path" v-if="!projectNotExist"></router-view>
            <div v-else class="exception-page">
                <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                    <div>项目id不存在</div>
                </bk-exception>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        data () {
            return {
                projectId: '',
                navList: [
                    {
                        title: '页面列表',
                        icon: 'list-fill',
                        toPath: 'pages'
                    },
                    {
                        title: '函数库',
                        icon: 'function-fill',
                        toPath: 'functionManage'
                    }
                    // {
                    //     title: '成员管理',
                    //     icon: 'user-group',
                    //     toPath: 'member'
                    // }
                ],
                projectList: []
            }
        },
        computed: {
            currentPage () {
                return this.navList.find(item => (this.$route.path.indexOf(`/${item.toPath}`) > 0))
            },
            projectNotExist () {
                return !this.projectList.filter(item => item.id === this.projectId).length
            }
        },
        created () {
            this.projectId = parseInt(this.$route.params.projectId)
            this.getProjectList()
        },
        methods: {
            toProjects () {
                this.$router.push({
                    name: 'projects'
                })
            },
            async getProjectList () {
                try {
                    const { projectList } = await this.$store.dispatch('project/query', { config: {} })
                    this.projectList = projectList
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            changeProject (id) {
                this.$router.replace({
                    params: {
                        projectId: id
                    }
                })
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/ellipsis";

    .project-layout {
        --side-hd-height: 50px;
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
                    margin-left: 13px;
                    color: #3a84ff;
                    padding: 12px;
                    cursor: pointer;
                }
                .seperate-line {
                    width: 1px;
                    color: #d8d8d8;
                }
                .select-project {
                    width: 190px;
                    border: none;
                    margin-left: 5px;
                }
            }
            .side-bd {
                height: calc(100% - var(--side-hd-height) - var(--side-ft-height));
                overflow-y: auto;
            }
        }

        .breadcrumbs {
            display: flex;
            align-items: center;
            height: var(--breadcrumb-height);
            background: #fff;
            box-shadow: 0 3px 4px 0 rgba(64,112,203,.06);
            padding-left: 24px;
            .current {
                color: #000;
                font-size: 16px;
                font-weight: normal;
            }
        }

        .main-container {
            height: calc(100% - var(--breadcrumb-height));
            overflow: auto;

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
                margin: 4px 0;
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
    }
</style>
