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

const openAPIRouterConfig = require('./open-api.config')

const IS_DEV = process.env.NODE_ENV === 'development'
// 不同场景渲染不同html
function getRenderTemplateName (ctx) {
    let pageTemplateName = IS_DEV ? 'index-dev' : 'index'
    if (ctx.path.includes('preview.html')) pageTemplateName = 'preview'
    return pageTemplateName
}
const renderParams = { STATIC_URL: '' }

pageRouter.get('*', async (ctx, next) => {
    // 必要的 openapi 404 判定，暂不支持路径参数
    const { method, path } = ctx
    const { prefix, routes } = openAPIRouterConfig

    if (path.startsWith(prefix)) {
        const openAPIRoutes = Object.values(routes).map(route => `${route[0]}-${prefix}${route[1]}`.toUpperCase())
        const currentRoute = `${method}-${path}`.toUpperCase()
        if (!openAPIRoutes.includes(currentRoute)) {
            ctx.throw(404)
        }
    }

    await next()
}, async (ctx, next) => {
    const pageTemplateName = getRenderTemplateName(ctx)
    ctx.body = await ctx.render(pageTemplateName, renderParams)
    await next()
})

const routes = [pageRouter.routes()]
const allowedMethods = [pageRouter.allowedMethods()]

const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.resolve(__dirname, './')).filter(name => name !== 'index.js' && !name.endsWith('.config.js'))
files.forEach((name) => {
    const router = require(`./${name}`)
    routes.push(router.routes())
    allowedMethods.push(router.allowedMethods())
})

exports.routes = routes
exports.allowedMethods = allowedMethods
