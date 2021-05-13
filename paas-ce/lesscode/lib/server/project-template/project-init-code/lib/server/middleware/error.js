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
