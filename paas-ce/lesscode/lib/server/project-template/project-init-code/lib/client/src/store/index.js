/**
 * @file main store
 * @author
 */

import Vue from 'vue'
import Vuex from 'vuex'

import example from './modules/example'
import variable from './modules/variable'
import http from '@/api'
import { unifyObjectStyle } from '@/common/util'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 模块
    modules: {
        example,
        variable
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
         * @param {Object} context store 上下文对象 { commit, state, dispatch }
         *
         * @return {Promise} promise 对象
         */
        userInfo (context, config = {}) {
            return http.get(USER_INFO_URL).then(response => {
                const userData = response.data || {}
                context.commit('updateUser', userData)
                return userData
            })
        },

        // 调用转发接口
        getApiData ({ state }, data) {
            return http.post('/data/getApiData', data, { globalError: false }).then(response => {
                return response
            })
        },

        signOut (context) {
            context.commit('updateUser', {})
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
        if (NODE_ENV !== 'production') {
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
