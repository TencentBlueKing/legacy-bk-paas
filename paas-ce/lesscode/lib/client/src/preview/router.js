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
import httpVueLoader from '@/common/http-vue-loader'
import { uuid } from 'shared/util'
import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from './children/home.vue'
import BkNotFound from './children/404.vue'

Vue.use(VueRouter)
const uniqStr = uuid()

function registerComponent (code) {
    code = code.replace('export default', 'module.exports =')
    return httpVueLoader(code)
}

// 生成路由
module.exports = (routeGroup, projectPageRouteList, projectId) => {
    const routes = []
    for (const key in routeGroup) {
        const layout = routeGroup[key]
        // 父路由
        const parentCom = registerComponent(layout.content)
        // 子路由
        const routeList = layout.children
        const children = routeList.map((route) => {
            const routeConifg = {
                path: route.path.replace(/^\//, '')
            }

            // 与vue-router保持一致，优先使用redirect
            if (route.redirectRoute) {
                const { layoutPath, path } = route.redirectRoute
                // 导航菜单会通过name跳转所以仍然需要name，未绑定页面的路由使用跳转路径作为name
                const fullPath = `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
                routeConifg.name = route.pageCode || fullPath.replace(/[\/\-\:]/g, '')
                routeConifg.redirect = {
                    path: fullPath
                }
            } else if (route.pageId !== -1) {
                const childCom = registerComponent(route.content)
                routeConifg.name = route.pageCode
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
    return new VueRouter({
        mode: 'history',
        base: `/preview/project/${projectId}`,
        routes: [
            {
                path: '/',
                name: 'previewHome',
                component: Home,
                children: [...routes, ...noRoutePages]
            },
            {
                path: '/404',
                name: '404',
                component: BkNotFound
            }
        ]
    })
}
