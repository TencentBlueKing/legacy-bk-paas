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
import VueDraggable from 'vuedraggable'

import App from '@/App'
import router from '@/router'
import store from '@/store'
import { injectCSRFTokenToHeaders } from '@/api'
import auth from '@/common/auth'
import Img403 from '@/images/403.png'
import Exception from '@/components/exception'
import { bus } from '@/common/bus'
import header from '@/components/header.vue'
import '@/common/bkmagic'
import '@icon-cool/bk-icon-vue-drag-vis'
import '@icon-cool/bk-icon-vue-drag-vis/src/index'
import VueContextMenu from '@xunlei/vue-context-menu'
import targetData from '@/common/targetData.js'
import pureAxios from '@/api/pureAxios.js'
// 用户调用接口使用，无业务逻辑，直接返回数据
Vue.prototype.$http = pureAxios
Vue.prototype.$td = targetData

Vue.use(VueContextMenu)

Vue.component('VueDraggable', VueDraggable)
Vue.component('app-exception', Exception)
Vue.component('app-header', header)

auth.requestCurrentUser().then(user => {
    injectCSRFTokenToHeaders()
    if (!user.isAuthenticated) {
        auth.redirectToLogin()
    } else {
        global.bus = bus
        global.mainComponent = new Vue({
            el: '#app',
            components: { App },
            router,
            store,
            template: '<App/>'
        })
    }
}, err => {
    let message
    if (err.status === 403) {
        message = 'Sorry，您的权限不足!'
        if (err.data && err.data.msg) {
            message = err.data.msg
        }
    } else {
        message = '无法连接到后端服务，请稍候再试。'
    }

    const divStyle = ''
        + 'text-align: center;'
        + 'width: 400px;'
        + 'margin: auto;'
        + 'position: absolute;'
        + 'top: 50%;'
        + 'left: 50%;'
        + 'transform: translate(-50%, -50%);'

    const h2Style = 'font-size: 20px;color: #979797; margin: 32px 0;font-weight: normal'

    const content = ''
        + `<div class="bk-exception bk-exception-center" style="${divStyle}">`
        + `<img src="${Img403}"><h2 class="exception-text" style="${h2Style}">${message}</h2>`
        + '</div>'

    document.write(content)
})
