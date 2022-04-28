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

import ProjectModel from '../model/project'
import ReleaseModel from '../model/release-version'
import RouteModel from '../model/route'
import { getRouteFullPath, getProjectDefaultRoute } from '../../shared/route'
import ProjectCodeModel from '../model/project-code'
import { getReleaseInfo, uploadToBkRepo, uploadToV3, deploy } from '../service/v3-service'
import projectVersionService from '../service/project-version'
import http from '../utils/http'

const { logger } = require('../logger')
const AU = require('ansi_up')
const ansiUp = new AU.default  // eslint-disable-line

let config
try {
    config = require('../conf/v3')
} catch (_) {
    config = {}
}

const Realease = {
    async checkConfig (ctx) {
        let hasConfig = true
        if (!config.URL_PREFIX) {
            hasConfig = false
        }
        ctx.send({
            code: 0,
            message: 'success',
            data: hasConfig
        })
    },
    async applicationList (ctx) {
        try {
            if (!config.URL_PREFIX) {
                ctx.throwError({
                    message: '请先配置paas平台相关信息'
                })
            }
            const bkTikcet = ctx.cookies.get('bk_ticket')
            const url = `${config.URL_PREFIX}/bkapps/applications/lists/minimal?include_inactive=true&bk_app_code=${config.APP_ID}&bk_app_secret=${encodeURI(config.APP_SECRET)}&bk_ticket=${bkTikcet}`
            logger.info(`applicationList url: ${url}`)
            const res = await ctx.http.get(url)
            ctx.send({
                code: 0,
                message: 'success',
                data: (res.data && res.data.results) || []
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async moduleList (ctx) {
        try {
            if (!config.URL_PREFIX) {
                ctx.throwError({
                    message: '请先配置paas平台相关信息'
                })
            }
            const { appCode } = ctx.request.query
            const bkTikcet = ctx.cookies.get('bk_ticket')
            const url = `${config.URL_PREFIX}/bkapps/applications/${appCode}/modules/?source_origin=2&bk_app_code=${config.APP_ID}&bk_app_secret=${encodeURI(config.APP_SECRET)}&bk_ticket=${bkTikcet}`
            const res = await ctx.http.get(url)
            const existBindLists = (await ProjectModel.findProjects({ appCode })).map(item => item.moduleCode) || []

            const arr = (res.data && res.data.length) ? res.data : []
            const data = arr.map(item => {
                const disabled = (existBindLists.indexOf(item.name) !== -1)
                return {
                    ...item,
                    disabled
                }
            })
            ctx.send({
                code: 0,
                message: 'success',
                data: data || []
            })
        } catch (err) {
            if (err.message === 'Request failed with status code 403') {
                err.message = '无权限操作当前应用模块'
            }
            if (err.message === 'Request failed with status code 404') {
                err.message = '获取模块列表失败'
            }

            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async detailInfo (ctx) {
        try {
            const { projectId, bindInfo } = ctx.request.body
            const project = await ProjectModel.findProjectDetail({ id: projectId }) || {}
            const prodInfo = await getReleaseInfo(projectId, project.appCode, project.moduleCode, 'prod', ctx.cookies.get('bk_ticket'), bindInfo)
            const stagInfo = await getReleaseInfo(projectId, project.appCode, project.moduleCode, 'stag', ctx.cookies.get('bk_ticket'), bindInfo)
            const latestArr = await ReleaseModel.getLatestInfo(projectId)
            const data = {
                prodInfo,
                stagInfo,
                latestInfo: latestArr[0] || {},
                createLinkUrl: config.CREATE_URL_PREFIX
            }
            ctx.send({
                code: 0,
                message: 'success',
                data: data || {}
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async releaseProject (ctx) {
        let { releaseForm } = ctx.request.body

        // 非历史版本部署（项目默认或已有版本），此时需要生成新包
        const isNewPackage = releaseForm.releaseType !== 'HISTORY_VERSION'

        let validMsg = ''
        if (!releaseForm.version) validMsg = '版本号不能为空'
        if (releaseForm.releaseType === 'NEW_VERSION') {
            const isExist = await projectVersionService.has(releaseForm.projectId, releaseForm.version)
            if (isExist) {
                validMsg = '该版本号已存在，请重新输入'
            }
        }

        const project = await ProjectModel.findProjectDetail({ id: releaseForm.projectId }) || {}
        if (!project.appCode || !project.moduleCode) validMsg = '请先绑定蓝鲸应用及相应模块'
        validMsg && ctx.throwError({
            message: validMsg
        })

        const appInfo = {
            appCode: project.appCode,
            moduleCode: project.moduleCode
        }
        releaseForm = Object.assign({}, releaseForm, appInfo)

        // 生成release-version表记录
        let id = ''
        if (isNewPackage) {
            const res = await ReleaseModel.createVersion(releaseForm)
            id = res.id || ''
        } else {
            const res = await ReleaseModel.createVersionFromHistory(releaseForm)
            id = res.id || ''
        }
        if (!id) {
            ctx.throwError({
                message: '创建部署记录失败'
            })
        }

        let catchErr = null
        let result = null

        try {
            if (isNewPackage) {
                // 生成项目源码
                const codeRes = await ProjectCodeModel.generateCode(releaseForm.projectId, releaseForm.versionId)
                console.log(codeRes, 'code')

                // 记录本次部署的项目是否含有移动端页面，有则记录下移动端首页访问路径
                let mobileUrl = ''
                const [
                    routeList,
                    pageRouteList
                ] = await Promise.all([
                    RouteModel.findProjectRoute(releaseForm.projectId, releaseForm.versionId),
                    RouteModel.queryProjectPageRoute(releaseForm.projectId, releaseForm.versionId)
                ])
                const mobileRouteList = routeList.filter(item => item.platform === 'MOBILE' && !(item.pageId === -1 && !item.redirect)).map(item => ({
                    ...item,
                    fullPath: getRouteFullPath(item)
                }))
                if (mobileRouteList.length) {
                    const mobilePageRouteList = pageRouteList.filter(item => item.pageType === 'MOBILE').map(item => ({
                        ...item,
                        fullPath: getRouteFullPath(item)
                    }))
                    const defaultRoute = getProjectDefaultRoute(mobilePageRouteList, mobileRouteList, 'MOBILE')
                    mobileUrl = defaultRoute['fullPath']
                    await ReleaseModel.updateVersion(id, { mobileUrl })
                }

                // 上传包到文件仓库并签名
                const codeUrl = await uploadToBkRepo(releaseForm.projectId, releaseForm.version, releaseForm.versionId, id)
                await ReleaseModel.updateVersion(id, { codeUrl: codeUrl })
                console.log(codeUrl, 'codeurl')

                // 同步包到v3
                const syncRes = await uploadToV3(releaseForm, appInfo, codeUrl, ctx.cookies.get('bk_ticket'))
                console.log(syncRes, 'sync')
            }

            // 开启 mysql
            if (releaseForm.releaseSqlIds) {
                await http.request({
                    url: `${config.URL_PREFIX}/system/bkapps/applications/${appInfo.appCode}/modules/${appInfo.moduleCode}/lesscode/bind_db_service`,
                    method: 'post',
                    headers: {
                        'x-bkapi-authorization': JSON.stringify({
                            bk_app_code: config.APP_ID,
                            bk_app_secret: config.APP_SECRET
                        })
                    }
                })
            }

            // 部署包
            const deployRes = await deploy(releaseForm, appInfo, ctx.cookies.get('bk_ticket'))
            // const accessUrl = await ProjectCodeModel.getAccessUrlInfo(appInfo, releaseForm.env, ctx.cookies.get('bk_ticket'))
            await ReleaseModel.updateVersion(id, { deployId: deployRes.deployment_id })
            result = deployRes
            console.log(deployRes, 'deploy')
        } catch (err) {
            const data = {
                status: 'failed',
                errorMsg: err.message || err
            }
            ReleaseModel.updateVersion(id, data)
            catchErr = err
        }

        try {
            // 部署成功并且为部署新版本才创建项目版本
            if (!catchErr && releaseForm.releaseType === 'NEW_VERSION') {
                const { projectId, version, versionLog } = releaseForm
                const newVersionId = await projectVersionService.create({ projectId, version, versionLog })
                // 自动归档
                await projectVersionService.update(newVersionId, { archiveFlag: 1 })
            }
        } catch (err) {
            catchErr = err
        }

        if (!catchErr) {
            ctx.send({
                code: 0,
                message: 'success',
                data: result
            })
        } else {
            ctx.throwError(catchErr)
        }
    },

    async updateReleaseVersion (ctx) {
        try {
            const { id, data } = ctx.request.body
            const res = await ReleaseModel.updateVersion(id, data)
            ctx.send({
                code: 0,
                message: 'success',
                data: res
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async getList (ctx) {
        try {
            const { projectId } = ctx.request.query
            const res = await ReleaseModel.getList(projectId)
            ctx.send({
                code: 0,
                message: 'success',
                data: res || []
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async getProjectVersionOptionList (ctx) {
        const { projectId } = ctx.request.query
        try {
            const list = await projectVersionService.getOptionList(projectId, ['id', 'version', 'versionLog'])
            ctx.send({
                code: 0,
                data: list,
                message: 'success'
            })
        } catch (e) {
            ctx.throw(e)
        }
    },

    async getSucVersionList (ctx) {
        try {
            const { projectId } = ctx.request.query
            const arr = await ReleaseModel.getSuccessVersionList(projectId)
            // 数据去重
            let tmpVersionArr = []  // eslint-disable-line
            let res = []    // eslint-disable-line
            arr.forEach(function (item) {
                if (tmpVersionArr.indexOf(item.version) === -1 && item.codeUrl) {
                    tmpVersionArr.push(item.version)
                    res.push(item)
                }
            })
            ctx.send({
                code: 0,
                message: 'success',
                data: res
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async getRunningLog (ctx) {
        try {
            const { deployId } = ctx.request.query
            const url = `${config.URL_PREFIX}/streams/${deployId}/history_events?bk_app_code=${config.APP_ID}&bk_app_secret=${encodeURI(config.APP_SECRET)}&bk_ticket=${ctx.cookies.get('bk_ticket')}`
            const res = await ctx.http.get(url) || []
            let data = { logs: [], status: 'running' }  // eslint-disable-line
            if (res.data && res.data.length) {
                const lastLine = res.data[res.data.length - 1]
                if (lastLine.event === 'close') {
                    data.status = 'end'
                }
                data.logs = res.data.map(line => {
                    let content = line.data
                    if (line.event === 'msg') {
                        const obj = JSON.parse(line.data)
                        content = ansiUp.ansi_to_html(obj.line || line.data)
                    }
                    return {
                        id: line.id,
                        event: line.event,
                        data: line.data,
                        content
                    }
                })
            }
            ctx.send({
                code: 0,
                message: 'success',
                data
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async detailFromV3 (ctx) {
        try {
            const { projectId, deployId } = ctx.request.query
            const project = await ProjectModel.findProjectDetail({ id: projectId }) || {}
            const url = `${config.URL_PREFIX}/bkapps/applications/${project.appCode}/modules/${project.moduleCode}/deployments/${deployId}/result/?bk_app_code=${config.APP_ID}&bk_app_secret=${encodeURI(config.APP_SECRET)}&bk_ticket=${ctx.cookies.get('bk_ticket')}`
            const res = await ctx.http.get(url)
            if (res.data && res.data.logs) {
                res.data.logs = ansiUp.ansi_to_html(res.data.logs)
            }
            ctx.send({
                code: 0,
                message: 'success',
                data: res.data || {}
            })
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async checkAppInfoExist (ctx) {
        const { appInfo, projectId } = ctx.request.body
        let projects = await ProjectModel.findProjects(appInfo) || {}
        projects = projects.filter(item => item.id !== projectId)
        if (projects && projects.length) {
            ctx.throwError({
                message: '该蓝鲸应用模块已被其它应用绑定，请重新选择'
            })
        } else {
            ctx.send({
                code: 0,
                message: 'success',
                data: ''
            })
        }
    },

    async offlineProject (ctx) {
        try {
            let validMsg = ''
            const { projectId, env, version } = ctx.request.body
            const project = await ProjectModel.findProjectDetail({ id: projectId }) || {}
            if (!project.appCode || !project.moduleCode) validMsg = '请先绑定蓝鲸应用及相应模块'
            validMsg && ctx.throwError({
                message: validMsg
            })

            const postData = {
                bk_app_code: config.APP_ID,
                bk_app_secret: config.APP_SECRET,
                bk_ticket: ctx.cookies.get('bk_ticket')
            }
            const url = `${config.URL_PREFIX}/bkapps/applications/${project.appCode}/modules/${project.moduleCode}/envs/${env}/offlines/`
            const res = await ctx.http.post(url, postData)
            if (res.data && res.data.offline_operation_id) {
                ctx.send({
                    code: 0,
                    message: 'success',
                    data: res.data.offline_operation_id
                })
                await ReleaseModel.insertFromPreVersion({ version, projectId }, {
                    id: undefined,
                    codeUrl: '',
                    deployId: res.data.offline_operation_id,
                    status: 'running',
                    isOffline: 1
                })
            } else {
                ctx.send({
                    code: 500,
                    message: '下架失败',
                    data: ''
                })
            }
            console.log(res.data, 7688)
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    },

    async checkOfflineResult (ctx) {
        try {
            const { projectId, offlineId } = ctx.request.query
            const project = await ProjectModel.findProjectDetail({ id: projectId }) || {}

            const url = `${config.URL_PREFIX}/bkapps/applications/${project.appCode}/modules/${project.moduleCode}/offlines/${offlineId}/result/?bk_app_code=${config.APP_ID}&bk_app_secret=${encodeURI(config.APP_SECRET)}&bk_ticket=${ctx.cookies.get('bk_ticket')}`
            const res = await ctx.http.get(url)

            ctx.send({
                code: 0,
                message: 'success',
                data: res.data || {}
            })
            console.log(url, res.data, 7790)
        } catch (err) {
            ctx.throwError({
                message: err.message || err
            })
        }
    }

}

module.exports = Realease
