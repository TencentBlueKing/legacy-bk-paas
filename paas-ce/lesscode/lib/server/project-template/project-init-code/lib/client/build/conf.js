/**
 * @file config
 * @author
 */

const prodEnv = require('./prod.env')
const devEnv = require('./dev.env')
const stagEnv = require('./stag.env')

const onlineEnv = process.env.BKPAAS_ENVIRONMENT === 'stag' ? stagEnv : prodEnv

module.exports = {
    build: {
        // env 会通过 webpack.DefinePlugin 注入到前端代码里
        env: onlineEnv,
        assetsSubDirectory: 'static',
        assetsPublicPath: '{{BK_STATIC_URL}}',
        productionSourceMap: true,
        bundleAnalyzerReport: process.env.npm_config_report,
        port: 5000
    },
    dev: {
        // env 会通过 webpack.DefinePlugin 注入到前端代码里
        env: devEnv,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        port: 5000
    }
}
