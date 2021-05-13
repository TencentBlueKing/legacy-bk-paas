/**
 * 远程函数会通过调用后端接口来转发请求，如果勾选了蓝鲸认证，则会携带这里填写的数据
 * 请确保此处填写的数据正确，不然会影响远程函数的接口调用
 */

const tokenConf = {
    dev: {
        // 蓝鲸应用认证 app code
        bk_app_code: '',
        // 蓝鲸应用认证 app secret
        bk_app_secret: ''
    },
    stag: {
        // 蓝鲸应用认证 app code
        bk_app_code: process.env.BKPAAS_APP_ID,
        // 蓝鲸应用认证 app secret
        bk_app_secret: process.env.BKPAAS_APP_SECRET
    },
    prod: {
        // 蓝鲸应用认证 app code
        bk_app_code: process.env.BKPAAS_APP_ID,
        // 蓝鲸应用认证 app secret
        bk_app_secret: process.env.BKPAAS_APP_SECRET
    }
}

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_STAG = process.env.BKPAAS_ENVIRONMENT === 'stag'

module.exports = IS_DEV ? tokenConf.dev : IS_STAG ? tokenConf.stag : tokenConf.prod
