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
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        list (state, params = {}) {
            return http.get('/pageTemplate/list', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        listByCategory (state, { projectId }) {
            return http.get(`/pageTemplate/listByCategory?projectId=${projectId}`).then(response => {
                const data = response.data || ''
                return data
            })
        },
        detail (state, params = {}) {
            return http.get('/pageTemplate/detail', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        checkIsExist (state, params = {}) {
            return http.post(`/pageTemplate/checkIsExist`, params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        create (state, params) {
            return http.post(`/pageTemplate/create`, params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        apply (state, params = {}) {
            return http.post(`pageTemplate/apply`, params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update (state, params = {}) {
            return http.post('/pageTemplate/update', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        delete ({ commit }, { templateId }) {
            return http.delete(`/pageTemplate/delete?templateId=${templateId}`).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryCount (state, { projectId }) {
            return http.get(`/pageTemplate/categoryCount?projectId=${projectId}`).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryList (state, params = {}) {
            return http.get(`/pageTemplateCategory/list`, { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryCreate (state, params) {
            return http.post('/pageTemplateCategory/create', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryUpdate (state, params) {
            return http.post('/pageTemplateCategory/update', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categorySort (state, params) {
            return http.post('/pageTemplateCategory/sort', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryDelete (state, params) {
            return http.delete('/pageTemplateCategory/delete', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
