// <lesscode-canvas> 的属性 host, path
// host + path

// dev
// 能获取到 html，这里 path 只要是 static 开头就可以了，static 后面的路径无所谓，dev 时都能获取到，如 static/dist-vueadsasdas3asddasdsaasddas, static/asddasads
// 注意这里获取的是静态的，由 webpack 动态插入的是不行的。
// path 的配置与 vue.config.js 里的 publicPath 配置一致时，webpack 动态插入才正确


// build
// path 配置为 static/${outputDir} 时才能生效

module.exports = {
  // dev 时的 path 路径，以及 build 时 html 中引入静态资源的 path
  publicPath: '/static/dist-vue3/',
  // build 产物的目录
  outputDir: '../../static/dist-vue3',
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
