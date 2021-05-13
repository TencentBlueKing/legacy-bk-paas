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

import OperateLog from './entities/operate-log'

module.exports = {
    add (data) {
        const operateLog = getRepository(OperateLog).create(data)
        return getRepository(OperateLog).save(operateLog)
    },

    getAll (params, andWhere = '', page = { skip: 0, take: 10 }) {
        return getRepository(OperateLog)
            .createQueryBuilder()
            .where('(projectId = :projectId OR (projectId IS NULL AND operateUserId = :operateUserId))')
            .andWhere(andWhere)
            .andWhere('deleteFlag = :deleteFlag', { deleteFlag: 0 })
            .orderBy('id', 'DESC')
            .setParameters(params)
            .skip(page.skip)
            .take(page.take)
            .getManyAndCount()
    }
}
