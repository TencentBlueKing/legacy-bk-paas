const { resolve, posix } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const postcssPlugins = require('./postcss-plugins')
const ReplaceStaticUrlPlugin = require('./replace-static-url-plugin')
const clientConf = require('./conf')
const { pathToNodeModules } = require('./util')
const baseConf = require('./webpack.base.conf')
const manifest = require('../static/lib-manifest.json')

module.exports = merge(baseConf, {
    mode: 'production',
    entry: {
        main: resolve(__dirname, '..', 'src/main.js')
    },
    output: {
        path: resolve(__dirname, '..', 'dist'),
        filename: posix.join('static', 'js/[name].[chunkhash].js'),
        chunkFilename: posix.join('static', 'js/[name].[chunkhash].js')
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false,
                    mangle: true,
                    output: {
                        comments: false
                    }
                },
                extractComments: false,
                cache: true,
                parallel: 2,
                sourceMap: clientConf.build.productionSourceMap
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            })
        ],
        splitChunks: {
            // 表示从哪些 chunks 里面提取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks
            // async: 针对异步加载的 chunk 做分割，默认值
            // initial: 针对同步 chunk
            // all: 针对所有 chunk
            chunks: 'all',
            // 表示提取出来的文件在压缩前的最小大小，默认为 30kb
            minSize: 30000,
            // 表示提取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小
            maxSize: 0,
            // 表示被引用次数，默认为 1
            minChunks: 1,
            // 最多有 5 个异步加载请求该 module
            maxAsyncRequests: 5,
            // 初始化的时候最多有 3 个请求该 module
            maxInitialRequests: 3,
            // 名字中间的间隔符
            automaticNameDelimiter: '~',
            // chunk 的名字，如果设成 true，会根据被提取的 chunk 自动生成
            name: true,
            // 要切割成的每一个新 chunk 就是一个 cache group，缓存组会继承 splitChunks 的配置，但是 test, priorty 和 reuseExistingChunk 只能用于配置缓存组。
            // test: 和 CommonsChunkPlugin 里的 minChunks 非常像，用来决定提取哪些 module，可以接受字符串，正则表达式，或者函数
            //      函数的一个参数为 module，第二个参数为引用这个 module 的 chunk（数组）
            // priority: 表示提取优先级，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么提取到哪个就由权重最高的说了算；
            //          优先级高的 chunk 为被优先选择，优先级一样的话，size 大的优先被选择
            // reuseExistingChunk: 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被提取出去了，那么将不会重新生成新的。
            cacheGroups: {
                // 提取 chunk-bk-magic-vue 代码块
                bkMagicVue: {
                    chunks: 'all',
                    // 单独将 bkMagicVue 拆包
                    name: 'chunk-bk-magic-vue',
                    // 权重
                    priority: 5,
                    // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被提取出去了，那么将不会重新生成新的。
                    reuseExistingChunk: true,
                    test: module => {
                        return /bk-magic-vue/.test(module.context)
                    }
                },
                // 所有 node_modules 的模块被不同的 chunk 引入超过 1 次的提取为 twice
                // 如果去掉 test 那么提取的就是所有模块被不同的 chunk 引入超过 1 次的
                twice: {
                    // test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'twice',
                    priority: 6,
                    minChunks: 2
                },
                // default 和 vendors 是默认缓存组，可通过 optimization.splitChunks.cacheGroups.default: false 来禁用
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|postcss)?$/,
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     {
                //         loader: resolve(__dirname, pathToNodeModules, 'css-loader'),
                //         options: {
                //             modules: true,
                //             importLoaders: 1
                //         }
                //     },
                //     {
                //         loader: resolve(__dirname, pathToNodeModules, 'postcss-loader'),
                //         options: {
                //             ident: 'postcss',
                //             plugins: loader => postcssPlugins(loader)
                //         }
                //     }
                // ]
                oneOf: [
                    // 匹配 js 中 import xxx from 'xxx.css'
                    {
                        resourceQuery: /import_css_specifier/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'css-loader'),
                                options: {
                                    modules: {
                                        localIdentName: '[name]_[local]_[hash:base64:5]'
                                    },
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: loader => postcssPlugins(loader)
                                }
                            }
                        ]
                    },
                    // 这里匹配 `<style module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'css-loader'),
                                options: {
                                    modules: {
                                        localIdentName: '[name]_[local]_[hash:base64:5]'
                                    },
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: loader => postcssPlugins(loader)
                                }
                            }
                        ]
                    },
                    // 这里匹配普通的 `<style>` 或 `<style scoped>`
                    {
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'css-loader'),
                                options: {
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: resolve(__dirname, pathToNodeModules, 'postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: loader => postcssPlugins(loader)
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(clientConf.build.env),

        new webpack.DllReferencePlugin({
            context: resolve(__dirname, '..', 'static'),
            manifest: manifest
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, '..', 'index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            sourceMap: true,
            // 如果打开 vendor 和 manifest 那么需要配置 chunksSortMode 保证引入 script 的顺序
            // chunksSortMode: 'dependency',
            // webpack4 这个属性暂时设置为 none，参见 https://github.com/jantimon/html-webpack-plugin/issues/870
            chunksSortMode: 'none'
        }),

        new MiniCssExtractPlugin({
            // filename: posix.join('static', 'css/[name].[contenthash].css')
            filename: posix.join('static', 'css/[name].[contenthash].css')
        }),

        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, '..', 'static'),
                to: 'static',
                toType: 'dir'
            }
        ]),
        new ReplaceStaticUrlPlugin({ fileNamePrefix: 'main' })
    ]
})
