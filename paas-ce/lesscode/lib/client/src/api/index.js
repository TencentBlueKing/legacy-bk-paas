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

import axios from 'axios'
import cookie from 'cookie'

import RequestError from './request-error'
import CachedPromise from './cached-promise'
import RequestQueue from './request-queue'
import { bus } from '../common/bus'
import { messageError } from '@/common/bkmagic'

// 解析错误
axios.interceptors.response.use(
    // 后端 API 响应成功（http status 200）
    response => {
        const { data } = response
        switch (data.code) {
            // 接口请求成功
            case 0:
            case 499:
                return data
            // 后端业务处理报错
            default:
                const { code, message = '系统错误' } = response.data
                throw new RequestError(code, message, response)
        }
    },
    // 解析 http status code (非 200)
    error => {
        const { response } = error
        if (response) {
            // 默认提示 http 状态码错误标记
            let message = response.statusText
            // 兼容后端响应时通过body返回错误信息
            if (response.data && response.data.message) {
                message = response.data.message
            }
            return Promise.reject(new RequestError(response.status || -1, message, response))
        }
        return Promise.reject(new RequestError(-1, `${AJAX_URL_PREFIX} 无法访问`))
    }
)
// 处理错误
axios.interceptors.response.use(undefined, error => {
    const {
        code,
        message,
        response
    } = error
    switch (code) {
        // 用户登录状态失效
        case 401:
            bus.$emit('redirect-login', response.data.data || {})
    }
    // 全局捕获错误给出提示
    if (response) {
        const { config } = response
        if (config.globalError) {
            messageError(message)
        }
    }
    return Promise.reject(error)
})

const http = {
    queue: new RequestQueue(),
    cache: new CachedPromise(),
    cancelRequest: requestId => {
        return http.queue.cancel(requestId)
    },
    cancelCache: requestId => http.cache.delete(requestId),
    cancel: requestId => Promise.all([http.cancelRequest(requestId), http.cancelCache(requestId)])
}

const methodsWithoutData = ['delete', 'get', 'head', 'options']
const methodsWithData = ['post', 'put', 'patch']
const allMethods = [...methodsWithoutData, ...methodsWithData]

/**
 * 初始化本系统 http 请求的各项配置
 *
 * @param {string} http method 与 axios 实例中的 method 保持一致
 * @param {string} 请求地址, 结合 method 生成 requestId
 * @param {Object} 用户配置，包含 axios 的配置与本系统自定义配置
 *
 * @return {Promise} 本次 http 请求的 Promise
 */
function initConfig (method, url) {
    let cancelExcutor
    const cancelToken = new axios.CancelToken(excutor => {
        cancelExcutor = excutor
    })
    return {
        cancelToken,
        cancelExcutor,
        // http 请求默认 id
        requestId: method + '_' + url,
        // 是否全局捕获异常
        globalError: true,
        // 是否直接复用缓存的请求
        fromCache: false,
        // 是否在请求发起前清楚缓存
        clearCache: false,
        // 响应结果是否返回原始数据
        originalResponse: true,
        // 当路由变更时取消请求
        cancelWhenRouteChange: true,
        // 取消上次请求
        cancelPrevious: false
    }
}

// 在自定义对象 http 上添加各请求方法
allMethods.forEach(method => {
    Object.defineProperty(http, method, {
        get () {
            return (url, payload, config = {}) => {
                const axiosConfig = {
                    baseURL: `${AJAX_URL_PREFIX}`,
                    url,
                    method,
                    xsrfCookieName: 'bkiam_csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    withCredentials: true,
                    ...initConfig()
                }
                if (methodsWithData.includes(method)) {
                    Object.assign(axiosConfig, { data: payload }, config)
                } else {
                    Object.assign(axiosConfig, { ...payload }, config)
                }
                let promise
                if (axiosConfig.cancelPrevious) {
                    http.cancel(axiosConfig.requestId)
                }

                if (axiosConfig.clearCache) {
                    http.cache.delete(axiosConfig.requestId)
                } else {
                    promise = http.cache.get(axiosConfig.requestId)
                }

                if (axiosConfig.fromCache && promise) {
                    return promise
                }
                promise = axios(axiosConfig)

                // 添加请求队列
                http.queue.set(axiosConfig)
                // 添加请求缓存
                http.cache.set(axiosConfig.requestId, promise)

                return promise
            }
        }
    })
})

export default http

// 跨域处理
export function injectCSRFTokenToHeaders () {
    const CSRFToken = cookie.parse(document.cookie).bkiam_csrftoken
    if (CSRFToken !== undefined) {
        axios.defaults.headers.common['X-CSRFToken'] = CSRFToken
    } else {
        console.warn('Can not find bkiam_csrftoken in document.cookie')
    }
}
