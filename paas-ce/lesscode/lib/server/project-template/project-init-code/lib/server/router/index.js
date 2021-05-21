const KoaRouter = require('koa-router')
const pageRouter = new KoaRouter()

const IS_DEV = process.env.NODE_ENV === 'development'
const pageTemplateName = IS_DEV ? 'index-dev' : 'index'
const renderParams = {
    SITE_URL: '',
    BK_STATIC_URL: '',
    REMOTE_STATIC_URL: process.env.BKPAAS_REMOTE_STATIC_URL || '',
    BKPAAS_ENVIRONMENT: process.env.BKPAAS_ENVIRONMENT || 'prod'
}
// 把所有前端的页面路由都指向 index，为了方便前端 vue router 使用 browserHistory
pageRouter.get('*', async (ctx, next) => {
    ctx.body = await ctx.render(pageTemplateName, renderParams)
    await next()
})
const routes = [pageRouter.routes()]
const allowedMethods = [pageRouter.allowedMethods()]

const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.resolve(__dirname, './')).filter(name => name !== 'index.js')
files.forEach((name) => {
    const router = require(`./${name}`)
    routes.push(router.routes())
    allowedMethods.push(router.allowedMethods())
})

exports.routes = routes
exports.allowedMethods = allowedMethods
