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

const Sequelize = require('sequelize')
const config = require('../conf/database')

// 根据配置实例化数据库
const DB = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

/**
 * 定义数据模型
 *
 * @param {string} name 模型名称（数据库表名）
 * @param {object} attributes 表属性集合
 *
 * @return 数据模型对象
 */
function defineModel (name, attributes) {
    const attrs = {}

    // 统一初始化属性不能为空
    for (const key in attributes) {
        const field = attributes[key]
        if (typeof field === 'object' && field['type']) {
            field.allowNull = field.allowNull || false
            attrs[key] = field
        } else {
            attrs[key] = {
                type: field,
                allowNull: false
            }
        }
    }

    // 定义表
    const dataTable = DB.define(name, attributes, {
        tableName: name,
        timestamps: true, // 统一初始化公共字段create_time、update_time
        hooks: {
            beforeValidate: function (obj) {
                const now = Date.now()
                if (obj.isNewRecord) {
                    obj.create_time = now
                    obj.update_time = now
                } else {
                    obj.update_time = now
                }
            }
        }
    })

    // 同步表结构，不删除数据
    dataTable.sync({ alter: true })
    // 同步表结构到数据库, force: true, 先强制同步
    DB.sync({ force: false })
    // DB.sync()

    return dataTable
}

module.exports = {
    defineModel: defineModel
}
