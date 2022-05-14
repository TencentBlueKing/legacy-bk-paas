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
        create ({ commit }, data) {
            return http.post('/file/create', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update ({ commit }, data) {
            return http.put('/file/update', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getList ({ commit }, params) {
            return http.get('/file/list', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        del ({ commit }, data) {
            return http.delete('/file/del', { params: data }).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
