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
const { getRepository, getConnection, getManager } = require('typeorm')
const Test = require('./entities/test')

// 数据库测试示例，项目开始后会删除
module.exports = {
    findProjectByName () {
        const projectRepository = getRepository(Test)
        return projectRepository.find({
            select: ['projectName'],
            where: {
                projectName: 'TestProject'
            },
            order: {
                id: 'DESC'
            },
            skip: 0,
            take: 10
        })
    },

    createTestData () {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into(Test)
            .values([
                { projectName: 'TestProject', projectEnglish: 'projectEnglish' }
            ])
            .execute()
    },

    async updateDataByName () {
        const entityManager = getManager()
        const testData = await entityManager.findOne(Test, 1)
        testData.projectName = 'firstTest'
        await entityManager.save(user)
    }
}
