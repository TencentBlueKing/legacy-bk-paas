/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'

Vue.use(VueRouter)

const SystemEntry = () => import(/* webpackChunkName: 'index' */'@/views/system')
const Projects = () => import(/* webpackChunkName: 'projects' */'@/views/system/projects')
const Account = () => import(/* webpackChunkName: 'account' */'@/views/system/account')
const functionMarket = () => import(/* webpackChunkName: 'functionMarket' */'@/views/system/function-market')
const templateMarket = () => import(/* webpackChunkName: 'templateMarket' */'@/views/system/template-market')

const ComponentManage = () => import(/* webpackChunkName: 'index' */'@/views/project/component-manage')
const FunctionManage = () => import(/* webpackChunkName: 'index' */'@/views/project/function-manage')
const TemplateManage = () => import(/* webpackChunkName: 'index' */'@/views/project/template-manage')
const MemberManage = () => import(/* webpackChunkName: 'index' */'@/views/project/member-manage')
const VariableManage = () => import(/* webpackChunkName: 'index' */'@/views/project/variable-manage')

const ProjectEntry = () => import(/* webpackChunkName: 'projectEntry' */'@/views/project')
const Page = () => import(/* webpackChunkName: 'page' */'@/views/project/page')
const RouterManage = () => import(/* webpackChunkName: 'route' */'@/views/project/router-manage')
const Basic = () => import(/* webpackChunkName: 'basic' */'@/views/project/basic')
const Logs = () => import(/* webpackChunkName: 'basic' */'@/views/project/logs')
const Layout = () => import(/* webpackChunkName: 'layout' */'@/views/project/layout')
const VersionManage = () => import(/* webpackChunkName: 'version' */'@/views/project/version-manage')

const MainEntry = () => import(/* webpackChunkName: 'index' */'@/views')
const Index = () => import(/* webpackChunkName: 'index' */'@/views/index/index')
const PreviewTemplate = () => import(/* webpackChunkName: 'previewTemplate' */'@/views/preview/preview-template')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/status/404')

const HealthPage = () => import(/* webpackChunkName: 'none' */'@/views/system/health')

const MainHelpEntry = () => import(/* webpackChunkName: 'index' */'@/views/help')
const Custom = () => import(/* webpackChunkName: 'custom' */'@/views/help/docs/custom.md')
const Grid = () => import(/* webpackChunkName: 'grid' */'@/views/help/docs/grid.md')
const LayoutGuide = () => import(/* webpackChunkName: 'layout-guide' */'@/views/help/docs/layout.md')
const Intro = () => import(/* webpackChunkName: 'intro' */'@/views/help/docs/intro.md')
const Start = () => import(/* webpackChunkName: 'start' */'@/views/help/docs/start.md')
const Develop = () => import(/* webpackChunkName: 'develop' */'@/views/help/docs/develop.md')
const Changelog = () => import(/* webpackChunkName: 'changelog' */'@/views/changelog/index.md')
const TableSearch = () => import(/* webpackChunkName: 'case-table-search' */'@/views/help/docs/case-table-search.md')
const Method = () => import(/* webpackChunkName: 'method' */'@/views/help/docs/method.md')
const Variable = () => import(/* webpackChunkName: 'variable' */'@/views/help/docs/variable.md')
const Directive = () => import(/* webpackChunkName: 'directive' */'@/views/help/docs/directive.md')
const FreeLayoutDoc = () => import(/* webpackChunkName: 'grid' */'@/views/help/docs/free-layout.md')
const TemplateProject = () => import(/* webpackChunkName: 'template-project' */'@/views/help/docs/template-project.md')
const TemplatePage = () => import(/* webpackChunkName: 'template-page' */'@/views/help/docs/template-page.md')
const Interactive = () => import(/* webpackChunkName: 'interactive' */'@/views/help/docs/interactive.md')

// 数据源管理
const DataSourceHome = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/index.vue')
const DataSourceTableList = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/table-design/table-list/index.vue')
const DataSourceCreateTable = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/table-design/create-table.vue')
const DataSourceEditTable = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/table-design/edit-table.vue')
const DataSourceShowTable = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/table-design/show-table.vue')
const DataSourceUpdateRecord = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/table-design/update-record.vue')
const DataSourceDataManage = () => import(/* webpackChunkName: 'DataSource' */'@/views/project/data-source-manage/data-manage/index.vue')

// 运营统计
const OperationEntry = () => import(/* webpackChunkName: 'operation-stats-entry' */'@/views/system/operation/index.vue')
const OperationStatsUser = () => import(/* webpackChunkName: 'operation-stats-user' */'@/views/system/operation/stats/user/index.vue')
const OperationStatsProject = () => import(/* webpackChunkName: 'operation-stats-project' */'@/views/system/operation/stats/project/index.vue')
const OperationStatsFunc = () => import(/* webpackChunkName: 'operation-stats-func' */'@/views/system/operation/stats/func/index.vue')
const OperationStatsComp = () => import(/* webpackChunkName: 'operation-stats-comp' */'@/views/system/operation/stats/comp/index.vue')

const routes = [
    {
        path: '/help',
        component: MainHelpEntry,
        children: [
            { path: 'custom', name: 'custom', component: Custom },
            { path: 'grid', name: 'grid', component: Grid },
            { path: 'grid', name: '', component: Grid },
            { path: 'layout', name: 'layout-guide', component: LayoutGuide },
            { path: 'intro', name: 'intro', component: Intro, alias: '' },
            { path: 'start', name: 'start', component: Start },
            { path: 'develop', name: 'develop', component: Develop },
            { path: 'changelog', name: 'changelog', component: Changelog },
            { path: 'case-table-search', name: 'table-search', component: TableSearch },
            { path: 'method', name: 'method', component: Method },
            { path: 'variable', name: 'variable', component: Variable },
            { path: 'directive', name: 'directive', component: Directive },
            { path: 'template-project', name: 'template-project', component: TemplateProject },
            { path: 'template-page', name: 'template-page', component: TemplatePage },
            { path: 'free-layout', name: 'freeLayout', component: FreeLayoutDoc },
            { path: 'interactive', name: 'interactive', component: Interactive }
        ]
    },
    {
        path: '/checkHealth',
        component: HealthPage
    },
    {
        path: '/',
        components: {
            default: SystemEntry,
            permission: require('@/views/status/403').default
        },
        redirect: { name: 'projects' },
        children: [
            {
                path: 'projects',
                name: 'projects',
                component: Projects,
                meta: {
                    title: '项目列表'
                }
            },
            {
                path: 'function-market',
                name: 'functionMarket',
                component: functionMarket,
                meta: {
                    title: '函数市场'
                }
            },
            {
                path: 'template-market',
                name: 'templateMarket',
                component: templateMarket,
                meta: {
                    title: '模板市场'
                }
            },
            {
                path: 'account',
                name: 'account',
                component: Account,
                meta: {
                    title: '账号管理'
                }
            },
            {
                name: 'op-entry',
                path: '/op',
                component: OperationEntry,
                redirect: { name: 'op-stats-user' },
                children: [
                    {
                        path: 'stats/user',
                        name: 'op-stats-user',
                        component: OperationStatsUser,
                        meta: {
                            title: '用户数据'
                        }
                    },
                    {
                        path: 'stats/project',
                        name: 'op-stats-project',
                        component: OperationStatsProject,
                        meta: {
                            title: '项目数据'
                        }
                    },
                    {
                        path: 'stats/func',
                        name: 'op-stats-func',
                        component: OperationStatsFunc,
                        meta: {
                            title: '函数数据'
                        }
                    },
                    {
                        path: 'stats/comp',
                        name: 'op-stats-comp',
                        component: OperationStatsComp,
                        meta: {
                            title: '自定义组件数据'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: 'project-entry',
        path: '/project/:projectId',
        components: {
            default: ProjectEntry,
            permission: require('@/views/status/non-exist-project').default
        },
        redirect: { name: 'pageList' },
        children: [
            {
                path: 'pages',
                name: 'pageList',
                component: Page,
                meta: {
                    title: '页面列表'
                }
            },
            {
                path: 'component-manage',
                name: 'componentManage',
                component: ComponentManage,
                meta: {
                    title: '自定义组件库'
                }
            },
            {
                path: 'function-manage',
                name: 'functionManage',
                component: FunctionManage,
                meta: {
                    title: '函数库'
                }
            },
            {
                path: 'template-manage',
                name: 'templateManage',
                component: TemplateManage,
                meta: {
                    title: '模板库'
                }
            },
            {
                path: 'variable-manage',
                name: 'variableManage',
                component: VariableManage,
                meta: {
                    title: '变量管理'
                }
            },
            {
                path: 'data-source-manage',
                name: 'dataSourceManage',
                component: DataSourceHome,
                redirect: { name: 'tableList' },
                children: [
                    {
                        path: '',
                        name: 'tableList',
                        component: DataSourceTableList
                    },
                    {
                        path: 'create-table',
                        name: 'createTable',
                        component: DataSourceCreateTable
                    },
                    {
                        path: 'edit-table',
                        name: 'editTable',
                        component: DataSourceEditTable
                    },
                    {
                        path: 'show-table',
                        name: 'showTable',
                        component: DataSourceShowTable
                    },
                    {
                        path: 'update-table-record',
                        name: 'updateTableRecord',
                        component: DataSourceUpdateRecord
                    },
                    {
                        path: 'data-manage',
                        name: 'dataManage',
                        component: DataSourceDataManage
                    }
                ]
            },
            {
                path: 'layout',
                name: 'layout',
                component: Layout,
                meta: {
                    title: '布局模板实例'
                }
            },
            {
                path: 'routes',
                name: 'routes',
                component: RouterManage,
                meta: {
                    title: '路由配置'
                }
            },
            {
                path: 'versions',
                name: 'versions',
                component: VersionManage,
                meta: {
                    title: '版本管理'
                }
            },
            {
                path: 'member-manage',
                name: 'memberManage',
                component: MemberManage,
                meta: {
                    title: '成员管理'
                }
            },
            {
                path: 'basic',
                name: 'basicInfo',
                component: Basic,
                meta: {
                    title: '基本信息'
                }
            },
            {
                path: 'logs',
                name: 'logs',
                component: Logs,
                meta: {
                    title: '操作审计'
                }
            }
        ]
    },
    {
        name: 'page-entry',
        path: '/project/:projectId/page/:pageId',
        components: {
            default: MainEntry,
            permission: require('@/views/status/non-exist-project').default
        },
        redirect: { name: 'new' },
        children: [
            {
                path: '',
                name: 'new',
                component: Index
            }
        ]
    },
    {
        path: '/preview-template/project/:projectId/:templateId',
        name: 'previewTemplate',
        component: PreviewTemplate,
        meta: {
            title: '模板预览'
        }
    },
    {
        path: '*',
        name: '404',
        component: NotFound
    }
]
const router = new VueRouter({
    mode: 'history',
    // scrollBehavior: (to, from, savedPosition) => {
    //     if (to.hash) {
    //         return { selector: to.hash }
    //     } else {
    //         return { x: 0, y: 0 }
    //     }
    // },
    routes: routes
})

const cancelRequest = async () => {
    const allRequest = http.queue.get()
    const requestQueue = allRequest.filter(request => request.cancelWhenRouteChange)
    await http.cancel(requestQueue.map(request => request.requestId))
}

const checkViewAuth = async (to) => {
    const topRoute = to.matched[0]
    let hasPermission = true

    if (topRoute.name === 'project-entry') {
        const res = await store.dispatch('project/verify', { data: { id: to.params.projectId } })
        hasPermission = res.data
    }

    if (topRoute.name === 'page-entry') {
        const res = await store.dispatch('page/verify', { data: { id: to.params.pageId, projectId: to.params.projectId } })
        hasPermission = res.data
    }

    if (to.matched[1] && to.matched[1].name === 'op-entry') {
        const isAdmin = await store.dispatch('isPlatformAdmin')
        hasPermission = isAdmin
    }

    // if (to.name === 'preview') {
    //     const res = await store.dispatch('page/verifyPreview', { data: { id: to.params.pageId } })
    //     const data = res.data || {}
    //     hasPermission = data.isPageCreator
    // }

    if (hasPermission) {
        Vue.set(topRoute.meta, 'view', 'default')
    } else {
        Vue.set(topRoute.meta, 'view', 'permission')
    }

    return Promise.resolve()
}

let preloading = true
let canceling = true
let pageMethodExecuting = true

router.beforeEach(async (to, from, next) => {
    canceling = true
    await cancelRequest()
    canceling = false
    try {
        Vue.set(to.meta, 'authed', false)
        await checkViewAuth(to)
        Vue.set(to.meta, 'authed', true)
        next()
    } catch (e) {
        console.error(e)
    }
})

router.afterEach(async (to, from) => {
    if (to.path === from.path) {
        return
    }
    store.commit('setMainContentLoading', true)

    preloading = true
    await preload()
    preloading = false

    const pageDataMethods = []
    const routerList = to.matched
    routerList.forEach(r => {
        const fetchPageData = r.instances.default && r.instances.default.fetchPageData
        if (fetchPageData && typeof fetchPageData === 'function') {
            pageDataMethods.push(r.instances.default.fetchPageData())
        }
    })

    pageMethodExecuting = true
    await Promise.all(pageDataMethods)
    pageMethodExecuting = false

    if (!preloading && !canceling && !pageMethodExecuting) {
        store.commit('setMainContentLoading', false)
    }
})

export default router
