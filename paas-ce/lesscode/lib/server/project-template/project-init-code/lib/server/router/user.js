const { getUser } = require('../controller/user')
const Router = require('koa-router')

const router = new Router({
    prefix: '/api/user'
})

router.get('/getUser', getUser)

module.exports = router
