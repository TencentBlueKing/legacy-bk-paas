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

import { messageHtmlError } from '../../common/bkmagic'
import http from '@/api'
const perfix = '/function-market'
 
export default {
    namespaced: true,
    state: {
        funcGroups: []
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        getAllFuncFromMarket ({ state }) {
            return http.get(`${perfix}/getFuncList`).then((res = {}) => {
                return res.data || []
            })
        },

        addMarketFunc (_, func) {
            return http.post(`${perfix}/addFunc`, func).then((res = {}) => {
                if (res.code === 499) {
                    messageHtmlError(res.message)
                    return
                }
                return res.data
            })
        },

        updateMarketFunc (_, func) {
            return http.put(`${perfix}/updateFunc`, func).then((res = {}) => {
                if (res.code === 499) {
                    messageHtmlError(res.message)
                    return
                }
                return res.data
            })
        },

        deleteMarketFunc (_, id) {
            return http.delete(`${perfix}/deleteFunc?id=${id}`).then((res = {}) => {
                return res.data
            })
        },

        addFuncToProject (_, postData) {
            return http.post(`${perfix}/addFuncToProject`, postData).then((res = {}) => {
                return res.data
            })
        }
    }
}
