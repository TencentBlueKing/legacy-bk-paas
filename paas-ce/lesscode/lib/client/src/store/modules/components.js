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
            return http.get('/component/list', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        useing (state, params = {}) {
            return http.get('/component/useing', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        detail (state, params) {
            return http.get('/component/detail', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        create (state, params) {
            return http.post('/component/create', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update (state, params) {
            return http.post('/component/update', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        upload () {
            return http.get('/component/upload').then(response => {
                const data = response.data || ''
                return data
            })
        },

        categoryList (state) {
            return http.get('/componentCategory/list').then(response => {
                const data = response.data || ''
                return data
            })
        },

        categoryCreate (state, params) {
            return http.post('/componentCategory/create', params).then(response => {
                const data = response.data || ''
                return data
            })
        },
        categoryUpdate (state, params) {
            return http.post('/componentCategory/update', params).then(response => {
                const data = response.data || ''
                return data
            })
        },

        categoryDelete (stae, params) {
            return http.delete('/componentCategory/delete', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
