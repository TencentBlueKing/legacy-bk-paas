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
import PageTemplateCategory from './entities/page-template-category'

export const all = async function (params = {}) {
    const res = await getRepository(PageTemplateCategory).find({
        where: {
            ...params,
            deleteFlag: 0
        },
        order: {
            order: 'ASC',
            createTime: 'ASC'
        }
    })
    return res
}

export const getOne = async function (params = {}) {
    const res = await getRepository(PageTemplateCategory).find({
        where: params
    })
    console.log(res, 'res')
    if (res && res.length > 0) {
        return res[0]
    }
    return ''
}

export const updateById = async function (id, params = {}) {
    const category = await getOne({
        id
    })
    if (!category) {
        throw new Error('分类不存在')
    }
    Object.keys(params).forEach(field => {
        category[field] = params[field]
    })
    const res = await getRepository(PageTemplateCategory).save(category)
    return res
}

export const removeById = async function (id) {
    try {
        const category = await getOne({
            id
        })
        if (!category) {
            throw new Error('分类不存在')
        }
        category.deleteFlag = 1
        const res = await getRepository(PageTemplateCategory).save(category)
        return res
    } catch (error) {
        throw error
    }
}
