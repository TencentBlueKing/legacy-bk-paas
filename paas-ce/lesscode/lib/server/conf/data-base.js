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
const path = require('path')

const config = process.env.NODE_ENV === 'production'
    ? {
        database: process.env.GCS_MYSQL_NAME,
        username: process.env.GCS_MYSQL_USER,
        password: process.env.GCS_MYSQL_PASSWORD,
        host: process.env.GCS_MYSQL_HOST,
        port: process.env.GCS_MYSQL_PORT,
        dialect: 'mysql'
    }
    : {
        database: 'vue_visualization',
        username: 'xxx',
        password: 'xxx',
        host: 'localhost',
        port: 3306,
        dialect: 'mysql'
    }

module.exports = {
    type: 'mysql',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: [path.resolve(__dirname, '..', 'model/entities/!(Base){.js,.ts}')],
    logging: true, // 开启所有数据库信息打印
    logger: 'advanced-console', // 高亮字体的打印信息
    synchronize: true, // 第一次部署开启
    migrationsRun: false, // 后续更改表结构使用 migration
    migrations: [path.resolve(__dirname, '..', 'model/migration/*.js')],
    extra: {
        connectionLimit:  5
    }
}
