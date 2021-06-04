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
const permMap = require('../conf/perm')

module.exports = () => {
    return async function (ctx, next) {
        const request = ctx.request || {}
        // const header = request.header || request.headers || {}
        // const referer = header.referer || ''
        const apiPath = request.path
        const apiMethod = request.method
        const apiKey = `${apiMethod}-${apiPath}`
        const curPerm = permMap[apiKey] || {}
        const needPermCodes = curPerm.permCodes || []
        const permsInfo = ctx.session.permsInfo
        if (needPermCodes.length > 0 && permsInfo) {
            const exitPermCodes = permsInfo.permCodes || []
            const hasPerm = needPermCodes.every((code) => exitPermCodes.includes(code))
            if (!hasPerm) {
                ctx.status = 200
                ctx.body = {
                    code: 403,
                    message: curPerm.message || '暂无执行该操作权限，请联系项目管理员开通权限后重试'
                }
                return
            }
        }
        await next()
    }
}
