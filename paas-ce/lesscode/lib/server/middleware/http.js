/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

const httpConf = require('../conf/http')
const axios = require('axios')
const { getIP } = require('../util')

const host = process.env.NODE_ENV === 'production' ? getIP() : 'localhost'

const instance = axios.create({
    withCredentials: true,
    baseURL: httpConf.protocol + '://' + host + ':' + httpConf.port
    // baseURL: httpConf.protocol + '://localhost:' + httpConf.port
})

instance.interceptors.response.use(response => response, error => Promise.reject(error))

module.exports = () => {
    return async function (ctx, next) {
        ctx.http = instance
        await next()
    }
}
