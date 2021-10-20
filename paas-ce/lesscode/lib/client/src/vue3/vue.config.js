module.exports = {
  // publicPath: '/micro-app/vue3/',
  publicPath: '/canvasvue3/',
  outputDir: 'dist',
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
