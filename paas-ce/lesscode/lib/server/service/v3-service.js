import fileService from '../utils/file-service/index'
import { getEnvInfo, getLatestInfo, createVersion, updateVersion } from '../model/release-version'

const request = require('request')
const shell = require('shelljs')

const { logger } = require('../logger')
let v3Config
try {
    v3Config = require('../conf/v3')
} catch (_) {
    v3Config = {}
}

const path = require('path')
const fse = require('fs-extra')

const DIR_PATH = '.'
const STATIC_URL = `${DIR_PATH}/lib/server/project-template/`

export const getReleaseInfo = async (projectId, appCode, moduleCode, env, bkTicket, bindInfo) => {
    const url = `${v3Config.URL_PREFIX}/bkapps/applications/${appCode}/modules/${moduleCode}/envs/${env}/released_state/?bk_app_code=${v3Config.APP_ID}&bk_app_secret=${encodeURI(v3Config.APP_SECRET)}&bk_ticket=${bkTicket}`
    return new Promise((resolve, reject) => {
        request.get(url, async function (error, response, body) {
            try {
                let res = body
                if (typeof body === 'string') {
                    res = JSON.parse(body)
                }
                // console.log('getReleaseInfo body', res)
                res = await parseV3ReleaseInfo(res)

                if (res.version) {
                    // 对应环境的最近一条对应记录，若是同一个版本的running状态，将结果回写
                    const latestDbData = await getLatestInfo(projectId, `'${env}'`, res.isOffline)
                    if (latestDbData[0] && latestDbData[0].status === 'running' && latestDbData[0].version === res.version) {
                        await updateVersion(latestDbData[0].id, { status: res.status })
                    }
                    // 取对应环境的最近一次成功记录，若和v3环境的当前version不一致，则写入到db
                    const dbEnvData = await getEnvInfo(projectId, env)
                    if (!dbEnvData[0] || (dbEnvData[0] && (dbEnvData[0].version !== res.version || dbEnvData[0].isOffline !== res.isOffline))) {
                        const insertData = Object.assign({}, res, {
                            appCode,
                            moduleCode,
                            env,
                            projectId,
                            bindInfo: bindInfo || `${appCode}/${moduleCode}`,
                            releaseType: 'FROM_V3',
                            accessUrl: undefined
                        })
                        await createVersion(insertData)
                    } else {
                        res.mobileUrl = dbEnvData[0].mobileUrl
                    }
                    if (res.status === 'successful' && env === 'prod') {
                        const moduleInfo = await getModuleInfo(appCode, moduleCode, bkTicket)
                        res.isDefault = moduleInfo && moduleInfo.is_default
                        res.marketPublished = moduleInfo && moduleInfo.web_config && moduleInfo.web_config.market_published
                    }
                }
                // console.log(res, env, 'return')
                resolve(res)
            } catch (err) {
                console.log(error, 'getReleaseInfo err', err)
                resolve({})
            }
        })
    })
}

export const parseV3ReleaseInfo = async (res) => {
    let data = {}   // eslint-disable-line
    if (typeof res !== 'object' || !res.exposed_link) {
        return {}
    }
    try {
        const typeData = (res.is_offlined ? res.offline : res.deployment) || {}
        data.accessUrl = res.default_access_entrance ? res.default_access_entrance.url : res.exposed_link.url
        data.deployId = typeData.id
        data.version = typeData.repo.revision || typeData.repo.name
        data.fromPaasInfo = JSON.stringify({ createTime: typeData.created, createUser: typeData.operator.username })
        data.createTime = typeData.created
        data.updateTime = typeData.created
        data.createUser = typeData.operator.username
        data.updateUser = typeData.operator.username
        data.isOffline = res.is_offlined ? 1 : 0
        data.status = typeData.status
        return data
    } catch (err) {
        return {}
    }
}

export const getModuleInfo = async (appCode, moduleCode, bkTicket) => {
    const url = `${v3Config.URL_PREFIX}/bkapps/applications/${appCode}/modules/${moduleCode}/?bk_app_code=${v3Config.APP_ID}&bk_app_secret=${encodeURI(v3Config.APP_SECRET)}&bk_ticket=${bkTicket}`
    return new Promise((resolve, reject) => {
        request.get(url, async function (error, response, body) {
            try {
                let res = body
                if (typeof body === 'string') {
                    res = JSON.parse(body)
                }
                resolve(res)
            } catch (err) {
                console.log(error)
                resolve({})
            }
        })
    })
}

export const uploadToV3 = async (releaseForm, appInfo, codeUrl, bkTicket) => {
    const formData = {
        package_url: codeUrl,
        version: releaseForm.version,
        bk_app_code: v3Config.APP_ID,
        bk_app_secret: v3Config.APP_SECRET,
        bk_ticket: bkTicket,
        allow_overwrite: 'true' // 覆盖原有的源码包
    }
    const url = `${v3Config.URL_PREFIX}/bkapps/applications/${appInfo.appCode}/modules/${appInfo.moduleCode}/source_package/link/`
    return new Promise((resolve, reject) => {
        request.post({ url, formData }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body)
            } else {
                let res = {}
                if (typeof body === 'string') {
                    try {
                        res = JSON.parse(body)
                    } catch (error) {
                        res = {}
                    }
                }
                reject(new Error(`上传包至部署环境失败： ${res.detail || body}`))
            }
        })
    })
}

export const deploy = async (releaseForm, appInfo, bkTicket) => {
    const data = {
        url: '',
        revision: releaseForm.version,
        version_type: 'package',
        version_name: releaseForm.version,
        bk_app_code: v3Config.APP_ID,
        bk_app_secret: v3Config.APP_SECRET,
        bk_ticket: bkTicket
    }
    const url = `${v3Config.URL_PREFIX}/bkapps/applications/${appInfo.appCode}/modules/${appInfo.moduleCode}/envs/${releaseForm.env}/deployments/`
    return new Promise((resolve, reject) => {
        request.post({ url, json: true, body: data }, async function (error, response, body) {
            if (typeof body === 'object' && body.deployment_id) {
                resolve(body)
            } else {
                reject(new Error(`部署发起失败： ${body.detail || error}`))
            }
        })
    })
}

export const uploadToBkRepo = async (projectId, version, versionId, releaseId) => {
    const sourceDir = `project-target-code${projectId}${versionId ? `-${versionId}` : ''}`
    const sourcePath = path.join(STATIC_URL, `/${sourceDir}`)
    const targetPath = path.join(STATIC_URL, `bklesscode-proj-${projectId}`)
    const projectPath = path.resolve('./')

    return new Promise(async (resolve, reject) => {
        try {
            shell.cd(STATIC_URL)
            const targz = `tar zcf bklesscode-proj-${projectId}.tar.gz -C ./${sourceDir} .`
            shell.exec(targz)
            shell.cd(projectPath)

            const uploadKey = `project/${projectId}/${version}/${releaseId}/`
            const url = await fileService.uploadFile(`${targetPath}.tar.gz`, uploadKey)
            console.log(url, 'uploadUrl')
            logger.info(`fileService uploadFile response: ${url}`)
            if (url) {
                const signUrl = await fileService.signUrl(url, 0)
                resolve(signUrl)
                fse.remove(`${targetPath}.tar.gz`)
                fse.remove(sourcePath)
            }
        } catch (err) {
            reject(new Error(`打包压缩并上传包过程失败： ${err}`))
        }
    })
}
