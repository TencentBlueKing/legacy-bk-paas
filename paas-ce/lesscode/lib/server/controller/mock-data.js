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
function strToJson (str) {
    // eslint-disable-next-line no-new-func
    const json = (new Function('return ' + str))()
    return json
}

const Data = {
    async getApiData (ctx) {
        try {
            const body = ctx.request.body || {}
            const url = body.url
            const type = body.type || 'get'
            let apiData = body.apiData
            if (apiData) apiData = strToJson(apiData)
            ctx.http.defaults.withCredentials = true
            if (ctx.cookies.request.headers.cookie) ctx.http.defaults.headers.Cookie = ctx.cookies.request.headers.cookie
            const re = await ctx.http[type](url, apiData)
            ctx.send(re.data)
        } catch (err) {
            console.error(err)
            ctx.throwError({
                message: err.message
            })
        }
    },

    async getMockData (ctx) {
        const count = 20
        const data = []
        for (let i = 0; i < count; i++) {
            data.push({
                id: i,
                projectId: `id-${i}`,
                projectCode: `code-${i}`,
                projectName: `项目-${i}`,
                name: `名称-${i}`
            })
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
