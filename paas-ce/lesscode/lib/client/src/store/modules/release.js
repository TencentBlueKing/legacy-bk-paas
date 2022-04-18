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
import { bkMessage } from 'bk-magic-vue'
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
        checkConfig ({ state }) {
            return http.get('/release/checkConfig').then(response => {
                const data = response.data
                return data
            })
        },
        applicationList ({ state }) {
            return http.get('/release/applicationList').then(response => {
                const data = response.data || []
                return data
            })
        },
        moduleList ({ state }, { appCode }) {
            return http.get(`/release/moduleList?appCode=${appCode}`).then(response => {
                const data = response.data || []
                return data
            })
        },
        releaseProject ({ state }, data) {
            return http.post('/release/releaseProject', data).then(response => {
                if (response.code === 499) {
                    const message = this._vm.$createElement('pre', { style: { margin: 0 } }, [response.message])
                    bkMessage({ theme: 'error', message, ellipsisLine: 0, extCls: 'auto-width' })
                    return {}
                }
                const data = response.data || ''
                return data
            })
        },
        detailInfo ({ state }, postData) {
            return http.post('/release/detailInfo', postData).then(response => {
                const data = response.data || {}
                return data
            })
        },
        getList ({ state }, { projectId }) {
            return http.get(`/release/getList?projectId=${projectId}`).then(response => {
                const data = response.data || []
                return data
            })
        },
        getSucVersionList ({ state }, { projectId }) {
            return http.get(`/release/getSucVersionList?projectId=${projectId}`).then(response => {
                const data = response.data || []
                return data
            })
        },
        detailFromV3 ({ state }, { projectId, deployId }) {
            return http.get(`/release/detailFromV3?projectId=${projectId}&deployId=${deployId}`).then(response => {
                const data = response.data || {}
                return data
            })
        },
        getRunningLog ({ state }, { deployId }) {
            return http.get(`/release/getRunningLog?deployId=${deployId}`).then(response => {
                const data = response.data || {}
                return data
            })
        },
        updateVersion ({ state }, { id, data }) {
            return http.put('/release/updateReleaseVersion', { id, data }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        checkAppInfoExist ({ state }, data) {
            return http.post('/release/checkAppInfoExist', data).then(response => {
                const data = response.data || false
                return data
            })
        },
        offlineProject ({ state }, data) {
            return http.post('/release/offlineProject', data).then(response => {
                const data = response.data || false
                return data
            })
        },
        offlineResult ({ state }, data) {
            return http.get(`/release/offlineResult?projectId=${data.projectId}&offlineId=${data.deployId}`).then(response => {
                const data = response.data || false
                return data
            })
        }
    }
}
