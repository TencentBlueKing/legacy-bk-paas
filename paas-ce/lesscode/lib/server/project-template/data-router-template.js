const { get, add, update, deleteData } = require('../controller/data')
const Router = require('koa-router')

const router = new Router({
    prefix: '/api/data-service'
})

router.get('/:tableName', get)
router.post('/:tableName', add)
router.put('/:tableName', update)
router.delete('/:tableName', deleteData)

module.exports = router
