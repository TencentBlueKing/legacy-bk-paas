const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const postcssPlugins = require('./postcss-plugins')
const clientConf = require('./conf')
const { pathToNodeModules } = require('./util')
const baseConf = require('./webpack.base.conf')
const manifest = require('../static/lib-manifest.json')

const webpackConfig = merge(baseConf, {
    mode: 'development',

    entry: {
        // 必须是数组，适配 webpack-hot-client
        main: [resolve(__dirname, '..', 'src/main.js')]
    },

    module: {
        rules: [
            {
                test: /\.(css|postcss)$/,
                oneOf: [
                    // 匹配 js 中 import xxx from 'xxx.css'
                    {
                        resourceQuery: /import_css_specifier/,
                        use: [
                            resolve(__dirname, pathToNodeModules, 'vue-style-loader'),
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
                            resolve(__dirname, pathToNodeModules, 'vue-style-loader'),
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
                            resolve(__dirname, pathToNodeModules, 'vue-style-loader'),
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
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(clientConf.dev.env),

        new webpack.DllReferencePlugin({
            context: resolve(__dirname, '..', 'static'),
            manifest: manifest
        }),

        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, '..', 'index-dev.html'),
            inject: true,
            staticUrl: clientConf.dev.staticUrl
        }),

        new FriendlyErrorsPlugin()
    ]
})

module.exports = webpackConfig
