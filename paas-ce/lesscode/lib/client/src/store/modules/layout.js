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

import http from '@/api'

export default {
    namespaced: true,
    state: {
        pageLayout: {}
    },
    mutations: {
        setPageLayout (state, payload) {
            state.pageLayout = Object.freeze(payload)
        }
    },
    getters: {
        pageLayout: state => state.pageLayout
    },
    actions: {
        getPlatformList ({ state }) {
            return http.get('/layout/getPlatformList').then(response => {
                const data = response.data || []
                return data
            })
        },
        getList ({ state }, params) {
            return http.get('/layout/getList', { params }).then(response => {
                const data = response.data || []
                return data
            })
        },
        getFullList ({ state }, params) {
            return http.get('/layout/getFullList', { params }).then(response => {
                const data = response.data
                return data
            })
        },
        getPageLayout ({ commit }, { pageId }) {
            return http.get(`/layout/page?id=${pageId}`).then(response => {
                const data = response.data
                commit('setPageLayout', data)
                return data
            })
        },
        create ({ commit }, { data, config }) {
            return http.post(`/layout/create`, data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update ({ commit }, { data, config }) {
            return http.post(`/layout/update`, data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        checkName ({ commit }, { data = {} }) {
            return http.post('/layout/checkName', data).then(response => {
                return response.data || ''
            })
        },
        delete ({ commit }, data) {
            return http.delete('/layout/delete', { params: data }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        default ({ commit }, { data, config }) {
            return http.post('/layout/default', data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        setRoutePath ({ commit }, data) {
            return http.put('/layout/routePath', data).then(({ data }) => data)
        }
    }
}
