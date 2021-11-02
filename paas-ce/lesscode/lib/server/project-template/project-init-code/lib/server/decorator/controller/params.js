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

// 收集参数元信息
const setParamMetaData = (target, metadata) => {
    if (!target.__metadata) {
        target.__metadata = {}
    }
    const metadataKeys = Object.keys(metadata)
    metadataKeys.forEach((metadataKey) => {
        if (!target.__metadata.hasOwnProperty(metadataKey)) {
            target.__metadata[metadataKey] = {}
        }
        Object.assign(target.__metadata[metadataKey], metadata[metadataKey])
    })
}

/**
 * 对参数进行校验并求值
 * @param {*} data 数据
 * @param {*} options 校验格式 { name: string, type?: string, require?: boolean, validate?: Function }
 */
const validateParam = (data, options = {}) => {
    const { name, type, require, validate, default: defaultVal } = options
    const value = name ? data[name] : data
    const valueType = typeof value

    if (require && ['', undefined, null].includes(value)) {
        throw new global.BusinessError(`Param ${name} is required, but receive ${value}`, 400, 400)
    }

    if (type && valueType !== type) {
        throw new global.BusinessError(`Param ${name} should be type ${type}, but receive ${valueType}`, 400, 400)
    }

    if (validate && validate(value)) {
        throw new global.BusinessError(`Param ${name} is invalid: ${validate(value)}`, 400, 400)
    }

    return value !== undefined ? value : defaultVal
}

/**
 * query 参数
 * @param {*} options { name: string, require?: boolean, validate?: Function }
 * 注意 koa query 参数 type 都是 string
 */
export function QueryParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const query = ctx.request.query
                    return validateParam(query, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * path 参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function PathParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const params = ctx.params
                    return validateParam(params, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * body 参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function BodyParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const body = ctx.request.body
                    return validateParam(body, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * 请求头参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function HeaderParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const headers = ctx.request.headers
                    return validateParam(headers, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * session 参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function SessionParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const session = ctx.session
                    return validateParam(session, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * cookie 参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function CookieParams (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    const header = ctx.request.header || {}
                    const cookieStr = header.cookie || ''
                    const cookieArray = cookieStr.split(';').filter(v => v)
                    const cookieMap = cookieArray.reduce((acc, cur) => {
                        const cookieStr = cur.trim()
                        const [key, value] = cookieStr.split('=')
                        acc[key] = value
                        return acc
                    }, {})
                    return validateParam(cookieMap, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}

/**
 * ctx 参数
 * @param {*} options { name: string, type?: string, require?: boolean, validate?: Function }
 */
export function Ctx (options) {
    return (target, parameterName, parameterIndex) => {
        const metadata = {
            [parameterName]: {
                [parameterIndex] (ctx) {
                    return validateParam(ctx, options)
                }
            }
        }
        setParamMetaData(target, metadata)
    }
}
