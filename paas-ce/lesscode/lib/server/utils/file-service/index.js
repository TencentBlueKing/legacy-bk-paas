const fs = require('fs')
const request = require('request')
const path = require('path')

// bk-repo.js配置文件不存在时赋值空对象
let config
try {
    config = require('../../conf/bk-repo')
} catch (_) {
    config = {}
}
const headers = {
    'Authorization': 'Basic ' + Buffer.from(config.BKREPO_USERNAME + ':' + config.BKREPO_PASSWORD).toString('base64')
}

const urlPrefix = `${config.BKREPO_ENDPOINT_URL}/generic/${config.BKREPO_PROJECT}`

/**
 * 获取最终的接口调用地址
 * @param {string} path 接口路径
 * @param {boolean} isPublic 是否为公开
 * @returns {string} 最终的接口调用地址
 */
const getUrl = (path, isPublic) => {
    let prefix = urlPrefix
    if (isPublic === undefined) {
        prefix = `${prefix}/${config.BKREPO_BUCKET}`
    } else {
        prefix = `${prefix}/${isPublic ? config.BKREPO_PUBLIC_BUCKET : config.BKREPO_PRIVATE_BUCKET}`
    }

    let newPath = path
    if (!newPath.startsWith('/')) {
        newPath = '/' + newPath
    }

    return `${prefix}${newPath}`
}

const checkSetting = () => {
    if (!config.BKREPO_USERNAME || !config.BKREPO_PROJECT || !config.BKREPO_ENDPOINT_URL) {
        throw new Error('bkRepo: 请先搭建bkRepo服务并确认配置信息已设置正确')
    }
}

const uploadFolder = async (folderPath, uploadKey) => {
    checkSetting()
    const fileMap = []
    const walkSync = (currentDirPath, prefixPath) => {
        fs.readdirSync(currentDirPath).forEach(async (name) => {
            const filePath = path.join(currentDirPath, name)
            const stat = fs.statSync(filePath)
            if (stat.isFile()) {
                fileMap.push(uploadFile(filePath, `/${prefixPath}/`))
            } else if (stat.isDirectory()) {
                walkSync(filePath, `${prefixPath}/${name}`)
            }
        })
    }
    walkSync(folderPath, uploadKey)
    return Promise.all(fileMap)
}

/*
* @params
* string targetFile: bkrepo上文件路径
* string dest 下载文件的写入目录，为空则不会写到本地文件直接返回内容
*/
const downloadFile = (targetFile, dest) => {
    checkSetting()
    const fse = require('fs-extra')

    if (dest) {
        const destParent = path.dirname(dest)
        fse.ensureDirSync(destParent)
    }

    const options = {
        url: getUrl(targetFile),
        headers: headers
    }

    return new Promise((resolve, reject) => {
        request.get(options, function (err, res, body) {
            if (err || res.statusCode !== 200) {
                console.log(err, res.statusCode, body)
                reject(new Error(`请检测自定义组件是否上传成功: ${err || res.statusCode}`))
            } else {
                if (dest) {
                    fse.outputFileSync(dest, body)
                    resolve()
                } else {
                    resolve(body)
                }
            }
        })
    })
}

const getSignUrl = async (fullPathSet = [], expireSeconds = 0) => {
    checkSetting()
    const data = {
        projectId: config.BKREPO_PROJECT,
        repoName: config.BKREPO_BUCKET,
        type: 'DOWNLOAD',
        expireSeconds,
        fullPathSet
    }
    const url = `${config.BKREPO_ENDPOINT_URL}/generic/temporary/url/create`
    return new Promise((resolve, reject) => {
        request.post({ url, body: data, json: true, headers }, function (err, res, body) {
            if (err || res.statusCode !== 200) {
                reject(new Error(`获取下载链接失败: ${err || res.statusCode}`))
            } else if (typeof body === 'object' && body.code !== 0) {
                reject(new Error(`获取下载链接失败:${body.message}`))
            } else {
                resolve(body.data)
            }
        })
    })
}

const uploadFile = async (filePath, uploadKey, settings = {}) => {
    checkSetting()
    const key = path.basename(filePath)
    const fileStream = fs.createReadStream(filePath)
    fileStream.on('error', err => {
        return Promise.reject(err)
    })
    const res = await uploadRepoFile(`${uploadKey}${key}`, fileStream, settings)
    return res
}

const uploadImage = async (filePath, uploadKey, settings = {}) => {
    checkSetting()
    const key = path.basename(filePath)

    let uploadPath = `${uploadKey}${key}`
    if (settings.ensurePath) {
        uploadPath = uploadKey
    }

    const fileStream = fs.createReadStream(filePath)
    fileStream.on('error', err => {
        return Promise.reject(err)
    })
    const res = await uploadRepoFile(uploadPath, fileStream, settings)
    return res
}

/**
 * 上传文件至bkrepo
 * @param {string} uploadPath 文件存储路径
 * @param {ReadStream} fileStream 文件内容
 * @param {object} settings 配置选项
 * @param {boolean} settings.isPublic 是否公开
 * @param {boolean} settings.fullUrl 是否返回完整url
 * @returns {Promise} 文件存储路径
 */
const uploadRepoFile = async (uploadPath, fileStream, settings = {}) => {
    const url = getUrl(uploadPath, settings.isPublic)
    const options = {
        url,
        method: 'PUT',
        headers: Object.assign({}, headers, { 'X-BKREPO-OVERWRITE': true }),
        body: fileStream
    }
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            if (err || res.statusCode !== 200) {
                reject(new Error(`上传至repo失败: ${err || res.statusCode}`))
            } else if (typeof body === 'object' && body.code > 0) {
                reject(new Error(`上传至repo失败： ${body.message}`))
            } else if (body.code === 0) {
                resolve(settings.fullUrl ? url : uploadPath)
            } else {
                reject(new Error('上传至repo失败'))
            }
        })
    })
}

module.exports = {
    uploadFile,
    getSignUrl,
    uploadFolder,
    downloadFile,
    uploadImage
}
