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
Vue.use(VueRouter)

const uniqStr = uuid()
let router = {}

function registerComponent (code) {
    code = code.replace('export default', 'module.exports =')
    return httpVueLoader(code)
}

const BkNotFound = registerComponent(`
    <template>
        <bk-exception class="exception-wrap-item" type="404">
            <span>页面不存在</span>
        </bk-exception>
    </template>

    <script>
        export default {
            data () {
                return {}
            }
        }
    </script>

    <style scoped>
        .exception-wrap-item {
            margin: 150px auto 0 !important;
            height: 420px;
            padding-top: 22px;
        }
    </style>
`)

function generateApp (defaultPushData) {
    return registerComponent(`
        <template>
            <div id="app">
                <router-view></router-view>
            </div>
        </template>
        <script>
            export default {
                name: 'app',
                created () {
                    if ('${defaultPushData}') this.$router.replace(${JSON.stringify(defaultPushData)})
                }
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

// 初始化路由地址
let defaultPushData = ''
window.addEventListener('message', (res) => {
    const data = res.data || {}
    if (data.type !== 'initRouter') return
    const fullPath = data.fullPath || ''
    const query = data.query || {}
    const pageCode = query.pageCode || ''
    const pushObj = {}
    if (pageCode) {
        pushObj.name = pageCode
    } else if (fullPath) {
        pushObj.path = fullPath
    }
    if (router.push) {
        router.push(pushObj)
    } else {
        defaultPushData = pushObj
    }
})

// 生成路由
module.exports = (dataMap) => {
    const routes = []
    for (const key in dataMap) {
        const layout = dataMap[key]
        // 父路由
        const parentCom = registerComponent(layout.content)
        // 子路由
        const routeList = layout.children
        const children = routeList.map((route) => {
            const childCom = registerComponent(route.content)
            return { path: route.path.replace(/^\//, ''), name: route.pageCode, component: childCom }
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
    router = new VueRouter({
        mode: 'history',
        routes: [{
            path: '/',
            name: 'previewHome',
            component: Home,
            children: routes
        },
        {
            path: '*',
            name: '404',
            component: BkNotFound
        }]
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
            fullPath: route.fullPath
        }
        window.parent.postMessage(data, '\*')
    })
    const App = generateApp(defaultPushData)
    return { router, App }
}
