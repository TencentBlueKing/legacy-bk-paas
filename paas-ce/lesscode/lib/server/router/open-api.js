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

import { getRepository } from 'typeorm'
import projectModel from '../model/project'
import User from '../model/entities/user'

const fs = require('fs')
const path = require('path')
const jwt = require('koa-jwt')
const Router = require('koa-router')

const { ERROR_CODES } = require('../controller/open-api')

const config = require('./open-api.config')

const getRouteOptions = function (route) {
    const options = route[route.length - 1]
    if (Object.prototype.toString.call(options) === '[object Object]') {
        return options
    }
    return {}
}

const router = new Router({
    prefix: config.prefix
})

const secret = fs.readFileSync(path.resolve(__dirname, '../conf/jwt-open-api.pub'))

// API网关JWT访问控制及用户检查
router.use('*', jwt({
    secret,
    key: 'jwt',
    getToken (ctx) {
        if (ctx.header['x-bkapi-jwt']) {
            return ctx.header['x-bkapi-jwt']
        }
        ctx.throw(401, 'Not Found JWT header', { code: 30001 })
    }
}).unless({
    custom (ctx) {
        const { debug } = ctx.request.query
        return process.env.NODE_ENV === 'development' && debug
    }
}), async (ctx, next) => {
    const { debug } = ctx.request.query
    if (process.env.NODE_ENV === 'development' && debug) {
        ctx.state.jwt = {
            app: {},
            user: { username: 'lesscode1' }
        }
    }
    await next()
}, async (ctx, next) => {
    // 目前假定所有接口都需要用户认证
    const { user } = ctx.state.jwt || {}

    if (!user) {
        ctx.throw(401, ERROR_CODES['INVAILD_USER'][1], { code: ERROR_CODES['INVAILD_USER'][0] })
    }

    const findUser = await getRepository(User).findOne({ bk: user.username })
    if (!findUser) {
        ctx.throw(401, ERROR_CODES['NOT_FOUND_USER'][1], { code: ERROR_CODES['NOT_FOUND_USER'][0] })
    }

    // 注入平台用户id
    ctx.state.jwt.user.id = findUser.id

    await next()
})

// 项目访问权限控制
const projectAccessControlRoutes = Object.values(config.routes).filter(route => {
    const options = getRouteOptions(route)
    return options.accessControl && options.accessControl.includes('project')
}).map(route => route[1])
router.use(projectAccessControlRoutes, async (ctx, next) => {
    const { user } = ctx.state.jwt || {}

    const id = ['POST', 'PUT', 'DELETE'].includes(ctx.request.method)
        ? (ctx.request.body.id || ctx.request.body.projectId)
        : (ctx.request.query.id || ctx.request.query.projectId)

    if (!id) {
        ctx.throw(400, ERROR_CODES['MISSING_PARAMS_PROJECT_ID'][1], { code: ERROR_CODES['MISSING_PARAMS_PROJECT_ID'][0] })
    }

    const project = await projectModel.findUserProjectById(user.id, id)
    if (!project) {
        ctx.throw(403)
    }

    await next()
})

// 路由绑定
Object.values(config.routes).forEach(route => {
    const [method, path, handler] = route
    router[method](path, handler)
})

module.exports = router
