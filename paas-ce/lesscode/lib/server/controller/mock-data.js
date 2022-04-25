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
import { getTokenByUserName } from '../model/token'

function strToJson (str) {
    // eslint-disable-next-line no-new-func
    const json = (new Function('return ' + str))()
    return json
}

const Data = {
    async getApiData (ctx) {
        try {
            const axiosParam = []
            const { url, projectId, type = 'get', withToken = 0, apiData } = ctx.request.body || {}
            axiosParam.push(url)
            const methodsWithData = ['post', 'put', 'patch']
            const httpData = typeof apiData === 'string' ? strToJson(apiData || '{}') : apiData
            if (methodsWithData.includes(type)) {
                axiosParam.push(httpData)
            } else {
                const urlObj = new URL(url)
                const keys = Object.keys(httpData)
                keys.forEach((key) => {
                    urlObj.searchParams.delete(key)
                    urlObj.searchParams.append(key, httpData[key])
                })
                axiosParam[0] = urlObj.href
            }
            // 携带 cookie
            ctx.http.defaults.withCredentials = true
            if (ctx.cookies.request.headers.cookie) ctx.http.defaults.headers.Cookie = ctx.cookies.request.headers.cookie
            // 判断是否携带 token
            const options = {}
            if (withToken) {
                const bkTikcet = ctx.cookies.get('bk_ticket')
                const tokenList = await getTokenByUserName(projectId) || []
                const firstToken = tokenList[0] || {}
                const token = {
                    access_token: firstToken.token || '',
                    bk_ticket: bkTikcet
                }
                options.headers = {
                    'X-BKAPI-AUTHORIZATION': JSON.stringify(token)
                }
            }
            axiosParam.push(options)
            const re = await ctx.http[type](...axiosParam)
            ctx.send(re.data)
        } catch (err) {
            let message = err.message
            if (message.match(/Parameters error \[reason=\"参数 app_code 为空，请进行检查\"\]/)) message = 'Parameters error [reason="参数 app_code 为空，请进行检查"]，请在该应用下凭证管理页面绑定蓝鲸应用信息并获取用户认证凭证'
            ctx.throwError({
                message
            })
        }
    },

    async getMockData (ctx) {
        const { page = 1, pageSize = 20 } = ctx.request.query || {}
        const count = 200
        const list = []
        for (let i = 0; i < count; i++) {
            list.push({
                id: i,
                projectId: `id-${i}`,
                projectCode: `code-${i}`,
                projectName: `应用-${i}`,
                name: `名称-${i}`
            })
        }
        const start = (page - 1) * pageSize
        const end = page * pageSize
        const data = list.slice(start, end)
        try {
            ctx.send({
                code: 0,
                message: 'success',
                count,
                data
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getXTableData (ctx) {
        const data = {
            msg: [
                {
                    cluster_config: {
                        creator: 'system',
                        cluster_name: '测试1',
                        create_time: '2019-11-19 17:52:08',
                        cluster_id: 1,
                        port: 10004,
                        domain_name: '',
                        is_editable: false,
                        state: true
                    },
                    is_editable: true
                },
                {
                    cluster_config: {
                        creator: 'system',
                        cluster_name: '测试2',
                        create_time: '2019-11-19 17:52:08',
                        cluster_id: 2,
                        port: 10004,
                        domain_name: '127.0.0.1',
                        is_editable: true,
                        state: true
                    },
                    is_editable: true
                },
                {
                    cluster_config: {
                        creator: 'system',
                        cluster_name: '测试3',
                        create_time: '2019-11-19 17:52:08',
                        cluster_id: 3,
                        port: 10004,
                        domain_name: '127.0.0.1',
                        is_editable: true,
                        state: false
                    },
                    is_editable: true
                },
                {
                    cluster_config: {
                        creator: 'system',
                        cluster_name: '测试4',
                        create_time: '2019-11-19 17:52:08',
                        cluster_id: 4,
                        port: 10004,
                        domain_name: '',
                        is_editable: true,
                        state: true
                    },
                    is_editable: true
                },
                {
                    cluster_config: {
                        creator: 'system',
                        cluster_name: '搜索测试5',
                        create_time: '2019-11-19 17:52:08',
                        cluster_id: 5,
                        port: 10004,
                        domain_name: '',
                        is_editable: false,
                        state: false
                    },
                    is_editable: false
                }
            ]
        }
        try {
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}

module.exports = Data
