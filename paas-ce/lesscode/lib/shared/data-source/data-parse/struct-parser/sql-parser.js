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
 * 获取字段的sql信息
 * @param {*} column 当前行
 * @param {*} lastColumn 上一行，用于生成 AFTER
 * @returns 字段信息的 sql 字符串
 */
function getTableColumnSql (column, lastColumn) {
    const typeMap = {
        int: 'int(11)',
        varchar: 'varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci',
        datetime: 'datetime(0)'
    }
    const getNullable = (column) => {
        return column.nullable ? 'NULL' : 'NOT NULL'
    }
    const generatedMap = {
        true: 'AUTO_INCREMENT',
        false: ''
    }
    const getDefault = (column) => {
        let defaultStr
        if (column.createDate) defaultStr = 'DEFAULT CURRENT_TIMESTAMP(0)'

        if (column.updateDate) defaultStr = 'DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)'

        if (Reflect.has(column, 'default')) {
            const defaultVal = column.default
            defaultStr = typeof defaultVal === 'string' ? `DEFAULT '${defaultVal}'` : `DEFAULT ${defaultVal}`
        }
        return defaultStr
    }
    const getComment = (column) => {
        return column.comment ? `COMMENT '${column.comment}'` : ''
    }
    const sqlArray = [
        column.name,
        typeMap[column.type],
        getNullable(column),
        generatedMap[column.generated],
        getDefault(column),
        getComment(column)
    ]
    return sqlArray.filter(v => v).join(' ')
}

/**
 * 生成主键相关 sql
 * @param {*} columns 所有的字段
 * @returns 主键相关 sql
 */
function getPrimaryKey (columns) {
    let primaryKeyStr = ''
    const primaryColumns = columns.filter(column => column.primary).map(x => x.name)
    if (primaryColumns.length) {
        primaryKeyStr = `PRIMARY KEY (${primaryColumns.join(',')}) USING BTREE`
    }
    return primaryKeyStr
}

/**
 * 生成索引相关 sql
 * @param {*} columns 所有的字段
 * @returns 索引相关 sql
 */
function getIndex (columns) {
    const indexColumns = columns.filter(column => column.index)
    return indexColumns.map((indexColumn) => {
        return `INDEX ${indexColumn.name}(${indexColumn.name}) USING BTREE`
    })
}

/**
 * 生成创建表的sql
 * @param {*} data
 * @returns sql字符串
 */
function createTable (data) {
    const { tableName, comment = '', columns } = data
    const fields = ([
        ...columns.map(getTableColumnSql),
        getPrimaryKey(columns),
        ...getIndex(columns)
    ]).map(x => `    ${x}`)
    return (
        '-- ----------------------------\n'
        + `-- Table structure for ${tableName}\n`
        + '-- ----------------------------\n'
        + `DROP TABLE IF EXISTS ${tableName};\n`
        + `CREATE TABLE ${tableName}  (\n`
        + fields.join(',\n')
        + '\n'
        + `) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = \'${comment}\' ROW_FORMAT = Dynamic;\n`
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
        + `DROP TABLE IF EXISTS ${data.tableName};\n`
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

    diffResults.forEach(({ type, data }) => {
        let sql
        switch (type) {
            case 'create':
                sql = createTable(data)
                break
            case 'modify':
                sql = modifyTable(data)
                break
            case 'drop':
                sql = dropTable(data)
                break
        }
        sqlArray.push(sql)
    })

    return sqlArray.join('')
}

/**
 * sql 操作
 */
export class StructSqlParser {
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
