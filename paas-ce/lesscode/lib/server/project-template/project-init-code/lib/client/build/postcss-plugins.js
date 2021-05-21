const postcssImport = require('postcss-import')
const postcssFor = require('postcss-for')
const postcssMixins = require('postcss-mixins')
const postcssUrl = require('postcss-url')
const postcssPresetEnv = require('postcss-preset-env')
const postcssNested = require('postcss-nested')
const postcssAtroot = require('postcss-atroot')
const postcssExtendRule = require('postcss-extend-rule')
const postcssSimpleVars = require('postcss-simple-vars')
const postcssDiscardComments = require('postcss-discard-comments')
const postcssPropertyLookup = require('postcss-property-lookup')
const postcssColorFunction = require('postcss-color-function')
const createResolver = require('postcss-import-webpack-resolver')
const baseConf = require('./webpack.base.conf.js')

module.exports = function (loader) {
    return [
        // 把 import 的内容转换为 inline
        // @see https://github.com/postcss/postcss-import#postcss-import
        postcssImport({
            resolve: createResolver({
                alias: baseConf.resolve.alias,
                modules: ['src', 'node_modules']
            })
        }),

        // 循环，本插件需要放在 postcss-nested 和 postcss-simple-vars 前面
        // @see https://github.com/antyakushev/postcss-for#postcss-for-plugin
        postcssFor(),

        // mixins，本插件需要放在 postcss-simple-vars 和 postcss-nested 插件前面
        // @see https://github.com/postcss/postcss-mixins#postcss-mixins-
        postcssMixins(),

        // 用于在 URL ( )上重新定位、内嵌或复制。
        // @see https://github.com/postcss/postcss-url#postcss-url
        postcssUrl({
            url: 'rebase'
        }),

        // cssnext 已经不再维护，推荐使用 postcss-preset-env
        postcssPresetEnv({
            // see https://github.com/csstools/postcss-preset-env#options
            stage: 0,
            autoprefixer: {
                grid: true
            }
        }),
        // 这个插件可以在写 nested 样式时省略开头的 &
        // @see https://github.com/postcss/postcss-nested#postcss-nested-
        postcssNested(),

        // 将 @at-root 里的规则放入到根节点
        // @see https://github.com/OEvgeny/postcss-atroot#postcss-at-root-
        postcssAtroot(),

        // 提供 @extend 语法
        // @see https://github.com/jonathantneal/postcss-extend-rule#postcss-extend-rule-
        postcssExtendRule(),

        // 变量相关
        // @see https://github.com/jonathantneal/postcss-advanced-variables#postcss-advanced-variables-
        // 'postcss-advanced-variables': {
        //     // variables 属性内的变量为全局变量
        //     // variables: require('./src/css/variable.js')
        // },
        // @see https://github.com/postcss/postcss-simple-vars#postcss-simple-variables-
        postcssSimpleVars({
            unknown: function (node, name, result) {
                node.warn(result, 'Unknown variable ' + name)
            }
        }),

        // 移除注释
        // @see https://github.com/ben-eb/postcss-discard-comments#postcss-discard-comments---
        postcssDiscardComments(),

        // 类似于 stylus，直接引用属性而不需要变量定义
        // @see https://github.com/simonsmith/postcss-property-lookup#postcss-property-lookup-
        postcssPropertyLookup(),

        // 颜色函数
        // @see https://github.com/postcss/postcss-color-function#postcss-color-function--
        postcssColorFunction()

        // // 把 import 的内容转换为 inline
        // // @see https://github.com/postcss/postcss-import#postcss-import
        // postcssImport(),

        // // mixins，本插件需要放在 postcss-simple-vars 和 postcss-nested 插件前面
        // // @see https://github.com/postcss/postcss-mixins#postcss-mixins-
        // postcssMixins(),

        // // 用于在 URL ( )上重新定位、内嵌或复制。
        // // @see https://github.com/postcss/postcss-url#postcss-url
        // postcssUrl({
        //     url: 'rebase'
        // }),

        // // cssnext 已经不再维护，推荐使用 postcss-preset-env
        // postcssPresetEnv({
        //     // see https://github.com/csstools/postcss-preset-env#options
        //     stage: 0,
        //     autoprefixer: {
        //         browsers: ['last 2 versions'],
        //         grid: true
        //     },
        //     browsers: ['last 2 versions']
        // }),

        // // 这个插件可以在写 nested 样式时省略开头的 &
        // // @see https://github.com/postcss/postcss-nested#postcss-nested-
        // postcssNested(),

        // // 将 @at-root 里的规则放入到根节点
        // // @see https://github.com/OEvgeny/postcss-atroot#postcss-at-root-
        // postcssAtroot(),

        // // 提供 @extend 语法
        // // @see https://github.com/jonathantneal/postcss-extend-rule#postcss-extend-rule-
        // postcssExtendRule(),

        // // 变量相关
        // // @see https://github.com/jonathantneal/postcss-advanced-variables#postcss-advanced-variables-
        // postcssAdvancedVariables(),

        // // 类似于 stylus，直接引用属性而不需要变量定义
        // // @see https://github.com/simonsmith/postcss-property-lookup#postcss-property-lookup-
        // postcssPropertyLookup()
    ]
}
