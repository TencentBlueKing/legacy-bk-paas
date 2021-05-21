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
import Vuex from 'vuex'
import pureAxios from '@/api/pureAxios.js'
Vue.use(Vuex)

function getVariableModule (storeData) {
    function getInitVariableValue (defaultValue, defaultValueType) {
        let val = defaultValue.all
        if (defaultValueType === 1) val = defaultValue[window.BKPAAS_ENVIRONMENT]
        return val
    }
    const state = {};
    (storeData || []).forEach(({ variableCode, defaultValue, defaultValueType }) => {
        state[variableCode] = getInitVariableValue(defaultValue, defaultValueType)
    })
    return {
        namespaced: true,
        state,
        mutations: {
            setBkProjectVariable (state, { code, val }) {
                state[code] = val
            }
        },
        actions: {
            setBkProjectVariable ({ commit }, variableData) {
                commit('setBkProjectVariable', variableData)
            }
        }
    }
}

function getStore (variable) {
    return new Vuex.Store({
        modules: {
            variable
        },
        state: {
            user: {}
        },
        getters: {
            user: state => state.user
        },
        mutations: {
            updateUser (state, user) {
                state.user = Object.assign({}, user)
            }
        },
        actions: {
            userInfo ({ commit }, config) {
                return pureAxios.get('/user/userinfo', config).then(response => {
                    const userData = response.data || {}
                    userData.isAuthenticated = userData.code !== 'Unauthorized'
                    commit('updateUser', userData)
                    return userData
                })
            },
            getApiData ({ state }, data) {
                const parent = window.parent || {}
                const parentLocation = parent.location || {}
                const url = parentLocation.href
                const exp = new RegExp(`${parentLocation.origin}/preview/project/([^/]+)`)
                const res = exp.exec(url) || []
                const projectId = res[1] || ''
                const postData = {
                    projectId,
                    ...data
                }
                return pureAxios.post('/data/getApiData', postData, { globalError: false }).then(response => {
                    return response
                })
            }
        }
    })
}

module.exports = (storeData) => {
    const variableModule = getVariableModule(storeData)
    const store = getStore(variableModule)
    return store
}
