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
         * 通用异常
         * @param  {String | BusinessError | Object} error 异常
         */
        ctx.throwError = function (error) {
            if (typeof error === 'string') {
                throw new global.BusinessError(error)
            } else if (error instanceof global.BusinessError) {
                throw error
            } else {
                const {
                    status = 200,
                    message,
                    code
                } = error
                throw new global.BusinessError(message, code, status)
            }
        }
        /**
         * 特定异常 BusinessError
         * @param  {String} error 异常
         */
        ctx.throwBusinessError = function (message) {
            throw new global.BusinessError(message, 499)
        }

        try {
            await next()
        } catch (error) {
            const {
                status = 500,
                code,
                message,
                data
            } = error
            
            ctx.status = status
            ctx.body = {
                code,
                message,
                data
            }
            
            // 调用日志记录下来
            ctx.app.emit('error', error, ctx)
        }
    }
}
