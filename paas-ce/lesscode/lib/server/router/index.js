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

const KoaRouter = require('koa-router')
const pageRouter = new KoaRouter()
const IS_DEV = process.env.NODE_ENV === 'development'
// const IS_LOCAL = process.env.NODE_ENV === 'local'
const pageTemplateName = IS_DEV ? 'index-dev' : 'index'
const test = require('./test')
const user = require('./user')
const data = require('./data')
const vueCode = require('./vue-code')

// const renderParams = IS_DEV
//     ? {
//         STATIC_URL: ''
//     }
//     : {
//         STATIC_URL: IS_LOCAL ? '' : `/${process.env.APP_CODE}`
//     }

const renderParams = { STATIC_URL: '' }
const routes = []
const allowedMethods = []
// 所有路由
const allRouter = [
    pageRouter,
    test,
    user,
    data,
    vueCode
]

// 把所有前端的页面路由都指向 index，为了方便前端 vue router 使用 browserHistory
pageRouter.get('*', async (ctx, next) => {
    ctx.body = await ctx.render(pageTemplateName, renderParams)
    await next()
})

allRouter.forEach(router => {
    routes.push(router.routes())
    allowedMethods.push(router.allowedMethods())
})

exports.routes = routes
exports.allowedMethods = allowedMethods
