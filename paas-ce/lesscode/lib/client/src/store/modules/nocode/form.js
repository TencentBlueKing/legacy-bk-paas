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
const perfix = '/nocode-form'

export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        formDetail ({ state }, { formId }) {
            return http.get(`${perfix}/detail`, { params: { formId } }).then(response => {
                const detail = response.data || {}
                return detail
            })
        },

        createForm ({ state }, data) {
            return http.post(`${perfix}/create`, data).then(response => {
                return response.data || {}
            })
        },

        updateForm ({ state }, data) {
            return http.put(`${perfix}/update`, data).then(response => {
                return response.data || {}
            })
        },

        deleteForm ({ state }, id) {
            return http.delete(`${perfix}/delete?id=${id}`).then(response => {
                const userData = response.data || []
                return userData
            })
        }
    }
}
