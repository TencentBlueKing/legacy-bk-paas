/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { diff } from '../common'

/**
 * 对导入的sql过滤
 * 过滤掉没有权限执行的sql和业务不相干的sql
 * 校验sql：新增table必须有 id、deleteFlag、createTime、updateTime、createUser、updateUser
 * @param {*} sql 导入的 sql 字符串
 * @returns 过滤后的 sql
 */
function filterSql (sql) {
    let filteredSql = ''
    filteredSql = sql
    return filteredSql
}

function transformSql2Json () {

}

/**
 * 生成创建表的sql
 * @param {*} data
 * @returns sql字符串
 */
function createTable (data) {
    return (
        '-- ----------------------------\n'
        + `-- Table structure for ${data.tableName}\n`
        + '-- ----------------------------\n'
        + `DROP TABLE IF EXISTS ${data.tableName};\n`
        + `CREATE TABLE ${data.tableName}  (\n`
            + '`id` int(11) NOT NULL AUTO_INCREMENT,\n'
            // + columns.
            + '`deleteFlag` int(11) NULL DEFAULT 0 COMMENT \'是否删除，1代表已删除\',\n'
            + '`createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT \'创建时间\',\n'
            + '`updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT \'最新更新时间\',\n'
            + '`createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT \'创建人，默认当前用户\',\n'
            + '`updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT \'更新人，默认当前用户\',\n'
            + 'PRIMARY KEY (`id`) USING BTREE\n'
        + `) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = \'${data.comment}\' ROW_FORMAT = Dynamic;\n`
    )
}

/**
 * 生成修改表的sql
 * @param {*} data
 * @returns sql字符串
 */
function modifyTable (data) {
    return (
        '-- ----------------------------\n'
        + `-- Modify Table ${data.tableName}\n`
        + '-- ----------------------------\n'
        + `ALTER TABLE ${data.tableName}\n`
    )
}

/**
 * 生成删除表的sql
 * @param {*} data
 * @returns sql字符串
 */
function dropTable (data) {
    return (
        '-- ----------------------------\n'
        + `-- DROP TABLE ${data.tableName}\n`
        + '-- ----------------------------\n'
        + `DROP TABLE IF EXISTS ${data.tableName};`
    )
}

/**
 * 通过对比，算出变化需要执行的sql
 * @param { originDatas, finalDatas } 导入前后的数据
 * @returns sql字符串
 */
function transformJson2Sql ({ originDatas, finalDatas }) {
    const diffResults = diff(originDatas, finalDatas)
    const sqlArray = []

    diffResults.forEach((result) => {
        let sql
        switch (result.type) {
            case 'create':
                sql = createTable(result)
                break
            case 'modify':
                sql = modifyTable(result)
                break
            case 'drop':
                sql = dropTable(result)
                break
        }
        sqlArray.join(sql)
    })

    return sqlArray.join('')
}

/**
 * sql 操作
 */
export class SqlParser {
    constructor (sql) {
        this.sql = sql
    }

    import (that = {}) {
        const sql = filterSql(this.sql)
        that.finalDatas = transformSql2Json(sql)
        return sql
    }

    export (that) {
        return transformJson2Sql(that)
    }
}
