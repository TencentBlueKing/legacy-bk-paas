/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
// import httpVueLoader from '@/common/http-vue-loader'
import { uuid } from 'shared/util'
import { getRouteFullPath, getRouteName, getProjectDefaultRoute } from 'shared/route'
import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from './children/home.vue'
import BkNotFound from './children/404.vue'
import BkError from './children/bk-error.vue'
import { bundless, triggleUpdate } from '@blueking/bundless'
import bundlessPluginVue2 from '@blueking/bundless-plugin-vue2'

Vue.use(VueRouter)
const uniqStr = uuid()

function registerComponent (source, id) {
    return bundless({
        source,
        id,
        plugins: [bundlessPluginVue2]
    })
}

// 监听 storage 变化触发热更新
window.addEventListener('storage', (event) => {
    try {
        if (['ONLINE_PREVIEW_CONTENT', 'ONLINE_PREVIEW_NAV'].includes(event.key)) {
            const payload = JSON.parse(event.newValue)
            if (payload) {
                triggleUpdate(payload)
            }
        }
    } catch (error) {
        console.error(`热更新失败：${error.message || error}`)
    }
})

// 生成路由
module.exports = (routeGroup, projectPageRouteList, projectRouteList, projectId, platform) => {
    const routes = []
    // 当前编辑页面的内容信息
    const editPageData = JSON.parse(localStorage.getItem('ONLINE_PREVIEW_CONTENT') || '{}')
    // 当前编辑页面的导航信息
    const editNavData = JSON.parse(localStorage.getItem('ONLINE_PREVIEW_NAV') || '{}')

    for (const key in routeGroup) {
        const layout = routeGroup[key]

        // 父路由
        const parentSource = layout.path === editNavData.id ? editNavData.source : layout.content
        const parentCom = registerComponent(parentSource, projectId + layout.path)

        // 子路由
        const routeList = layout.children
        const children = routeList.map((route) => {
            const routeConifg = {
                path: route.path.replace(/^\//, '')
            }

            try {
                // 与vue-router保持一致，优先使用redirect
                if (route.redirectRoute) {
                    routeConifg.name = getRouteName(route)
                    routeConifg.redirect = {
                        path: getRouteFullPath(route.redirectRoute)
                    }
                } else if (route.isError) {
                    // 后端生成页面信息的时候发生错误
                    routeConifg.component = BkError
                } else if (route.pageId !== -1) {
                // 判断是从storage读取数据还是数据库
                    const source = route.pageCode === editPageData.id ? editPageData.source : route.content
                    // 生成页面
                    const childCom = registerComponent(source, projectId + route.pageCode)
                    routeConifg.name = getRouteName(route)
                    routeConifg.component = childCom
                } else {
                    routeConifg.redirect = {
                        path: '/404'
                    }
                }
                // 携带 meta 信息
                if (route.meta) {
                    routeConifg.meta = route.meta
                }
            } catch (error) {
                // 前端构造页面的时候发生错误
                console.error(error)
                routeConifg.component = BkError
                routeConifg.meta = {
                    message: error.message || error
                }
            }

            return routeConifg
        })

        // 404
        if (layout.path !== '/') {
            children.push({ path: '*', component: BkNotFound })
        }

        routes.push({
            path: layout.path.replace(/^\//, ''),
            name: layout.name + uniqStr,
            component: parentCom,
            redirect: children[0].name ? { name: children[0].name } : null,
            children
        })
    }
    const noRoutePages = projectPageRouteList.filter(route => !route.id).map(route => {
        return {
            path: `${route.pageCode}404`,
            name: route.pageCode,
            redirect: { name: '404' }
        }
    })

    // 应用默认首页
    const defaultRoute = getProjectDefaultRoute(projectPageRouteList, projectRouteList, platform)

    const allRoutes = [
        {
            path: '/',
            name: 'previewHome',
            component: Home,
            redirect: (defaultRoute && defaultRoute?.id) ? { name: getRouteName(defaultRoute) } : null,
            children: [...routes, ...noRoutePages]
        },
        {
            path: '/404',
            name: '404',
            component: BkNotFound
        },
        {
            path: '*',
            redirect: { name: '404' }
        }
    ]
    return new VueRouter({
        mode: 'history',
        base: `/preview/project/${projectId}`,
        routes: allRoutes
    })
}
