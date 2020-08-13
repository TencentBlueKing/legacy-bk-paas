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
import Vuex from 'vuex'

import drag from './modules/drag'
import vueCode from './modules/vue-code'
import project from './modules/project'
import components from './modules/components'
import page from './modules/page'
import functions from './modules/functions'
import http from '@/api'
import { unifyObjectStyle, json2Query } from '@/common/util'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 模块
    modules: {
        drag,
        vueCode,
        project,
        components,
        page,
        functions
    },
    // 公共 store
    state: {
        mainContentLoading: false,
        // 系统当前登录用户
        user: {}
    },
    // 公共 getters
    getters: {
        mainContentLoading: state => state.mainContentLoading,
        user: state => state.user
    },
    // 公共 mutations
    mutations: {
        /**
         * 设置内容区的 loading 是否显示
         *
         * @param {Object} state store state
         * @param {boolean} loading 是否显示 loading
         */
        setMainContentLoading (state, loading) {
            state.mainContentLoading = loading
        },

        /**
         * 更新当前用户 user
         *
         * @param {Object} state store state
         * @param {Object} user user 对象
         */
        updateUser (state, user) {
            state.user = Object.assign({}, user)
        }
    },
    actions: {
        /**
         * 获取用户信息
         *
         * @param {Function} commit store commit mutation handler
         * @param {Object} state store state
         * @param {Function} dispatch store dispatch action handler
         *
         * @return {Promise} promise 对象
         */
        userInfo ({ commit, state, dispatch }, config) {
            return http.get('/user/userinfo', config).then(response => {
                const userData = response.data || {}
                commit('updateUser', userData)
                return userData
            })
        },

        testApi () {
            return http.post('/test/posttest').then(response => {
                const data = response.data || {}
                return data
            })
        },

        getApiData ({ state }, data) {
            return http.post('/data/getApiData', data, { globalError: false }).then(response => {
                return response
            })
        },

        // x-table
        remove (context, params, config) {
            return http.delete(`/test/remove?${json2Query(params)}`, {}, config).then(res => {
                return res
            })
        },
        // x-table
        getTable (context, params, config) {
            return http.get(`/test/getTable?${json2Query(params)}`, {}, config).then(res => {
                return res
            })
        }
    }
})

/**
 * hack vuex dispatch, add third parameter `config` to the dispatch method
 *
 * @param {Object|string} _type vuex type
 * @param {Object} _payload vuex payload
 * @param {Object} config config 参数，主要指 http 的参数，详见 src/api/index initConfig
 *
 * @return {Promise} 执行请求的 promise
 */
store.dispatch = function (_type, _payload, config = {}) {
    const { type, payload } = unifyObjectStyle(_type, _payload)

    const action = { type, payload, config }
    const entry = store._actions[type]
    if (!entry) {
        if (NODE_ENV === 'development') {
            console.error(`[vuex] unknown action type: ${type}`)
        }
        return
    }

    store._actionSubscribers.forEach(sub => {
        return sub(action, store.state)
    })

    return entry.length > 1
        ? Promise.all(entry.map(handler => handler(payload, config)))
        : entry[0](payload, config)
}

export default store
