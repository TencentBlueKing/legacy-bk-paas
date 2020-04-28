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
        /\"\{\{STATIC_URL\}\}\"/g,
        // () => clientConf.build.env.APP_CODE + '/'
        // () => `${clientConf.build.env.APP_CODE} + "/"`
        () => 'window.STATIC_URL + "/"'
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

        const asset = compilation.assets[fileName]
        const minifyCSSFileContent = asset.source().replace(
            /\{\{STATIC_URL\}\}/g,
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
