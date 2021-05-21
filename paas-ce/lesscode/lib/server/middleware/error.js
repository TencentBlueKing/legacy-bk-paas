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

module.exports = () => {
    return async function (ctx, next) {
        /**
         * 抛出异常函数
         * @param  {Object} error 异常
         */
        ctx.throwError = function (error) {
            // 业务异常，status为200，其它为应用异常
            if (error.status === 200) {
                ctx.status = 200
                ctx.body = {
                    code: 1000,
                    message: error.message
                }
            } else if (error instanceof global.BusinessError) {
                ctx.status = 200
                ctx.body = {
                    code: error.code || 499,
                    businessError: true,
                    message: error.message || '服务器出现业务错误',
                    data: error.data
                }
            } else {
                throw Error(error.message)
            }
        }

        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = {
                code: err.code || 5000,
                data: err.data || null,
                message: err.message || '服务器出错'
            }
            // 调用日志记录下来
            ctx.app.emit('error', err, ctx)
        }
    }
}
