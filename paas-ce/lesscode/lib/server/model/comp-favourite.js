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
import CompFavourite from './entities/comp-favourite'

export const all = async function (params = {}) {
    const res = await getRepository(CompFavourite)
        .createQueryBuilder()
        .select('compId')
        .where(params)
        .getRawMany()
    return res
}

export const create = async function (params = {}) {
    const compFavouriteRepository = getRepository(CompFavourite)
    const compFavourite = await compFavouriteRepository.create(params)
    const res = await compFavouriteRepository.save(compFavourite)
    return res
}

export const remove = async function (params = {}) {
    await getRepository(CompFavourite).delete(params)
}
