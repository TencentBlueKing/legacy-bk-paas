const webpack = require('webpack')
const chalk = require('chalk')
const ora = require('ora')

const webpackConf = require('./webpack.prod.conf')

const spinner = ora('building...')
spinner.start()

webpack(webpackConf, (err, stats) => {
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

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n'
        + '  Opening index.html over file:// won\'t work.\n'
    ))
})
