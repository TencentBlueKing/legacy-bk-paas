const os = require('os')
const fs = require('fs')

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

export async function execSql (queryRunner, path) {
    const sqlBuffer = fs.readFileSync(path)
    const sqlString = sqlBuffer.toString()
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
    for (const sqlStr of sqlArr) {
        if (sqlStr) await queryRunner.query(sqlStr)
    }
}
