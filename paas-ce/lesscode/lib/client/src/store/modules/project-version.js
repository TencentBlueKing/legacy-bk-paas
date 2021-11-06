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

const storageKey = 'project-version'

export default {
    namespaced: true,
    state: {
        versionList: [],
        currentVersion: {}
    },
    mutations: {
        setVersionList (state, list) {
            state.versionList = Object.freeze(list)
        },
        setCurrentVersion (state, version) {
            state.currentVersion = Object.freeze(version)
            localStorage.setItem(storageKey, JSON.stringify(version))
        }
    },
    getters: {
        versionList: state => state.versionList,
        currentVersion: state => state.currentVersion,
        initialVersion: (state) => () => {
            const storageVersion = localStorage.getItem(storageKey)
            let version = {}
            if (storageVersion) {
                try {
                    const data = JSON.parse(storageVersion)
                    version = data
                } catch (e) {
                    console.error(e)
                }
            }
            return version
        },
        currentVersionId: state => state.currentVersion.id || null,
        currentVersionName: state => state.currentVersion.version || null,
        getVersionById: state => id => state.versionList.find(v => v.id === id) || {}
    },
    actions: {
        create ({ commit }, data) {
            return http.post('/projectVersion/create', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        update ({ commit }, data) {
            return http.put('/projectVersion/update', data).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getList ({ commit }, params) {
            return http.get('/projectVersion/list', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getOptionList ({ commit }, params) {
            return http.get('/projectVersion/optionList', { params }).then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
