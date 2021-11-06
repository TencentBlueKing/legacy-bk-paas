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
const variablePerfix = '/variable'

export default {
    namespaced: true,
    state: {
        variableList: [],
        variableFormData: {}
    },
    mutations: {
        setVariableFormData (state, data) {
            state.variableFormData = data
        },
        setVariableList (state, variableList) {
            state.variableList = variableList
        },
        addVariable (state, data) {
            state.variableList.unshift(data)
        },
        editVariable (state, data) {
            const curState = state.variableList.find(variable => variable.id === data.id)
            Object.assign(curState, JSON.parse(JSON.stringify(data)))
        },
        deleteVariable (state, id) {
            const index = state.variableList.findIndex(variable => variable.id === id)
            state.variableList.splice(index, 1)
        }
    },
    getters: {
        variableList: state => state.variableList,
        variableFormData: state => state.variableFormData
    },
    actions: {
        setVariableFormData ({ commit }, data) {
            commit('setVariableFormData', data)
        },

        getAllProjectVariable ({ commit }, params) {
            return http.get(`${variablePerfix}/getAllVariable`, { params }).then(response => {
                const data = response.data || []
                return data
            })
        },

        getAllVariable ({ commit }, params, isCommit = true) {
            return http.get(`${variablePerfix}/getAllVariable`, { params }).then(response => {
                const data = response.data || []
                isCommit && commit('setVariableList', data)
                return data
            })
        },

        addVariable ({ commit }, data) {
            return http.put(`${variablePerfix}/addVariable`, data).then(response => {
                if (response.code === 499) throw new Error(response.message)
                const data = response.data || []
                data.defaultValue = JSON.parse(data.defaultValue || '{}')
                commit('addVariable', data)
                return data
            })
        },

        editVariable ({ commit }, data) {
            return http.post(`${variablePerfix}/editVariable`, data).then(response => {
                if (response.code === 499) throw new Error(response.message)
                const data = response.data || []
                data.defaultValue = JSON.parse(data.defaultValue || '{}')
                commit('editVariable', data)
                return data
            })
        },

        deleteVariable ({ commit }, id) {
            return http.delete(`${variablePerfix}/deleteVariable?id=${id}`).then(() => {
                commit('deleteVariable', id)
            })
        }
    }
}
