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
const perfix = '/function'

export default {
    namespaced: true,
    state: {
        // 画布区域使用的函数数据，在画布初始化和画布函数更新的是会更新这个值
        funcGroups: []
    },
    mutations: {
        setFunctionData (state, funcGroups) {
            state.funcGroups = funcGroups || []
        }
    },
    getters: {
        // 分组数据（包含函数数据），只在画布区域有值，方便画布传递数据使用
        funcGroups (state) {
            return state.funcGroups
        },
        // 函数列表，只在画布区域有值，方便画布传递数据使用
        functionList (state) {
            return state.funcGroups.map(group => group.children).flat()
        }
    },
    actions: {
        getAllGroupAndFunction (_, params) {
            return http.get(`${perfix}/getAllGroupAndFunction`, { params }).then((res = {}) => {
                return res.data || []
            })
        },

        getGroupList (_, params) {
            return http.get(`${perfix}/getGroupList`, { params }).then((res = {}) => {
                return res.data || []
            })
        },

        getFunctionList (_, params) {
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
        },

        createFunctionGroup (_, data) {
            return http.post(`${perfix}/createFunctionGroup`, data).then((res = {}) => {
                return res.data
            })
        },

        deleteFunctionGroup (_, params) {
            return http.delete(`${perfix}/deleteFunctionGroup`, { params }).then((res) => {
                return res.data
            })
        },

        editFunctionGroups (_, groups) {
            return http.put(`${perfix}/editFunctionGroups`, groups)
        },

        fixFunByEslint (_, params) {
            return http.post(`${perfix}/fixFunByEslint`, params, { globalError: false }).then((res) => {
                return res.data
            })
        }
    }
}
