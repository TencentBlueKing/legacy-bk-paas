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

auth(projectId).then(() => {
    return Promise.all([pureAxios.get(`/projectCode/previewCode?projectId=${projectId}`), registerComponent(Vue, projectId)]).then(([res]) => {
        Vue.prototype.$http = pureAxios
        const data = res.data || {}
        const { router, App } = generateRouter(data.routeGroup)
        const store = generateStore(data.storeData)
        window.app = new Vue({
            el: '#preview-app',
            components: { App },
            router,
            store,
            template: '<App/>'
        })
    })
}).catch(errorHandle)
