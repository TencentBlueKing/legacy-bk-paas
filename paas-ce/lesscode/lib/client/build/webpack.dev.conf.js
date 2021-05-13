/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

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
        main: [resolve(__dirname, '..', 'src/main.js')],
        preview: [resolve(__dirname, '..', 'src/preview/index.js')]
    },

    // output: {
    //     path: resolve(__dirname, '..', 'dist'),
    //     filename: '[name].js',
    //     // publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.APP_CODE + '/'
    //     // publicPath: '/'
    //     publicPath: clientConf.dev.assetsPublicPath
    // },

    module: {
        rules: [
            {
                test: /\.(css|postcss)$/,
                // use: [
                //     resolve(__dirname, pathToNodeModules, 'vue-style-loader'),
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
            chunks: ['main'],
            staticUrl: clientConf.dev.staticUrl,
            BKPAAS_ENVIRONMENT: clientConf.dev.BKPAAS_ENVIRONMENT
        }),

        new HtmlWebpackPlugin({
            filename: 'preview.html',
            template: resolve(__dirname, '..', 'preview.html'),
            inject: true,
            chunks: ['preview'],
            staticUrl: clientConf.dev.staticUrl,
            BKPAAS_ENVIRONMENT: clientConf.dev.BKPAAS_ENVIRONMENT
        }),

        new FriendlyErrorsPlugin()
    ]
})

// Object.keys(webpackConfig.entry).forEach(name => {
//     webpackConfig.entry[name] = [resolve(__dirname, './dev-client.js')].concat(webpackConfig.entry[name])
// })

module.exports = webpackConfig
