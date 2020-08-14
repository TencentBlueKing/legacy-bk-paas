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
        currentProject: {}
    },
    mutations: {
        setCurrentProject (state, project) {
            state.currentProject = Object.assign({}, project)
        }
    },
    getters: {
        getCurrentProject: state => state.currentProject
    },
    actions: {
        create ({ commit }, { data, config }) {
            return http.post('/project/create', data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        query ({ commit }, { config }) {
            return http.get('/project/query', config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update ({ commit }, { data, config }) {
            return http.put('/project/update', data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        delete ({ commit }, { config }) {
            return http.delete('/project/delete', config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        favorite ({ commit }, { data, config }) {
            return http.post('/project/favorite', data, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        checkname ({ commit }, { data, config }) {
            return http.post('/project/checkname', data, config).then(response => {
                return response
            })
        },
        detail ({ commit }, { projectId }) {
            return http.get(`/project/detail?projectId=${projectId}`).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
