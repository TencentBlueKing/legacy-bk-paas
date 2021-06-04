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
        dateShortcuts: [
            {
                text: '今天',
                value () {
                    const end = new Date()
                    const start = new Date()
                    return [start, end]
                }
            },
            {
                text: '近7天',
                value () {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    return [start, end]
                }
            },
            {
                text: '近15天',
                value () {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
                    return [start, end]
                }
            },
            {
                text: '近30天',
                value () {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    return [start, end]
                }
            }
        ]
    },
    mutations: {
    },
    actions: {
        getList ({ commit }, { projectId, config }) {
            return http.get(`/logs/list/${projectId}`, config).then(response => {
                const data = response.data || ''
                return data
            })
        },
        getOptions ({ commit }) {
            return http.get('/logs/options').then(response => {
                const data = response.data || ''
                return data
            })
        }
    }
}
