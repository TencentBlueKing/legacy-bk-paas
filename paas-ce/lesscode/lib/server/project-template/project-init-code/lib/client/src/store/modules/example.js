/**
 * @file app store
 * @author
 */

import http from '@/api'
import queryString from 'query-string'

export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        /**
         * Example 请求，get 请求
         *
         * @param {Object} context store 上下文对象 { commit, state, dispatch }
         * @param {Object} params 请求参数
         *
         * @return {Promise} promise 对象
         */
        
        getTableData (context, params, config = {}) {
            // 模拟请求，作为发起 get 请求的 Example
            const mockUrl = `/table?invoke=getTableData&${queryString.stringify(params)}`
            return http.get(mockUrl, params, config)
        }
    }
}
