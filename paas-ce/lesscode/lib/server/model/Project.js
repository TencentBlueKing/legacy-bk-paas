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

module.exports = (sequelize, Types) => {
    const Project = sequelize.define('Project', {
        name: {
            type: Types.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: Types.STRING
        },
        status: {
            type: Types.ENUM,
            values: ['0', '1'],
            defaultValue: '0',
            description: '0启用， 1删除'
        },
        createBy: Types.STRING,
        updateBy: Types.STRING
    })

    Project.association = models => {
        models.Project.hasMany(models.ProjectConfig)
    }

    return Project
}
