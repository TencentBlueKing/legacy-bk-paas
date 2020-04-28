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

const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const CLIEngine = require('eslint').CLIEngine
const appRoot = require('app-root-path')

const IS_DEV = process.env.NODE_ENV === 'development'

const STATIC_URL = IS_DEV ? './lib/client/static/' : './lib/client/dist/static/'

const cli = new CLIEngine({
    fix: true,
    useEslintrc: true,
    allowInlineConfig: false,
    reportUnusedDisableDirectives: true,
    cwd: path.join(__dirname)
})

const ESLINT_TMP_FILE_PATH = 'eslint-fix-tmp.vue'

/**
 * 读取文件
 *
 * @param {String} filePath 文件路径，绝对路径
 */
async function read (curPath) {
    const ret = await fs.readFileSync(curPath, 'utf8')
    return ret
}

/**
 * 删除文件
 *
 * @param {String} filePath 文件路径，绝对路径
 */
const deleteFile = filePath => {
    if (!fs.existsSync(filePath)) {
        console.log('deleteFile 路径不存在')
        return
    }
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const readFile = (path, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })

async function createFile (filePath) {
    if (!fs.existsSync(filePath)) {
        await fs.writeFileSync(filePath, '', 'utf8')
    }
}

// const formatCode = prettier.format(`
// <template>
//     <section class="container">
//         <div class="bk-layout-row">
//             <div class="bk-layout-col" style="width: 100%">
//                 <bk-button title="hello world" size="normal" :disabled="false" class="button2EC446F2" @click="test1">
//                     基础按钮sytd
//                 </bk-button>
//             </div>
//         </div>
//     </section>
// </template>

// <script>
//     export default {
//         methods: {
//             test1 (res) {
//                 return res.data
//             }
//         }
//     }
// </script>
// <style lang="css">
//     .container {
//         margin: 10px;
//     }
//     .bk-layout-row {
//         display: flex;
//     }
//     .bk-layout-row:after {
//         display: block;
//         clear: both;
//         content: '';
//         font-size: 0;
//         height: 0;
//         visibility: hidden;
//     }
//     .bk-layout-col {
//         float: left;
//         position: relative;
//         min-height: 1px;
//     }
//     /* 还原 bk-button 组件的 vertical-align 样式 */
//     .bk-layout-col button.bk-button {
//         vertical-align: baseline;
//     }

//     .button2EC446F2 {
//         display: inline-block;
//     }
// </style>
// `, {
//     vueIndentScriptAndStyle: true,
//     semi: false,
//     parser: 'vue',
//     tabWidth: 4,
//     // singleQuote: true,
//     printWidth: 120,
//     endOfLine: 'crlf'
// })

// async function test () {
//     await createFile(path.join(__dirname, ESLINT_TMP_FILE_PATH))
//     const report = cli.executeOnText(formatCode, ESLINT_TMP_FILE_PATH)

//     CLIEngine.outputFixes(report)
//     const ret = await read(path.join(__dirname, ESLINT_TMP_FILE_PATH))
//     // deleteFile(path.join(__dirname, ESLINT_TMP_FILE_PATH))
//     console.error(+new Date())
//     console.error()
//     console.error(ret)
// }

// test()

/**
 * sleep 函数
 *
 * @param {number} ms 毫秒数
 */
// function sleep (ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }

const VueCode = {
    async saveAsFile (ctx) {
        try {
            const post = ctx.request.body || {}
            let code = post.code
            code = code.replace('export default', 'module.exports =')
            // const formatCode = prettier.format(post.code, { semi: false, parser: 'vue', tabWidth: 4 })
            const fileName = 'vue-layout-demo' + Math.random().toString().substr(5) + '.vue'
            // const filePath = STATIC_URL + 'demo' + Math.random() + '.vue'
            const filePath = STATIC_URL + fileName
            console.error(filePath)
            console.error(appRoot.resolve(filePath))
            // await fs.writeFileSync(appRoot.resolve(filePath), code, { encoding: 'utf8' })
            await writeFile(appRoot.resolve(filePath), code, { encoding: 'utf8' })
            const ret = await readFile(appRoot.resolve(filePath))
            console.log(`
                ------------------------------------------------
            `)
            console.log(ret)
            console.log(`
                ------------------------------------------------
            `)
            console.log()
            console.log()

            ctx.send({
                code: 0,
                message: 'success',
                data: fileName,
                content: ret
            })
        } catch (err) {
            console.log(err, 'save err')
            ctx.throwError({
                message: err.message
            })
        }
    },
    async formatCode (ctx) {
        try {
            const post = ctx.request.body || {}
            const formatCode = prettier.format(post.code, {
                vueIndentScriptAndStyle: true,
                semi: false,
                parser: 'vue',
                tabWidth: 4,
                singleQuote: true,
                printWidth: 120,
                endOfLine: 'crlf'
            })
            // formatCode = formatCode.replace('data() {\n', 'data () {\n')
            // formatCode = formatCode.replace(/\(\) {\n/g, ' () {\n')
            // formatCode = formatCode.replace(/\((.*)\) {\n/g, ' ($1) {\n')

            await createFile(path.join(__dirname, ESLINT_TMP_FILE_PATH))
            const report = cli.executeOnText(formatCode, ESLINT_TMP_FILE_PATH)
            CLIEngine.outputFixes(report)

            const ret = await read(path.join(__dirname, ESLINT_TMP_FILE_PATH))
            await deleteFile(path.join(__dirname, ESLINT_TMP_FILE_PATH))

            ctx.send({
                code: 0,
                message: 'success',
                // ret 为空的话，说明 formatCode 是 eslint 检测正确的
                data: ret || formatCode
            })
        } catch (err) {
            console.log(err, 'format err')
            ctx.throwError({
                message: err.message
            })
        }
    },
    async deleteTmpFile (ctx) {
        try {
            const post = ctx.request.body || {}
            const filePath = STATIC_URL + post.fileName
            await deleteFile(appRoot.resolve(filePath))
            ctx.send({
                code: 0,
                message: 'success',
                data: 'delete suc'
            })
        } catch (err) {
            console.log(err, 'delete err')
            ctx.throwError({
                message: err.message
            })
        }
    }
}

module.exports = VueCode
