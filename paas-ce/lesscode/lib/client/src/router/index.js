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
const ComponentManage = () => import(/* webpackChunkName: 'index' */'@/views/system/component-manage')
const FunctionManage = () => import(/* webpackChunkName: 'index' */'@/views/project/function-manage')

const ProjectEntry = () => import(/* webpackChunkName: 'projectEntry' */'@/views/project')
const Page = () => import(/* webpackChunkName: 'page' */'@/views/project/page')
const Member = () => import(/* webpackChunkName: 'member' */'@/views/project/member')

const MainEntry = () => import(/* webpackChunkName: 'index' */'@/views')
const Index = () => import(/* webpackChunkName: 'index' */'@/views/index/index')
const Preview = () => import(/* webpackChunkName: 'preview' */'@/views/preview')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404')

const MainHelpEntry = () => import(/* webpackChunkName: 'index' */'@/views/help')
const Custom = () => import(/* webpackChunkName: 'custom' */'@/views/help/docs/custom.md')
const Grid = () => import(/* webpackChunkName: 'grid' */'@/views/help/docs/grid.md')
const Intro = () => import(/* webpackChunkName: 'intro' */'@/views/help/docs/intro.md')
const Start = () => import(/* webpackChunkName: 'start' */'@/views/help/docs/start.md')
const Changelog = () => import(/* webpackChunkName: 'start' */'@/views/changelog/index.md')

const routes = [
    {
        path: '/help',
        component: MainHelpEntry,
        children: [
            { path: 'custom', name: 'custom', component: Custom },
            { path: 'grid', name: 'grid', component: Grid },
            { path: 'intro', name: 'intro', component: Intro, alias: '' },
            { path: 'start', name: 'start', component: Start },
            { path: 'changelog', name: 'changelog', component: Changelog }
        ]
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
                path: 'account',
                name: 'account',
                component: Account,
                meta: {
                    title: '账号管理'
                }
            },
            {
                path: 'component-manage',
                name: 'componentManage',
                component: ComponentManage,
                meta: {
                    title: '自定义组件库'
                }
            }
        ]
    },
    {
        path: '/project/:projectId',
        component: ProjectEntry,
        children: [
            {
                path: '',
                redirect: { name: 'pageList' }
            },
            {
                path: 'pages',
                name: 'pageList',
                component: Page
            },
            {
                path: 'functionManage',
                name: 'functionManage',
                component: FunctionManage,
                meta: {
                    title: '函数库'
                }
            },
            {
                path: 'member',
                name: 'memberManage',
                component: Member
            }
        ]
    },
    {
        path: `/project/:projectId/page/:pageId`,
        component: MainEntry,
        alias: '',
        children: [
            {
                path: '',
                name: 'new',
                component: Index
            },
            {
                path: 'preview',
                name: 'preview',
                component: Preview
            }
        ]
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

let preloading = true
let canceling = true
let pageMethodExecuting = true

router.beforeEach(async (to, from, next) => {
    canceling = true
    await cancelRequest()
    canceling = false
    next()
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
