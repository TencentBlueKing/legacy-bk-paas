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
const perfix = '/user'

export default {
    namespaced: true,
    state: {
        userPerm: {}
    },
    mutations: {
        setUserPerm (state, perm) {
            state.userPerm = perm
        }
    },
    getters: {
        userPerm (state) {
            return state.userPerm
        }
    },
    actions: {
        getAllUser () {
            return http.get(`${perfix}/getAllUser`).then(response => {
                const userData = response.data || []
                return userData
            })
        },

        getMember ({ state }, { projectId, name }) {
            return http.get(`${perfix}/getMember`, { params: { projectId, name } }).then(response => {
                const userData = response.data || []
                return userData
            })
        },

        addMembers ({ state }, data) {
            return http.post(`${perfix}/addMembers`, data).then(response => {
                const userData = response.data || []
                return userData
            })
        },

        editMember ({ state }, member) {
            return http.put(`${perfix}/editMember`, member).then(response => {
                const userData = response.data || []
                return userData
            })
        },

        deleteMember ({ state }, id) {
            return http.delete(`${perfix}/deleteMember?id=${id}`).then(response => {
                const userData = response.data || []
                return userData
            })
        },
             
        // 删除多个成员
        deleteMultipleMember ({ state }, ids) {
            return http.delete(`${perfix}/deleteMultipleMember?ids=${ids}`).then(response => {
                const userData = response.data || []
                return userData
            })
        },

        setCurUserPermInfo ({ commit }, project) {
            return http.post(`${perfix}/setCurUserPermInfo`, project).then(response => {
                const permInfo = response.data || {}
                commit('setUserPerm', permInfo)
            })
        }
    }
}
