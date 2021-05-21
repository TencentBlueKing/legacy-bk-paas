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

import { getRepository, In } from 'typeorm'
import Project from './entities/project'
import Comp from './entities/comp'
import CompCategory from './entities/comp-category'
import Version from './entities/version'

export const all = async function (params = {}) {
    const res = await getRepository(Comp)
        .createQueryBuilder('comp')
        .leftJoin(CompCategory, 'compCategory', 'comp.categoryId = compCategory.id')
        .leftJoin(Version, 'version', 'comp.id = version.componentId')
        .select('comp.*')
        .addSelect('compCategory.id', 'categoryId')
        .addSelect('compCategory.name', 'category')
        .addSelect('compCategory.order', 'categoryOrder')
        .addSelect('version.componentDest', 'dest')
        .addSelect('version.id', 'versionId')
        .addSelect('version.version', 'version')
        .addSelect('version.versionLog', 'versionLog')
        .addSelect('version.description', 'description')
        .where({
            ...params
        })
        .orderBy('comp.createTime')
        .andWhere('comp.deleteFlag = 0')
        .andWhere('version.isLast = 1')
        .getRawMany()
    return res
}

export const getDataByVersion = async function (params) {
    const res = await getRepository(Comp)
        .createQueryBuilder('comp')
        .leftJoin(CompCategory, 'compCategory', 'comp.categoryId = compCategory.id')
        .leftJoin(Version, 'version', 'comp.id = version.componentId')
        .leftJoin(Project, 'project', 'comp.belongProjectId = project.id')
        .select('comp.*')
        .addSelect('compCategory.id', 'categoryId')
        .addSelect('compCategory.name', 'category')
        .addSelect('compCategory.order', 'categoryOrder')
        .addSelect('version.componentDest', 'dest')
        .addSelect('version.id', 'versionId')
        .addSelect('version.version', 'version')
        .addSelect('version.versionLog', 'versionLog')
        .addSelect('version.description', 'description')
        .addSelect('project.projectName', 'projectName')
        .where('version.id IN (:...ids)', { ids: params })
        .orderBy('comp.createTime')
        .andWhere('comp.deleteFlag = 0')
        .getRawMany()
    return res
}

export const getDataByCompIds = async function (params) {
    const res = await getRepository(Comp)
        .createQueryBuilder('comp')
        .leftJoin(CompCategory, 'compCategory', 'comp.categoryId = compCategory.id')
        .leftJoin(Version, 'version', 'comp.id = version.componentId')
        .select('comp.*')
        .addSelect('compCategory.id', 'categoryId')
        .addSelect('compCategory.name', 'category')
        .addSelect('compCategory.order', 'categoryOrder')
        .addSelect('version.componentDest', 'dest')
        .addSelect('version.id', 'versionId')
        .addSelect('version.version', 'version')
        .addSelect('version.versionLog', 'versionLog')
        .addSelect('version.description', 'description')
        .where('comp.id IN (:...ids)', { ids: params })
        .andWhere('comp.deleteFlag = 0')
        .orderBy('comp.createTime')
        .andWhere('version.isLast = 1')
        .getRawMany()
    return res
}

export const getPublicByIds = async function (ids) {
    const res = await getRepository(Comp).find({
        select: ['id', 'isPublic'],
        where: {
            id: In(ids),
            isPublic: 1
        }
    })
    return res
}

export const getAll = async function () {
    const res = await getRepository(Comp).find()
    return res
}

export const findById = async function (id) {
    const res = await getRepository(Comp).findOne(id)
    return res
}
export const getOne = async function (params = {}) {
    const res = await getRepository(Comp).find({
        where: params
    })
    if (res && res.length > 0) {
        return res[0]
    }
    return ''
}

export const updateById = async function (id, params = {}) {
    const comp = await getOne({
        id
    })
    if (!comp) {
        throw new Error('组件不存在')
    }
    Object.keys(params).forEach(field => {
        comp[field] = params[field]
    })
    const res = await getRepository(Comp).save(comp)
    return res
}

export const remove = async function (id) {
    try {
        const comp = await getOne({
            id
        })
        if (!comp) {
            throw new Error('组件不存在')
        }
        comp.deleteFlag = 1
        const res = await getRepository(Comp).save(comp)
        return res
    } catch (error) {
        throw error
    }
}

export const count = async function () {
    const res = await getRepository(Comp)
        .createQueryBuilder()
        .select('categoryId')
        .addSelect('COUNT(id)', 'count')
        .where({
            status: 0
        })
        .groupBy('categoryId')
        .getRawMany()
    return res
}

export const getNameMap = async function () {
    const all = await getAll()
    const data = all.reduce((result, item) => {
        result[item.type] = true
        return result
    }, {})
    return data
}
