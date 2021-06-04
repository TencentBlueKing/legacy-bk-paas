const { getApiData } = require('../controller/mock-data')
const Router = require('koa-router')

const router = new Router({
    prefix: '/api/data'
})

router.post('/getApiData', getApiData)

module.exports = router
