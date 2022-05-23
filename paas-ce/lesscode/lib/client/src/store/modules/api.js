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
const perfix = '/api-manage'

export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        getCategoryAndApiList (_, params) {
            return http.get(`${perfix}/getAllGroupAndFunction`, { params }).then((res = {}) => {
                return res.data || []
            })
        },

        createCategory (_, params) {
            return http.post(`${perfix}/category`, params).then((res = {}) => {
                return res.data
            })
        },

        deleteCategory (_, params) {
            return http.delete(`${perfix}/category`, { params }).then((res) => {
                return res.data
            })
        },

        editCategory (_, params) {
            return http.put(`${perfix}/category`, params)
        },

        getCategoryList (_, params) {
            return http.get(`${perfix}/category`, { params }).then((res = {}) => {
                return res.data || []
            })
        },

        getApiList (_, params) {
            return http.get(`${perfix}/getFunctionList`, { params }).then((res = {}) => {
                return res.data || []
            })
        },

        bulkCreateFunction (_, params) {
            return http.post(`${perfix}/bulkCreateFunction`, params).then((res = {}) => {
                return res.data || []
            })
        },

        createFunction (_, func) {
            return http.post(`${perfix}/createFunction`, func, { globalError: false }).then((res = {}) => {
                return res.data || {}
            })
        },

        deleteFunction (_, id) {
            return http.delete(`${perfix}/deleteFunction`, { params: { id } }).then((res) => {
                return res.data
            })
        },

        editFunction (_, func) {
            return http.put(`${perfix}/editFunction`, func, { globalError: false }).then((res) => {
                return res.data || {}
            })
        }
    }
}
