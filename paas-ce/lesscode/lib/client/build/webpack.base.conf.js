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

const { resolve, posix } = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const friendlyFormatter = require('eslint-friendly-formatter')
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const clientConf = require('./conf')
const mdLoaderOption = require('./md-loader-option')

const IS_DEV = process.env.NODE_ENV === 'development'

const config = IS_DEV ? clientConf.dev : clientConf.build

module.exports = {
    watchOptions: {
        ignored: /node_modules/
    },
    output: {
        filename: '[name].js',
        // publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.APP_CODE + '/'
        // publicPath: '/'
        publicPath: config.assetsPublicPath
    },

    resolve: {
        // 指定以下目录寻找第三方模块，避免 webpack 往父级目录递归搜索，
        // 默认值为 ['node_modules']，会依次查找./node_modules、../node_modules、../../node_modules
        modules: [resolve(__dirname, '..', 'src'), resolve(__dirname, '../../../node_modules')],
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: resolve(__dirname, '../../../node_modules', 'vue/dist/vue.esm.js'),
            '@': resolve(__dirname, '..', 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                // loader: 'eslint-loader',
                loader: resolve(__dirname, '../../../node_modules', 'eslint-loader'),
                enforce: 'pre',
                include: [
                    resolve(__dirname, '..', 'src')
                ],
                exclude: /node_modules/,
                options: {
                    formatter: friendlyFormatter
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: resolve(__dirname, '../../../node_modules', 'vue-loader'),
                    options: {
                        transformAssetUrls: {
                            video: 'src',
                            source: 'src',
                            img: 'src',
                            image: 'xlink:href'
                        },
                        include: [
                            resolve(__dirname, '../../../node_modules', 'vue-echarts')
                        ]
                    }
                }
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: resolve(__dirname, '../../../node_modules', 'vue-loader')
                    },
                    {
                        loader: resolve(__dirname, '../../../node_modules', 'vue-markdown-loader/lib/markdown-compiler'),
                        options: mdLoaderOption
                    }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: resolve(__dirname, '../../../node_modules', 'babel-loader'),
                    options: {
                        include: [
                            resolve(__dirname, '..', 'src'),
                            resolve(__dirname, '../../../node_modules', 'bk-magic-vue'),
                            resolve(__dirname, '../../../node_modules', 'monaco-editor'),
                            resolve(__dirname, '../../../node_modules', 'vue-echarts'),
                            resolve(__dirname, '../../../node_modules', 'resize-detector')
                        ],
                        cacheDirectory: resolve(__dirname, '..', '.webpack_cache'),
                        presets: [
                            [
                                resolve(__dirname, '../../../node_modules', '@babel/preset-env'),
                                {
                                    modules: 'commonjs',
                                    targets: {
                                        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
                                        node: 'current'
                                    },
                                    debug: false
                                }
                            ]
                        ],
                        // plugins: [require('@babel/plugin-transform-object-rest-spread')],
                        plugins: [
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-syntax-dynamic-import'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-transform-runtime'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-transform-object-assign'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-transform-async-to-generator'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-transform-modules-commonjs'),
                            [
                                resolve(__dirname, '../../../node_modules', '@babel/plugin-proposal-decorators'),
                                { legacy: true }
                            ],
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-proposal-function-sent'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-proposal-export-namespace-from'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-proposal-numeric-separator'),
                            resolve(__dirname, '../../../node_modules', '@babel/plugin-proposal-throw-expressions'),
                            resolve(__dirname, '../../../node_modules', 'babel-plugin-add-module-exports'),
                            [
                                resolve(__dirname, '../../../node_modules', 'babel-plugin-import-bk-magic-vue'),
                                { baseLibName: 'bk-magic-vue' }
                            ]
                        ],
                        // 确保 JS 的转译应用到 node_modules 的 Vue 单文件组件
                        exclude: file => (
                            /node_modules/.test(file) && !/\.vue\.js/.test(file) && !(/monaco-editor/.test(file))
                        )
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: resolve(__dirname, '../../../node_modules', 'url-loader'),
                options: {
                    limit: true,
                    name: posix.join('static', 'images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: resolve(__dirname, '../../../node_modules', 'url-loader'),
                    options: {
                        limit: 10000,
                        name: posix.join('static', 'media/[name].[hash:7].[ext]')
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: resolve(__dirname, '../../../node_modules', 'url-loader'),
                    options: {
                        limit: 10000,
                        name: posix.join('static', 'fonts/[name].[hash:7].[ext]')
                    }
                }
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        // new MonacoWebpackPlugin(),
        // moment 优化，只提取本地包
        new webpack.ContextReplacementPlugin(/moment\/locale$/, /zh-cn/),
        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, '..', 'static', 'images'),
                to: resolve(__dirname, '..', 'dist/static/images'),
                toType: 'dir'
            }
        ])
    ]
}
