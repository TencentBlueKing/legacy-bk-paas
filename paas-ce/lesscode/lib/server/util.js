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

const os = require('os')

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
