/**
 * @file main entry
 * @author
 */

import Vue from 'vue'

import App from '@/App'
import router from '@/router'
import store from '@/store'
import { injectCSRFTokenToHeaders } from '@/api'
import auth from '@/common/auth'
import Img403 from '@/images/403.png'
import Exception from '@/components/exception'
import { bus } from '@/common/bus'
import '@/common/bkmagic'
import '@/common/bkui-vue-complex'
import renderHtml from '@/components/html'
${importElementLib}
import pureAxios from '@/api/pureAxios.js'
${importVantLib}
// 用户调用接口使用，无业务逻辑，直接返回数据
Vue.prototype.$http = pureAxios

Vue.component('app-exception', Exception)
Vue.component('render-html', renderHtml)

auth.requestCurrentUser().then(user => {
    injectCSRFTokenToHeaders()
    if (user.isAuthenticated) {
        global.bus = bus
        global.mainComponent = new Vue({
            el: '#app',
            router,
            store,
            components: { App },
            template: '<App/>'
        })
    } else {
        auth.redirectToLogin()
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
${remJs}