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

import { getFunctionTips } from '../shared'
import crypto from 'crypto'
const os = require('os')
const eslintConfig = require('./conf/eslint-config')
const { ESLint } = require('eslint')
const interactiveComponents = ['bk-dialog', 'bk-sideslider']
const acorn = require('acorn')
const { RequestContext } = require('./middleware/request-context')
const algorithm = 'aes-256-ctr'
// 加密key，需要是长度为32位的字符串
const secretKey = '_use_your_own_crypto_srcret_key_'

/**
 * 加密
 * @param {} text 原文
 * @returns 加密后的字符串
 */
export const encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return iv.toString('hex') + '::lesscode::' + encrypted.toString('hex')
}

/**
 * 解密
 * @param {} hash 加密后的字符串
 * @returns 原文
 */
export const decrypt = (hash = '') => {
    const [iv, hashText] = hash.split('::lesscode::')
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hashText, 'hex')), decipher.final()])
    return decrpyted.toString()
}

exports.splitSql = (sqlString) => {
    const sqlArr = []
    let strCharNum = 0
    let lastCharIndex = 0
    for (let charIndex in sqlString) {
        charIndex = +charIndex
        const sqlChar = sqlString[charIndex]
        if (sqlChar === ';' && sqlString.slice(charIndex + 1, charIndex + 8) !== 'base64,' && (strCharNum & 1) === 0) {
            const currentStr = sqlString.slice(lastCharIndex, charIndex + 1)
            sqlArr.push(currentStr)
            lastCharIndex = charIndex + 1
        }
        if (/'|"|`/.test(sqlChar)) strCharNum++
    }
    return sqlArr
}

// 替换函数中的变量和函数
exports.replaceFuncKeyword = (funcBody = '', callBack) => {
    // remove comment
    const ctx = RequestContext.getCurrentCtx()
    const functionTips = getFunctionTips(ctx.origin)
    Object.values(functionTips).forEach((tip) => {
        funcBody = funcBody.replace(tip, '')
    })

    // parse keyword
    const commentsPositions = []
    acorn.parse(funcBody, {
        onComment (isBlock, text, start, end) {
            commentsPositions.push({
                start,
                end
            })
        },
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
    })
    return funcBody.replace(/lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/g, (all, first, second, dirKey, funcStr, funcCode, index) => {
        const isInComments = commentsPositions.some(position => position.start <= index && position.end >= index)
        return isInComments ? all : callBack(all, first, second, dirKey, funcStr, funcCode)
    })
}

/**
 * 获取本机的真实 ip
 */
exports.getIP = () => {
    const ifaces = os.networkInterfaces()
    const defultAddress = '127.0.0.1'
    let ip = defultAddress

    for (const dev in ifaces) {
        if (ifaces.hasOwnProperty(dev)) {
            ifaces[dev].forEach(details => {
                if (ip === defultAddress && details.family === 'IPv4') {
                    ip = details.address
                }
            })
        }
    }
    return ip
}

/**
 * 移除字符串两端空格
 *
 * @param {String} str 待移除空格的字符串
 *
 * @return {String} 移除空格后的字符串
 */
exports.trim = str => {
    return (str || '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

/**
 * 根据对象的某个属性值去重
 *
 * @param {String} arr 待去重的数组
 * @param {String} key 去重依据的key值
 *
 * @return {String} 去重后的数组
 */
exports.unique = (arr, key) => {
    const res = new Map()
    return arr.filter(item => !res.has(item[key]) && res.set(item[key], 1))
}

/**
 * 错误码
 */
exports.CODE = {
    HTTP: [
        // 请求无效 Bad Request
        400,
        // 未授权 Unauthorized
        401,
        // 禁止访问 Forbidden
        403,
        // 未找到 Not Found
        404,
        // 服务器错误 Internal Server Error
        500,
        // 网关错误 Bad Gateway
        502,
        // 服务不可用 Service Unavailable
        503,
        // 网关超时 Gateway Time-out
        504,
        // HTTP 版本不受支持 HTTP Version not supported
        505
    ],
    // 业务逻辑错误，程序上并没有错误
    BIZ: {
        // 没有权限
        NO_PERM: 4010,
        // 项目未找到，项目被逻辑或物理删除报出
        PROJECT_NOT_FOUND: 4040,
        // 项目页面描述文件未找到
        JSON_NOT_FOUND: 4041,
        // 项目名称已经存在
        PROJECT_NAME_EXISTED: 4042,
        // 项目ID已经存在
        PROJECT_ID_EXISTED: 4043,
        // 项目ID非法
        PROJECT_ID_INVALID: 4044,
        // 项目版本已经存在
        PROJECT_VERSION_EXISTED: 4045,
        // 未定义的业务逻辑错误
        NOT_DEFINED: 9999
    }
}

/**
 * 判断请求是否是 ajax 异步请求
 *
 * @param {Object} req request 对象
 *
 * @return {boolean} 返回结果
 */
exports.isAjaxReq = req => {
    return req.get('X-Requested-With') || (req.header.accept || '').indexOf('json') > -1
}

/**
 * 将parentId列表转换为children树结构列表
 *
 * @param {Array} list 列表
 * @param {Number} pid 根parentId值
 * @param {String} childDataKey 子节点数据键名
 *
 * @return {Array} 树结构列表
 */
exports.list2tree = (list = [], pid = -1, childDataKey = 'children') => {
    function tree (pid) {
        const arr = []
        list.filter(item => item.parentId === pid)
            .forEach(item => {
                arr.push({
                    ...item,
                    [childDataKey]: tree(item.id)
                })
            })
        return arr
    }
    return tree(pid)
}

/**
 * 将列表路径打平并返回为以路径作为key的Map
 *
 * @param {Array} list 列表
 * @param {Number} pid 根parentId值
 *
 * @return {Map} 扁平的路径map
 */
exports.flattenListPath = (list = [], pid = -1, prefixKey) => {
    function getPath (node) {
        if (node.parentId === pid) {
            return node.path
        } else {
            const parent = list.find(item => item.id === node.parentId)
            return [node.path].concat(getPath(parent))
        }
    }

    const flattenList = []
    list.forEach(item => {
        flattenList.push({
            ...item,
            fullPath: [].concat(getPath(item))
        })
    })

    const pathMap = new Map()
    flattenList.forEach(item => {
        const { fullPath, ...node } = item
        if (prefixKey) {
            pathMap.set([item[prefixKey]].concat(fullPath.reverse()).join('/'), node)
        } else {
            pathMap.set(fullPath.reverse().join('/'), node)
        }
    })
    return pathMap
}

/**
 * 生成 uuid
 *
 * @param {Number} len 长度
 * @param {Number} radix 基数
 *
 * @return {string} uuid
 */
export function uuid (len = 8, radix = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        let i
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        let i
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}

export function transformOldGrid (children, grid, childCallBack, parentCallBack, index, columnIndex, parentGrid) {
    const renderProps = grid.renderProps || {}
    const slots = renderProps.slots || {}
    let columns = slots.val && Array.isArray(slots.val) ? slots.val : []
    let isLayoutSupportDialog = false
    if (interactiveComponents.includes(grid.type)) { // 交互式组件特殊处理
        const slot = ((grid.renderProps || {}).slots || {}).val || []
        columns = typeof slot === 'string' ? [] : (((slot.renderProps || {}).slots || {}).val || [])
        isLayoutSupportDialog = typeof slot !== 'string'
    }

    columns.forEach((column, columnIndex) => {
        const children = column.children || []
        children.forEach((component, index) => {
            if (component.type === 'render-grid' || component.type === 'free-layout' || (component.name === 'dialog' && isLayoutSupportDialog)) { // 如果是旧数据，dialog不做遍历，新dialog支持layout插槽，需要遍历
                transformOldGrid(children, component, childCallBack, parentCallBack, index, columnIndex, grid)
            } else if ((component.renderProps || {}).slots && ((component.renderProps || {}).slots || {}).name === 'layout') {
                transformOldGrid([], component.renderProps.slots.val, childCallBack, parentCallBack, index, columnIndex)
                childCallBack(component, children, index, grid, columnIndex)
            } else {
                if (childCallBack) childCallBack(component, children, index, grid, columnIndex)
            }
        })

        // form-item, 没有column.children
        if (!column.children && column.componentId) {
            childCallBack(column, columns, columnIndex, grid, index)
        }
    })
    if (parentCallBack) parentCallBack(grid, children, index, parentGrid, columnIndex)
}

export function walkGrid (children, grid, childCallBack, parentCallBack, index, columnIndex, parentGrid) {
    const renderSlots = grid.renderSlots || {}
    const slots = renderSlots.default || {}
    let columns = slots.val && Array.isArray(slots.val) ? slots.val : []
    let isLayoutSupportDialog = false
    if (interactiveComponents.includes(grid.type)) { // 交互式组件特殊处理
        const slot = grid.type === 'bk-sideslider' ? (((grid.renderSlots || {}).content || {}).val || {}) : (((grid.renderSlots || {}).default || {}).val || {})
        columns = typeof slot === 'string' ? [] : (((slot.renderSlots || {}).default || {}).val || [])
        isLayoutSupportDialog = typeof slot !== 'string'
    }

    columns.forEach((column, columnIndex) => {
        const children = column.children || []
        children.forEach((component, index) => {
            const renderSlots = component.renderSlots || {}
            const slotKeys = Object.keys(renderSlots)
            if (component.type === 'render-grid' || component.type === 'free-layout' || (component.name === 'dialog' && isLayoutSupportDialog)) { // 如果是旧数据，dialog不做遍历，新dialog支持layout插槽，需要遍历
                walkGrid(children, component, childCallBack, parentCallBack, index, columnIndex, grid)
            } else if (slotKeys.some(key => renderSlots[key].name === 'layout')) {
                slotKeys.forEach((key) => {
                    const slot = renderSlots[key]
                    walkGrid([], slot.val, childCallBack, parentCallBack, index, columnIndex)
                    childCallBack(component, children, index, grid, columnIndex)
                })
            } else {
                if (childCallBack) childCallBack(component, children, index, grid, columnIndex)
            }
        })

        // form-item, 没有column.children
        if (!column.children && column.componentId) {
            childCallBack(column, columns, columnIndex, grid, index)
        }
    })

    if (parentCallBack) parentCallBack(grid, children, index, parentGrid, columnIndex)
}

export function ansiparse (str) {
    ansiparse.foregroundColors = {
        '30': 'rgba(0,0,0,1)',
        '31': 'rgba(247,49,49,1)',
        '32': 'rgba(127,202,84,1)',
        '33': 'rgba(246,222,84,1)',
        '34': 'rgba(0,0,255,1)',
        '35': 'rgba(255,0,255,1)',
        '36': 'rgba(0,255,255,1)',
        '37': 'rgba(255,255,255,1)',
        '90': 'rgba(128,128,128,1)'
    }

    ansiparse.backgroundColors = {
        '40': 'rgba(0,0,0,1)',
        '41': 'rgba(247,49,49,1)',
        '42': 'rgba(127,202,84,1)',
        '43': 'rgba(246,222,84,1)',
        '44': 'rgba(0,0,255,1)',
        '45': 'rgba(255,0,255,1)',
        '46': 'rgba(0,255,255,1)',
        '47': 'rgba(255,255,255,1)'
    }

    ansiparse.styles = {
        '1': 'bold',
        '3': 'italic',
        '4': 'underline'
    }

    let matchingControl = null
    let matchingData = null
    let matchingText = ''
    let ansiState = []
    const result = []
    let state = {}

    const eraseChar = function () {
        let index
        let message
        if (matchingText.length) {
            matchingText = matchingText.substr(0, matchingText.length - 1)
        } else if (result.length) {
            index = result.length - 1
            message = result[index].message
            if (message.length === 1) result.pop()
            else result[index].message = message.substr(0, message.length - 1)
        }
    }

    for (let i = 0; i < str.length; i++) {
        if (matchingControl !== null) {
            if (matchingControl === '\u001b' && str[i] === '\[') {
                if (matchingText) {
                    state.message = matchingText
                    result.push(state)
                    state = {}
                    matchingText = ''
                }

                matchingControl = null
                matchingData = ''
            } else {
                matchingText += matchingControl + str[i]
                matchingControl = null
            }
            continue
        } else if (matchingData !== null) {
            if (str[i] === ';') {
                ansiState.push(matchingData)
                matchingData = ''
            } else if (str[i] === 'm') {
                ansiState.push(matchingData)
                matchingData = null
                matchingText = ''
                ansiState.forEach(function (ansiCode) {
                    if (ansiparse.foregroundColors[ansiCode]) {
                        state.color = ansiparse.foregroundColors[ansiCode]
                    } else if (ansiparse.backgroundColors[ansiCode]) {
                        state.backgroundColor = ansiparse.backgroundColors[ansiCode]
                    } else if (ansiCode === 39) {
                        delete state.color
                    } else if (ansiCode === 49) {
                        delete state.backgroundColor
                    } else if (ansiparse.styles[ansiCode]) {
                        state[ansiparse.styles[ansiCode]] = true
                    } else if (ansiCode === 22) {
                        state.bold = false
                    } else if (ansiCode === 23) {
                        state.italic = false
                    } else if (ansiCode === 24) {
                        state.underline = false
                    }
                })
                ansiState = []
            } else {
                matchingData += str[i]
            }
            continue
        }

        if (str[i] === '\u001b') {
            matchingControl = str[i]
        } else if (str[i] === '\u0008') {
            eraseChar()
        } else {
            matchingText += str[i]
        }
    }

    if (matchingText) {
        state.message = matchingText + (matchingControl || '')
        result.push(state)
    }
    return result
}

function getEslintOption (func, customOptions = {}) {
    const globals = { lesscode: true };
    [...(func.funcParams || []), ...(func.remoteParams || [])].forEach((key) => {
        globals[key] = true
    })
    const options = {
        useEslintrc: true,
        overrideConfig: {
            ...eslintConfig,
            globals
        },
        ...customOptions
    }
    return options
}

function getErrorHtmlMessage (errStrArr) {
    return errStrArr.map((err) => {
        return (err.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }).join('')
}

export async function checkFuncEslint (func) {
    const options = getEslintOption(func)
    const eslint = new ESLint(options)
    const code = func.funcBody || ''
    const results = await eslint.lintText(code || '')
    const formatter = await eslint.loadFormatter('stylish')
    const formateRes = formatter.format(results)
    const errStrArr = ansiparse(formateRes)
    let mes = ''
    if (errStrArr.length) mes = `<pre style="margin:0">eslint检查不通过，可点击 <i class="bk-drag-icon bk-drag-fix"></i> 进行自动修复：\n${getErrorHtmlMessage(errStrArr)}</pre>`
    return mes
}

export async function verifyAndFixFunc (func) {
    const options = getEslintOption(func, { fix: true })
    const eslint = new ESLint(options)
    const code = func.funcBody || ''
    // fix code
    const results = await eslint.lintText(code || '')
    await ESLint.outputFixes(results)
    // get message
    const formatter = await eslint.loadFormatter('stylish')
    const formateRes = formatter.format(results)
    const errStrArr = ansiparse(formateRes)
    let message = ''
    if (errStrArr.length) message = `<pre style="margin:0">自动修复Eslint失败，请手动修复下面的问题后重试：\n${getErrorHtmlMessage(errStrArr)}</pre>`

    const fixResult = {
        code: results[0].output || '',
        message
    }
    return fixResult
}
