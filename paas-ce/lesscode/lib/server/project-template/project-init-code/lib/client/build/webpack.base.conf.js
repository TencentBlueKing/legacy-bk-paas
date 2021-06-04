const { resolve, posix } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const friendlyFormatter = require('eslint-friendly-formatter')
const clientConf = require('./conf')
const { pathToNodeModules } = require('./util')

const IS_DEV = process.env.NODE_ENV === 'development'

const config = IS_DEV ? clientConf.dev : clientConf.build

module.exports = {
    watchOptions: {
        ignored: /node_modules/
    },
    output: {
        filename: '[name].js',
        publicPath: config.assetsPublicPath
    },

    resolve: {
        // 指定以下目录寻找第三方模块，避免 webpack 往父级目录递归搜索，
        // 默认值为 ['node_modules']，会依次查找./node_modules、../node_modules、../../node_modules
        modules: [resolve(__dirname, '..', 'src'), resolve(__dirname, pathToNodeModules)],
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: resolve(__dirname, pathToNodeModules, 'vue/dist/vue.esm.js'),
            '@': resolve(__dirname, '..', 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: resolve(__dirname, pathToNodeModules, 'eslint-loader'),
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
                    loader: resolve(__dirname, pathToNodeModules, 'vue-loader'),
                    options: {
                        transformAssetUrls: {
                            video: 'src',
                            source: 'src',
                            img: 'src',
                            image: 'xlink:href'
                        },
                        include: [
                            resolve(__dirname, pathToNodeModules, 'vue-echarts')
                        ]
                    }
                }
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: resolve(__dirname, pathToNodeModules, 'vue-loader')
                    }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: resolve(__dirname, pathToNodeModules, 'babel-loader'),
                    options: {
                        include: [
                            resolve(__dirname, '..', 'src'),
                            resolve(__dirname, pathToNodeModules, 'bk-magic-vue'),
                            resolve(__dirname, pathToNodeModules, 'vue-echarts')
                        ],
                        cacheDirectory: resolve(__dirname, '..', '.webpack_cache'),
                        presets: [
                            [
                                resolve(__dirname, pathToNodeModules, '@babel/preset-env'),
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
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-syntax-dynamic-import'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-transform-runtime'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-transform-object-assign'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-transform-async-to-generator'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-transform-modules-commonjs'),
                            [
                                resolve(__dirname, pathToNodeModules, '@babel/plugin-proposal-decorators'),
                                { legacy: true }
                            ],
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-proposal-function-sent'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-proposal-export-namespace-from'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-proposal-numeric-separator'),
                            resolve(__dirname, pathToNodeModules, '@babel/plugin-proposal-throw-expressions'),
                            resolve(__dirname, pathToNodeModules, 'babel-plugin-add-module-exports'),
                            [
                                resolve(__dirname, pathToNodeModules, 'babel-plugin-import-bk-magic-vue'),
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
                loader: resolve(__dirname, pathToNodeModules, 'url-loader'),
                options: {
                    limit: true,
                    name: posix.join('static', 'images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: resolve(__dirname, pathToNodeModules, 'url-loader'),
                    options: {
                        limit: 10000,
                        name: posix.join('static', 'media/[name].[hash:7].[ext]')
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: resolve(__dirname, pathToNodeModules, 'url-loader'),
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
        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, '..', 'static', 'images'),
                to: resolve(__dirname, '..', 'dist/static/images'),
                toType: 'dir'
            }
        ])
    ]
}
