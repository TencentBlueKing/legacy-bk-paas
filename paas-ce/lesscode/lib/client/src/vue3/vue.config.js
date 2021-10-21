module.exports = {
  // dev 时的 path 路径，以及 build 时 html 中引入静态资源的 path
  publicPath: '/static/dist-vue3/',
  // build 产物的目录
  outputDir: 'dist-vue3',
  productionSourceMap: false,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 5001,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
  // 自定义webpack配置
  configureWebpack: {
    output: {
      jsonpFunction: `webpackJsonp-chile-vue3`,
    }
  },
}
