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
const perfix = '/function-market'

export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        getFunctionList ({ state }) {
            return http.get(`${perfix}/getFunctionList`).then((res = {}) => {
                return res.data || []
            })
        },

        bulkCreateFunction (_, funcList) {
            return http.post(`${perfix}/bulkCreateFunction`, funcList).then((res = {}) => {
                return res.data
            })
        },

        createFunction (_, func) {
            return http.post(`${perfix}/createFunction`, func).then((res = {}) => {
                return res.data
            })
        },

        updateFunction (_, func) {
            return http.put(`${perfix}/updateFunction`, func).then((res = {}) => {
                return res.data
            })
        },

        deleteFunction (_, id) {
            return http.delete(`${perfix}/deleteFunction?id=${id}`).then((res = {}) => {
                return res.data
            })
        },

        createFunctionFromMarket (_, postData) {
            return http.post(`${perfix}/createFunctionFromMarket`, postData).then((res = {}) => {
                return res.data
            })
        }
    }
}
