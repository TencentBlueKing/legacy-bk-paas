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
import { uuid } from '@/common/util'
import VueRouter from 'vue-router'
import Vue from 'vue'

import BkNotFound from './children/404.vue'

Vue.use(VueRouter)

const uniqStr = uuid()
let router = {}

function registerComponent (code) {
    code = code.replace('export default', 'module.exports =')
    return httpVueLoader(code)
}

function generateApp () {
    return registerComponent(`
        <template>
            <div id="app">
                <router-view></router-view>
            </div>
        </template>
        <script>
            export default {
                name: 'app'
            }
        </script>
        <style>
            * {
                box-sizing: border-box;
            }
            html,body {
                margin: 0;
                padding: 0;
            }
            ul,li {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            dl,dt,dd,p {
                margin: 0;
                padding: 0;
            }
            a {
                text-decoration: none;
            }
            button {
                outline: none;
            }
            table {
                border-collapse: collapse;
                border-spacing: 0;
            }
            td,th {
                padding: 0;
            }
            .navigation-bar {
                width: 100%;
                height: 100%;
            }
            .navigation-bar-container {
                width: 100%;
                max-width: 100%;
            }
            .bk-navigation {
                min-width: 1360px;
            }
            .bk-navigation-wrapper .navigation-container {
                max-width: 100% !important;
            }
            .navigation-header .tippy-popper .tippy-tooltip.navigation-message-theme {
                padding: 0;
                border-radius: 0;
                -webkit-box-shadow: none;
                box-shadow: none;
            }
        </style>
    `)
}

const Home = registerComponent(`
    <template>
        <router-view></router-view>
    </template>
    <script>
        export default {
            name: 'Home'
        }
    </script>
`)

// 生成路由
module.exports = (routeGroup, projectPageRouteList) => {
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
    router = new VueRouter({
        mode: 'history',
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
    router.beforeEach(async (to, from, next) => {
        if (to.fullPath === '/preview.html') return
        next()
    })
    // 传递url信息
    router.afterEach((route) => {
        const data = {
            type: 'preview',
            name: route.name,
            fullPath: route.fullPath,
            query: route.query
        }
        window.parent.postMessage(data, '\*')
    })
    const App = generateApp()
    return { router, App }
}
