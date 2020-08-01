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
        create ({ commit }, { data = {} }) {
            return http.post('/page/create', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getList ({ commit }, { projectId }) {
            return http.get(`/page/getList?projectId=${projectId}`).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update ({ commit }, { data = {} }) {
            return http.put('/page/update', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        copy ({ commit }, { data = {} }) {
            return http.post('/page/copy', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        delete ({ commit }, { pageId }) {
            return http.delete(`/page/delete?pageId=${pageId}`).then(response => {
                const data = response.data || ''
                return data
            })
        },
        checkName ({ commit }, { data = {} }) {
            return http.post('/page/checkName', data).then(response => {
                return response.data || ''
            })
        },
        detail ({ commit }, { pageId }) {
            return http.get(`/page/detail?pageId=${pageId}`).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
