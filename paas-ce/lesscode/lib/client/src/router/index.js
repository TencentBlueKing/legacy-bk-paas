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

const MainEntry = () => import(/* webpackChunkName: 'index' */'@/views')
const Index = () => import(/* webpackChunkName: 'index' */'@/views/index/index')
const Preview = () => import(/* webpackChunkName: 'preview' */'@/views/preview')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404')

const MainHelpEntry = () => import(/* webpackChunkName: 'index' */'@/views/help')
const AnimateNumber = () => import(/* webpackChunkName: 'animate-number' */'@/views/help/docs/animate-number.md')
const Badge = () => import(/* webpackChunkName: 'badge' */'@/views/help/docs/badge.md')
const CheckboxGroup = () => import(/* webpackChunkName: 'checkbox-group' */'@/views/help/docs/checkbox-group.md')
const Custom = () => import(/* webpackChunkName: 'custom' */'@/views/help/docs/custom.md')
const DatePicker = () => import(/* webpackChunkName: 'date-picker' */'@/views/help/docs/date-picker.md')
const Diff = () => import(/* webpackChunkName: 'diff' */'@/views/help/docs/diff.md')
const Exception = () => import(/* webpackChunkName: 'exception' */'@/views/help/docs/exception.md')
const Grid = () => import(/* webpackChunkName: 'grid' */'@/views/help/docs/grid.md')
const Intro = () => import(/* webpackChunkName: 'intro' */'@/views/help/docs/intro.md')
const Pagination = () => import(/* webpackChunkName: 'pagination' */'@/views/help/docs/pagination.md')
const Progress = () => import(/* webpackChunkName: 'progress' */'@/views/help/docs/progress.md')
const RadioGroup = () => import(/* webpackChunkName: 'radio-group' */'@/views/help/docs/radio-group.md')
const Rate = () => import(/* webpackChunkName: 'rate' */'@/views/help/docs/rate.md')
const RoundProgress = () => import(/* webpackChunkName: 'round-progress' */'@/views/help/docs/round-progress.md')
const SearchSelect = () => import(/* webpackChunkName: 'search-select' */'@/views/help/docs/search-select.md')
const Select = () => import(/* webpackChunkName: 'select' */'@/views/help/docs/select.md')
const Slider = () => import(/* webpackChunkName: 'slider' */'@/views/help/docs/slider.md')
const Start = () => import(/* webpackChunkName: 'start' */'@/views/help/docs/start.md')
const Steps = () => import(/* webpackChunkName: 'steps' */'@/views/help/docs/steps.md')
const Swiper = () => import(/* webpackChunkName: 'swiper' */'@/views/help/docs/swiper.md')
const Switcher = () => import(/* webpackChunkName: 'switcher' */'@/views/help/docs/switcher.md')
const Tab = () => import(/* webpackChunkName: 'tab' */'@/views/help/docs/tab.md')
const Table = () => import(/* webpackChunkName: 'table' */'@/views/help/docs/table.md')
const TagInput = () => import(/* webpackChunkName: 'tag-input' */'@/views/help/docs/tag-input.md')
const TimePicker = () => import(/* webpackChunkName: 'time-picker' */'@/views/help/docs/time-picker.md')
const Timeline = () => import(/* webpackChunkName: 'timeline' */'@/views/help/docs/timeline.md')
const Transfer = () => import(/* webpackChunkName: 'transfer' */'@/views/help/docs/transfer.md')
const Tree = () => import(/* webpackChunkName: 'tree' */'@/views/help/docs/tree.md')
const Upload = () => import(/* webpackChunkName: 'upload' */'@/views/help/docs/upload.md')
const ZoomImage = () => import(/* webpackChunkName: 'zoom-image' */'@/views/help/docs/zoom-image.md')

const routes = [
    {
        path: `/${APP_CODE}`,
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
        path: '/help',
        component: MainHelpEntry,
        children: [
            { path: 'animate-number', name: 'animateNumber', component: AnimateNumber },
            { path: 'badge', name: 'badge', component: Badge },
            { path: 'checkbox-group', name: 'checkboxGroup', component: CheckboxGroup },
            { path: 'custom', name: 'custom', component: Custom },
            { path: 'date-picker', name: 'datePicker', component: DatePicker },
            { path: 'diff', name: 'diff', component: Diff },
            { path: 'exception', name: 'exception', component: Exception },
            { path: 'grid', name: 'grid', component: Grid },
            { path: 'intro', name: 'intro', component: Intro, alias: '' },
            { path: 'pagination', name: 'pagination', component: Pagination },
            { path: 'progress', name: 'progress', component: Progress },
            { path: 'radio-group', name: 'radioGroup', component: RadioGroup },
            { path: 'rate', name: 'rate', component: Rate },
            { path: 'round-progress', name: 'roundProgress', component: RoundProgress },
            { path: 'search-select', name: 'searchSelect', component: SearchSelect },
            { path: 'select', name: 'select', component: Select },
            { path: 'slider', name: 'slider', component: Slider },
            { path: 'start', name: 'start', component: Start },
            { path: 'steps', name: 'steps', component: Steps },
            { path: 'swiper', name: 'swiper', component: Swiper },
            { path: 'switcher', name: 'switcher', component: Switcher },
            { path: 'tab', name: 'tab', component: Tab },
            { path: 'table', name: 'table', component: Table },
            { path: 'tag-input', name: 'tagInput', component: TagInput },
            { path: 'time-picker', name: 'timePicker', component: TimePicker },
            { path: 'timeline', name: 'timeline', component: Timeline },
            { path: 'transfer', name: 'transfer', component: Transfer },
            { path: 'tree', name: 'tree', component: Tree },
            { path: 'upload', name: 'upload', component: Upload },
            { path: 'zoom-image', name: 'zoomImage', component: ZoomImage }
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
