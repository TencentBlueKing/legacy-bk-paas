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
import { bkMessage } from 'bk-magic-vue'

export default {
    namespaced: true,
    state: {
        currentFilePath: ''
    },
    mutations: {
        setCurrentFilePath (state, path) {
            state.currentFilePath = path
        }
    },
    getters: {
    },
    actions: {
        saveVueFile ({ state }, { code }) {
            return http.post('/vueCode/saveAsFile', { code }).then(response => {
                const data = response.data || ''
                return data
            })
        },
        formatCode ({ state }, { code }) {
            return http.post('/vueCode/formatCode', { code }).then(response => {
                const data = response.data || {}
                return data
            })
        },
        getPageCode ({ state }, data) {
            return http.post('/vueCode/getPageCode', data).then(response => {
                const data = response.data || {}
                const codeErrMessage = response.codeErrMessage || ''
                if (codeErrMessage) bkMessage({ theme: 'warning', message: codeErrMessage })
                return data
            })
        }
    }
}
