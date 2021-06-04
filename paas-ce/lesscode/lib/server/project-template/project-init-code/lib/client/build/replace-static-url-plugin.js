const { extname } = require('path')

const dealJS = (compilation, opts) => {
    const mainChunk = compilation.chunks.filter(
        chunk => chunk.name === opts.fileNamePrefix
    )[0] || {}

    const mainChunkJSFile = (mainChunk.files || []).filter(
        fileName => extname(fileName) === '.js'
    )[0] || ''

    const asset = compilation.assets[mainChunkJSFile]

    const minifyJSFileContent = asset.source().replace(
        /\"\{\{BK_STATIC_URL\}\}\"/g,
        // () => clientConf.build.env.APP_CODE + '/'
        // () => `${clientConf.build.env.APP_CODE} + "/"`
        () => 'window.BK_STATIC_URL + "/"'
    )

    // 设置输出资源
    compilation.assets[mainChunkJSFile] = {
        // 返回文件内容
        source: () => minifyJSFileContent,
        // 返回文件大小
        size: () => Buffer.byteLength(minifyJSFileContent, 'utf8')
    }
}

const dealCSS = compilation => {
    const assets = Object.keys(compilation.assets)
    const assetsLen = assets.length

    for (let i = 0; i < assetsLen; i++) {
        const fileName = assets[i]
        if (extname(fileName) !== '.css') {
            continue
        }

        // monaco-editor 直接在 require-monaco.html 加载，这里不需要构建处理
        if (fileName.indexOf('monaco-editor') > -1) {
            continue
        }

        if (fileName.indexOf('static/init-code') > -1) {
            continue
        }

        const asset = compilation.assets[fileName]
        const minifyCSSFileContent = asset.source().replace(
            /\{\{BK_STATIC_URL\}\}/g,
            () => '../../'
        )
        // 设置输出资源
        compilation.assets[fileName] = {
            // 返回文件内容
            source: () => minifyCSSFileContent,
            // 返回文件大小
            size: () => Buffer.byteLength(minifyCSSFileContent, 'utf8')
        }
    }
}

class ReplaceStaticUrlPlugin {
    constructor (opts) {
        this.opts = opts
    }

    apply (compiler, callback) {
        // emit: 在生成资源并输出到目录之前
        compiler.hooks.emit.tapAsync('ReplaceStaticUrlPlugin', (compilation, callback) => {
            dealJS(compilation, this.opts)
            dealCSS(compilation)
            callback()
        })
    }
}

module.exports = ReplaceStaticUrlPlugin
