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
import ReleaseVersion from './entities/release-version'

module.exports = {
    // 获取项目下可见的页面列表
    getList (projectId) {
        return getRepository(ReleaseVersion).createQueryBuilder('release_version')
            .where('projectId = :projectId', { projectId })
            .andWhere('deleteFlag = 0')
            .orderBy('id', 'DESC')
            .getMany()
    },

    getSuccessVersionList (projectId) {
        return getRepository(ReleaseVersion).createQueryBuilder('release_version')
            .where('projectId = :projectId', { projectId })
            .andWhere('deleteFlag = 0')
            .andWhere('status = "successful"')
            .select(['version', 'createUser', 'createTime', 'codeUrl'])
            .orderBy('id', 'DESC')
            .getRawMany()
    },

    // check页面ID是否存在
    checkVersionExist (projectId, version) {
        console.log(projectId, version, 'model')
        return getRepository(ReleaseVersion).createQueryBuilder('release_version')
            .where('projectId = :projectId', { projectId })
            .andWhere('version = :version', { version })
            .getMany()
    },

    getEnvInfo (projectId, env) {
        return getRepository(ReleaseVersion).createQueryBuilder('release_version')
            .where('projectId = :projectId', { projectId })
            .andWhere('deleteFlag = 0')
            .andWhere('env = :env', { env })
            .andWhere('status = "successful"')
            .orderBy('id', 'DESC')
            .limit('1')
            .getMany()
    },

    // eslint-disable-next-line @typescript-eslint/quotes
    getLatestInfo (projectId, env = `'prod', 'stag'`, isOffline = '0, 1') {
        return getRepository(ReleaseVersion).createQueryBuilder('release_version')
            .where('projectId = :projectId', { projectId })
            .andWhere('deleteFlag = 0')
            .andWhere(`env in (${env})`)
            .andWhere(`isOffline in (${isOffline})`)
            .orderBy('id', 'DESC')
            .limit('1')
            .getMany()
    },

    // 创建页面
    createVersion (versionData) {
        const version = getRepository(ReleaseVersion).create(versionData)
        const res = getRepository(ReleaseVersion).save(version)
        return res
    },

    async createVersionFromHistory (versionData) {
        const version = versionData.version
        const projectId = versionData.projectId
        const preVersion = await this.findOne({ version, projectId, status: 'success' })
        const newVersionData = {
            ...versionData,
            codeUrl: preVersion.codeUrl || ''
        }
        const newVersion = getRepository(ReleaseVersion).create(newVersionData)
        const res = getRepository(ReleaseVersion).save(newVersion)
        return res
    },

    async insertFromPreVersion (condition = {}, params = {}) {
        console.log(condition, params)
        const preVersion = await this.findOne(condition)
        const newVersionData = {
            ...preVersion,
            ...params
        }
        const newVersion = getRepository(ReleaseVersion).create(newVersionData)
        const res = getRepository(ReleaseVersion).save(newVersion)
        console.log(newVersionData, 333, res, 887)
        return res
    },

    async findOne (params) {
        const res = await getRepository(ReleaseVersion).find({
            where: {
                ...params,
                deleteFlag: 0
            }
        })
        if (res && res.length > 0) {
            return res[0]
        }
        return {}
    },

    async updateVersion (id, data = {}) {
        return getRepository(ReleaseVersion).update(id, data)
    }
}
