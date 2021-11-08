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

import { getNamespace, createNamespace } from 'node-request-context'

class RequestContext {
    static spaceName = 'lesscode'

    constructor (ctx) {
        this.ctx = ctx
    }

    static currentRequestContext () {
        let res = ''
        const session = getNamespace(RequestContext.spaceName)
        if (session) res = session.get(RequestContext.name)
        return res
    }

    static getCurrentUser () {
        const curRequestContext = RequestContext.currentRequestContext()
        if (curRequestContext) {
            const user = curRequestContext.ctx.session.userInfo
            return user
        }
        return {}
    }

    static getCurrentCtx () {
        const curRequestContext = RequestContext.currentRequestContext()
        if (curRequestContext) return curRequestContext.ctx
        return {}
    }
}

const setRequestContext = (ctx) => {
    const requestContext = new RequestContext(ctx)
    const session = getNamespace(RequestContext.spaceName) || createNamespace(RequestContext.spaceName)

    session.run(async () => {
        session.set(RequestContext.name, requestContext)
    })
}

const requestContextMiddleware = () => {
    return async function (ctx, next) {
        setRequestContext(ctx)
        await next()
    }
}

module.exports = {
    setRequestContext,
    requestContextMiddleware,
    RequestContext
}
