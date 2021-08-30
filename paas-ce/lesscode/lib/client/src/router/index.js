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

const MainEntry = () => import(/* webpackChunkName: 'index' */'@/views')
const Index = () => import(/* webpackChunkName: 'index' */'@/views/index/index')
const Preview = () => import(/* webpackChunkName: 'preview' */'@/views/preview')
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
            { path: 'free-layout', name: 'freeLayout', component: FreeLayoutDoc }
        ]
    },
    {
        path: '/checkHealth',
        component: HealthPage
    },
    {
        path: '/',
        component: SystemEntry,
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
                path: 'account',
                name: 'account',
                component: Account,
                meta: {
                    title: '账号管理'
                }
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
        path: `/project/:projectId/page/:pageId`,
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
        path: '/preview/project/:projectId/*',
        name: 'preview',
        component: Preview
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
