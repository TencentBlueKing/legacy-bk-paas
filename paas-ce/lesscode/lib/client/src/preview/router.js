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
import { bundless } from '@blueking/bundless'
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

// 生成路由
module.exports = (routeGroup, projectPageRouteList, projectRouteList, projectId, platform) => {
    const routes = []
    const curStorageData = localStorage.getItem('ONLINE_PREVIEW') || '{}'
    const curPageData = JSON.parse(curStorageData)

    for (const key in routeGroup) {
        const layout = routeGroup[key]

        // 父路由
        const parentCom = registerComponent(layout.content, layout.path)

        // 子路由
        const routeList = layout.children
        const children = routeList.map((route) => {
            const routeConifg = {
                path: route.path.replace(/^\//, '')
            }

            // 与vue-router保持一致，优先使用redirect
            if (route.redirectRoute) {
                routeConifg.name = getRouteName(route)
                routeConifg.redirect = {
                    path: getRouteFullPath(route.redirectRoute)
                }
            } else if (route.pageId !== -1) {
                const source = route.pageCode === curPageData.id
                    ? curPageData.source
                    : route.content

                const childCom = registerComponent(source, route.pageCode)
                routeConifg.name = getRouteName(route)
                routeConifg.component = childCom
            } else {
                routeConifg.redirect = {
                    path: '/404'
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

    // 项目默认首页
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
