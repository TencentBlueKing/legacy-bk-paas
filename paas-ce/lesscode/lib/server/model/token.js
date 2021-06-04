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
import token from './entities/token'
import project from './entities/project'
import { RequestContext } from '../middleware/request-context'

module.exports = {
    async getTokenByUserName (id) {
        const currentUser = RequestContext.getCurrentUser() || {}
        const updateUser = currentUser.username
        const projectRepository = getRepository(project)
        const curProject = await projectRepository.findOne({ id }) || {}
        const appCode = curProject.appCode || ''
        const ret = await getRepository(token).find({ updateUser, appCode })
        return ret
    },

    // 创建 token
    async setToken (data) {
        const repository = getRepository(token)
        const tokenRecord = repository.create(data)
        const ret = await repository.save(tokenRecord)
        return ret
    },

    // 更新 token
    async updateToken (data) {
        const repository = getRepository(token)
        const oldToken = await repository.findOne({ id: data.id })
        Object.assign(oldToken, data)
        const ret = await repository.save(oldToken)
        return ret
    }
}
