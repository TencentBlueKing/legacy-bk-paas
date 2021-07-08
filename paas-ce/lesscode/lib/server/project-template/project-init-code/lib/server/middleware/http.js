const axios = require('axios')
// const { getIP } = require('../util')

// const host = process.env.NODE_ENV === 'production' ? getIP() : 'localhost'

const instance = axios.create({
    withCredentials: true
    // baseURL: 'http' + '://' + host + ':' + 5000
    // baseURL: httpConf.protocol + '://localhost:' + httpConf.port
})

instance.interceptors.response.use(response => response, (error) => {
    let businessError = error
    if (error.response && error.response.data && error.response.data.message) {
        businessError = new Error(error.response.data.message)
    }
    return Promise.reject(businessError)
})

module.exports = () => {
    return async function (ctx, next) {
        ctx.http = instance
        await next()
    }
}
