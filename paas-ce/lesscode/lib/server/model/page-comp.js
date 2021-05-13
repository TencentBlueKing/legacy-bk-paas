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
import PageComp from './entities/page-comp'
import Page from './entities/page'
import Comp from './entities/comp'
import Version from './entities/version'
const npmConf = require('../conf/npm')

export const getAll = async function (params) {
    const res = await getRepository(PageComp).find(
        {
            where: params
        }
    )
    return res
}

export const getPageAndVersion = async function (params) {
    const res = await getRepository(PageComp)
        .createQueryBuilder('pageComp')
        .leftJoin(Page, 'page', 'page.id = pageComp.pageId')
        .leftJoin(Version, 'version', 'version.id = pageComp.versionId')
        .select('pageComp.compId', 'compId')
        .addSelect('page.pageName', 'pageName')
        .addSelect('version.id', 'versionId')
        .addSelect('version.version', 'version')
        .addSelect('version.versionLog', 'versionLog')
        .addSelect('version.isLast', 'isLast')
        .where(params)
        .andWhere('page.deleteFlag = 0')
        .getRawMany()
    return res
}

export const update = async function (params, data) {
    return getRepository(PageComp).update(params, data)
}

export const getProjectComp = async function (projectId) {
    const res = await getRepository(PageComp)
        .createQueryBuilder('pageComp')
        .leftJoinAndSelect(Comp, 'c', 'pageComp.compId = c.id')
        .leftJoinAndSelect(Version, 'v', 'pageComp.versionId = v.id')
        .where('pageComp.projectId = :projectId', { projectId })
        .andWhere('c.deleteFlag = 0')
        .select(['v.version as version', 'c.type as type'])
        .distinct('pageComp.compId')
        .getRawMany()
    let data = []
    if (res.length) {
        const prefix = process.env.BKPAAS_ENVIRONMENT === 'prod' ? '' : 'test-'
        data = res.map(item => {
            let version = item.version
            version = version.substring(0, 1) === 'v' ? version.substring(1) : version
            return {
                name: `${npmConf.scopename}/${prefix}${item.type}`,
                version: version
            }
        })
    }
    return data
}
