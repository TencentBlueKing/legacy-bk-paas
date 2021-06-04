module.exports = () => {
    return async (ctx, next) => {
        ctx.send = json => {
            ctx.set('Content-Type', 'application/json')
            // ctx.bkLogger.info(json)
            ctx.body = JSON.stringify(json)
        }
        await next()
    }
}
