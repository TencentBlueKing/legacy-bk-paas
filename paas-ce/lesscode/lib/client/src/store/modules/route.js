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
        layoutPageList: []
    },
    mutations: {
        setLayoutPageList (state, payload) {
            state.layoutPageList = Object.freeze(payload)
        }
    },
    getters: {
    },
    actions: {
        query ({ commit }, { config }) {
            return http.get('/route/query', config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getProjectRouteGroup ({ commit }, { projectId, config }) {
            return http.get(`/route/project/${projectId}`, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        find ({ commit }, { pageId, config }) {
            return http.get(`/route/page/${pageId}`, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        save ({ commit }, { data, config }) {
            const pageId = (!data.pageId || data.pageId === -1) ? '' : data.pageId
            return http.put(`/route/page/${pageId}`, data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        create ({ commit }, { data, config }) {
            return http.post(`/route/project/${data.projectId}`, data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        updatePageRoute ({ commit }, { data, config }) {
            return http.post(`/route/page-route/${data.pageId}`, data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        layoutPageList ({ commit }, { pageId, config }) {
            return http.get(`/route/layout/page/${pageId}`, config).then(response => {
                const data = response.data || []
                commit('setLayoutPageList', data)
            })
        }
    }
}
