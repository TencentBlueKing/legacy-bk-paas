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

import { getRepository } from 'typeorm'
import Project from '../model/entities/project'
import ReleaseVersion from '../model/entities/release-version'

export const ERROR_CODES = {
    INVAILD_USER: [30001, '无效的用户'],
    NOT_FOUND_USER: [30002, '未找到用户'],
    MISSING_PARAMS_PROJECT_ID: [30003, '缺少参数 projectId'],
    MISSING_PARAMS_VERSION: [30004, '缺少参数 version'],
    MISSING_PARAMS_APPCODE: [30005, '缺少参数 appCode'],
    MISSING_PARAMS_MODULECODE: [30006, '缺少参数 moduleCode']
}

const success = function (ctx, data = null) {
    ctx.send({
        code: 0,
        message: 'OK',
        data
    })
}

export const ping = async (ctx) => {
    try {
        const { app = {}, user = {} } = ctx.state.jwt

        ctx.send({
            code: 0,
            message: 'OK',
            data: {
                app_code: app.app_code,
                username: user.username
            }
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}

/**
 * 获取用户有权限的项目列表及项目版本号列表
 * @returns {Array.<{projectId: Number, projectCode: String, projectName: String, versionList: Array}>}
 */
export const getProjectReleases = async (ctx) => {
    try {
        const { user } = ctx.state.jwt || {}

        const result = await getRepository(Project)
            .createQueryBuilder('project')
            .innerJoinAndSelect('r_user_project_role', 'user_project_role', 'user_project_role.projectId = project.id')
            .leftJoinAndSelect('release_version', 'release_version', 'release_version.projectId = project.id')
            .select(['project.id as projectId', 'project.projectCode as projectCode', 'project.projectName as projectName', 'release_version.version as version'])
            .where('project.deleteFlag != 1 AND user_project_role.deleteFlag != 1 AND user_project_role.userId = :userId', { userId: user.id })
            .orderBy('project.id', 'DESC')
            .getRawMany()

        const list = []
        result.forEach(resultItem => {
            const { version, ...project } = resultItem
            const inserted = list.find(item => item.projectId === project.projectId)
            if (inserted) {
                inserted.versionList.push(version)
            } else {
                list.push({
                    ...project,
                    versionList: version ? [version] : []
                })
            }
        })

        success(ctx, list)
    } catch (e) {
        ctx.throw(e)
    }
}

/**
 * 根据项目id+版本号获取项目源码包
 * @returns {Object} 发布记录的部分字段
 */
export const getProjectReleasePackage = async (ctx) => {
    const { projectId, version } = ctx.request.query

    if (!version) {
        ctx.throw(400, ERROR_CODES['MISSING_PARAMS_VERSION'][1], { code: ERROR_CODES['MISSING_PARAMS_VERSION'][0] })
    }

    const result = await getRepository(ReleaseVersion).findOne({
        select: ['env', 'version', 'status', 'codeUrl'],
        where: {
            projectId,
            version
        }
    })

    success(ctx, result)
}

/**
 * 根据 appCode 和 moduleCode 获取项目id和名称
 * @returns {Object}
 */
export const getProjectByBindApp = async (ctx) => {
    const { appCode, moduleCode } = ctx.request.query

    if (!appCode) {
        ctx.throw(400, ERROR_CODES['MISSING_PARAMS_APPCODE'][1], { code: ERROR_CODES['MISSING_PARAMS_APPCODE'][0] })
    }

    if (!moduleCode) {
        ctx.throw(400, ERROR_CODES['MISSING_PARAMS_MODULECODE'][1], { code: ERROR_CODES['MISSING_PARAMS_MODULECODE'][0] })
    }

    const result = await getRepository(Project).findOne({
        select: ['id', 'projectName'],
        where: {
            appCode,
            moduleCode
        }
    })

    success(ctx, result)
}
