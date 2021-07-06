/**
 * @file router 配置
 * @author
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'

const BkMainEntry = () => import(/* webpackChunkName: 'entry' */'@/views/index')
const BkNotFound = () => import(/* webpackChunkName: 'entry' */'@/views/404')

Vue.use(VueRouter)

const routes = [
    {
        path: '/appMain',
        name: 'appMain',
        component: BkMainEntry
    },
    // 404
    {
        path: '*',
        name: '404',
        component: BkNotFound
    }
]

const router = new VueRouter({
    mode: 'history',
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
    store.commit('setMainContentLoading', true)

    preloading = true
    await preload()
    preloading = false

    const pageDataMethods = []
    const routerList = to.matched
    routerList.forEach(r => {
        Object.values(r.instances).forEach(vm => {
            if (typeof vm.fetchPageData === 'function') {
                pageDataMethods.push(vm.fetchPageData())
            }
            if (vm.$options.preload === 'function') {
                pageDataMethods.push(vm.$options.preload.call(vm))
            }
        })
    })

    pageMethodExecuting = true
    await Promise.all(pageDataMethods)
    pageMethodExecuting = false

    if (!preloading && !canceling && !pageMethodExecuting) {
        store.commit('setMainContentLoading', false)
    }

    const meta = to.meta || {}
    document.title = meta.pageName || 'index'
})

export default router
