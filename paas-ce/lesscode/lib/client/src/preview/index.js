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
import Vue from 'vue'
import pureAxios from '@/api/pureAxios.js'
import { auth, errorHandle } from './auth'
import registerComponent from './component'
import generateRouter from './router'
import generateStore from './store'

// 解析 url 参数
const location = window.parent.location
const projectIdReg = new RegExp(`${location.origin}/preview/project/(\\d+)`)
const [, projectId] = projectIdReg.exec(location.href) || []

const storageKey = `preview-project-version-${projectId}`
const versionId = new URLSearchParams(location.search).get('v') || sessionStorage.getItem(storageKey) || ''
if (versionId) {
    sessionStorage.setItem(storageKey, versionId)
}

// 获取初始化路由
let proxyResolve
const getDefaultRoute = new Promise(resolve => {
    proxyResolve = resolve
})
window.addEventListener('message', ({ data }) => {
    const { type, ...route } = data
    if (type !== 'initRouter') {
        return
    }
    proxyResolve && proxyResolve(route)
})

auth(projectId).then(() => {
    return Promise.all([pureAxios.get(`/projectCode/previewCode?projectId=${projectId}&versionId=${versionId}`), registerComponent(Vue, projectId, versionId)]).then(([res]) => {
        Vue.prototype.$http = pureAxios
        const data = res.data || {}
        const projectPageRouteList = (data.pageRouteList || []).map(item => ({
            ...item,
            fullPath: item.id ? `${item.layoutPath}${item.layoutPath.endsWith('/') ? '' : '/'}${item.path}` : ''
        }))
        const projectRouteList = (Object.values(data.routeGroup) || []).map(({ children }) => children)
            .reduce((pre, cur) => pre.concat(cur), [])
            .map(({ id, layoutPath, path, redirect, pageCode }) => ({
                id,
                layoutPath,
                path,
                redirect,
                pageCode,
                fullPath: `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
            }))
        const { router, App } = generateRouter(data.routeGroup, projectPageRouteList)
        const store = generateStore(data.storeData, { projectPageRouteList, projectRouteList })
        window.app = new Vue({
            el: '#preview-app',
            components: { App },
            router,
            store,
            async created () {
                const defaultRoute = await getDefaultRoute

                const { fullPath, query } = defaultRoute
                // 当前预览的页面
                let pageCode = query.pageCode

                // 刷新404页面时，使用404带的pageCode
                if (fullPath.startsWith('/404')) {
                    pageCode = query.p
                }

                const { projectPageRouteList } = this.$store.state
                let pageRoute
                if (pageCode) {
                    pageRoute = projectPageRouteList.find(item => item.pageCode === pageCode)
                } else if (/^\/(\?v=\d+)*$/.test(fullPath)) {
                    // 判定为项目预览，找到父路由是/的页面
                    pageRoute = this.getProjectDefaultHome()
                    pageCode = ''
                } else if (fullPath) {
                    // 刷新
                    this.$router.replace({ path: fullPath })
                    return
                }

                if (pageRoute && pageRoute.id) {
                    const { resolved } = router.resolve({ path: pageRoute.fullPath })
                    if (resolved.name === '404') {
                        // 绑定的跳转路由可能未绑定页面或路由
                        this.$router.replace({ path: '/404', query: { p: pageCode } })
                    } else {
                        this.$router.replace({ path: pageRoute.fullPath, query: { pageCode: pageRoute.pageCode } })
                    }
                } else {
                    this.$router.replace({ path: '/404', query: { p: pageCode } })
                }
            },
            methods: {
                getProjectDefaultHome () {
                    const { projectRouteList, projectPageRouteList } = this.$store.state
                    const defaultHome = projectRouteList.find(item => item.fullPath === '/')
                    if (defaultHome) {
                        return defaultHome
                    }
                    // 否则返回第1个父路由为/的有效路由
                    const rootPathRoute = projectPageRouteList.find(item => item.layoutPath === '/')
                    if (rootPathRoute && rootPathRoute.id) {
                        return rootPathRoute
                    }

                    // 返回项目的第1个路由
                    return projectRouteList[0]
                }
            },
            template: '<App/>'
        })
    })
}).catch(errorHandle)
