const { resolve } = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const chalk = require('chalk')
const ora = require('ora')
const fse = require('fs-extra')

const clientConf = require('./conf')
const { pathToNodeModules } = require('./util')

const manifestExist = fse.pathExistsSync(resolve(__dirname, '..', 'static', 'lib-manifest.json'))
const bundleExist = fse.pathExistsSync(resolve(__dirname, '..', 'static', 'lib.bundle.js'))

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

if (!(manifestExist & bundleExist)) {
    // 需要打包到一起的 js 文件
    const vendors = [
        resolve(__dirname, pathToNodeModules, 'vue'),
        resolve(__dirname, pathToNodeModules, 'vuex'),
        resolve(__dirname, pathToNodeModules, 'vue-router'),
        resolve(__dirname, pathToNodeModules, 'axios')
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
                parallel: 2,
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
