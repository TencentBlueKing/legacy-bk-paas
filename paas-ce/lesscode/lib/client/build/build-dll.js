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
const TerserPlugin = require('terser-webpack-plugin')
const chalk = require('chalk')
const ora = require('ora')
const fse = require('fs-extra')

const clientConf = require('./conf')

const manifestExist = fse.pathExistsSync(resolve(__dirname, '..', 'static', 'lib-manifest.json'))
const bundleExist = fse.pathExistsSync(resolve(__dirname, '..', 'static', 'lib.bundle.js'))

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

if (!(manifestExist & bundleExist)) {
    // 需要打包到一起的 js 文件
    const vendors = [
        resolve(__dirname, '../../../node_modules', 'vue'),
        resolve(__dirname, '../../../node_modules', 'vuex'),
        resolve(__dirname, '../../../node_modules', 'vue-router'),
        resolve(__dirname, '../../../node_modules', 'axios')
    ]

    const clientDLLConf = {
        mode: mode,
        // 也可设置多个入口，多个 vendor，就可以生成多个 bundle
        entry: {
            lib: vendors
        },
        // 输出文件的名称和路径
        output: {
            filename: '[name].bundle.js',
            path: resolve(__dirname, '..', 'static'),
            // lib.bundle.js 中暴露出的全局变量名
            library: '[name]_[chunkhash]'
        },
        plugins: [
            new webpack.DefinePlugin(clientConf.build.env),
            new webpack.DllPlugin({
                path: resolve(__dirname, '..', 'static', '[name]-manifest.json'),
                name: '[name]_[chunkhash]',
                // context: __dirname
                context: resolve(__dirname, '..', 'static')
            }),

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
                parallel: true,
                sourceMap: true
            }),

            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            new webpack.optimize.OccurrenceOrderPlugin()
        ]
    }

    const spinner = ora('building dll...')
    spinner.start()

    webpack(clientDLLConf, (err, stats) => {
        spinner.stop()
        if (err) {
            throw err
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  DLL Build complete.\n'))
    })
}
