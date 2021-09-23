import dataService from '../service/data-service'

const data = {
    async get (ctx) {
        try {
            const { tableName } = ctx.params || {}
            const data = await dataService.get(tableName)
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async add (ctx) {
        try {
            const { tableName } = ctx.params || {}
            const postData = ctx.request.body
            const data = await dataService.add(tableName, postData)
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async update (ctx) {
        try {
            const { tableName } = ctx.params || {}
            const postData = ctx.request.body
            const data = await dataService.update(tableName, postData)
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },

    async deleteData (ctx) {
        try {
            const { tableName } = ctx.params || {}
            const { id } = ctx.request.query || {}
            const data = await dataService.delete(tableName, id)
            ctx.send({
                code: 0,
                data,
                message: 'success'
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    }
}

module.exports = data
