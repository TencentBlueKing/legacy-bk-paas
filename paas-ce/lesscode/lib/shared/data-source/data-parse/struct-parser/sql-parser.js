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
import {
    TABLE_MODIFY_TYPE,
    FIELD_MODIFY_TYPE,
    INDEX_MODIFY_TYPE
} from '../../constant'

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
 * @returns 字段信息的 sql 字符串
 */
function getTableColumnSql (column) {
    // 获取字段名称
    const getName = (column) => {
        return `\`${column.name}\``
    }
    // 获取字段类型
    const getType = (column) => {
        const length = column.length || 0
        const scale = column.scale || 0
        const typeMap = {
            int: `int(${length})`,
            varchar: `varchar(${length}) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
            datetime: `datetime(${length})`,
            text: 'text',
            decimal: `decimal(${length}, ${scale})`
        }
        return typeMap[column.type]
    }
    // 非空
    const getNullable = (column) => {
        return column.nullable ? 'NULL' : 'NOT NULL'
    }
    // 自增
    const getGenerated = (column) => {
        return column.generated ? 'AUTO_INCREMENT' : ''
    }
    // 默认值
    const getDefault = (column) => {
        if (column.generated || column.type === 'text') return ''

        if (column.createDate) return 'DEFAULT CURRENT_TIMESTAMP(0)'

        if (column.updateDate) return 'DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)'

        if (Reflect.has(column, 'default')) {
            const defaultVal = column.default
            return typeof defaultVal === 'string' ? `DEFAULT '${defaultVal}'` : `DEFAULT ${defaultVal}`
        }
    }
    // 注释
    const getComment = (column) => {
        return column.comment ? `COMMENT '${column.comment}'` : ''
    }
    const sqlArray = [
        getName(column),
        getType(column),
        getNullable(column),
        getGenerated(column),
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
function getPrimaryKey (data) {
    if (data.primary) {
        return `PRIMARY KEY (\`${data.name}\`) USING BTREE`
    }
}

/**
 * 生成索引相关 sql
 * @param {*} columns 所有的字段
 * @returns 索引相关 sql
 */
function getIndex ({ type, data }) {
    if (type === INDEX_MODIFY_TYPE.DROP) {
        return `INDEX \`${data.name}\``
    }
    if (type === INDEX_MODIFY_TYPE.ADD) {
        return `INDEX \`${data.name}\`(\`${data.name}\`) USING BTREE`
    }
}

/**
 * 生成创建表的sql
 * @param {*} data
 * @returns sql字符串
 */
function createTable (data, index) {
    const { tableName, comment = '', columns } = data
    const fields = ([
        ...columns.map(getTableColumnSql),
        ...columns.map(getPrimaryKey),
        ...index.map(getIndex)
    ]).filter(v => v).map(x => `    ${x}`)

    return (
        '-- ----------------------------\n'
        + `-- TABLE STRUCTURE FOR ${tableName}\n`
        + '-- ----------------------------\n'
        + `DROP TABLE IF EXISTS \`${tableName}\`;\n`
        + `CREATE TABLE \`${tableName}\`  (\n`
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
function modifyTable (data, index = []) {
    const { tableName, columns = [] } = data
    const sqlArr = []

    columns.forEach(({ type, data }) => {
        const columnDetailSql = getTableColumnSql(data)
        if (type === FIELD_MODIFY_TYPE.DROP_COLUMN) {
            sqlArr.push(`${type} \`${data.name}\``)
        } else {
            sqlArr.push(`${type} ${columnDetailSql}`)
        }
    })
    index.forEach((data) => {
        const indexDetailSql = getIndex(data)
        sqlArr.push(`${data.type} ${indexDetailSql}`)
    })

    return (
        '-- ----------------------------\n'
        + `-- MODIFY TABLE ${tableName}\n`
        + '-- ----------------------------\n'
        + `ALTER TABLE \`${tableName}\`\n`
        + sqlArr.join(',\n')
        + ';'
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
        + `DROP TABLE IF EXISTS \`${data.tableName}\`;\n`
    )
}

/**
 * 生成修改表名的sql
 * @param {*} data 修改后的数据
 * @param {*} originData 原始数据
 * @returns
 */
function renameTable (data, originData) {
    return (
        '-- ----------------------------\n'
        + `-- RENAME TABLE ${originData.tableName}\n`
        + '-- ----------------------------\n'
        + `ALTER TABLE \`${originData.tableName}\` RENAME TO \`${data.tableName}\`;\n`
    )
}

/**
 * 生成修改注释的sql
 * @param {*} data 修改后的数据
 * @returns 修改注释的sql
 */
function comment (data) {
    return (
        '-- ----------------------------\n'
        + `-- MODIFY COMMENT ${data.tableName}\n`
        + '-- ----------------------------\n'
        + `ALTER TABLE \`${data.tableName}\` COMMENT = '${data.comment}';\n`
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

    diffResults.forEach(({ type, data, originData, index }) => {
        let sql
        switch (type) {
            case TABLE_MODIFY_TYPE.CREATE:
                sql = createTable(data, index)
                break
            case TABLE_MODIFY_TYPE.MODIFY:
                sql = modifyTable(data, index)
                break
            case TABLE_MODIFY_TYPE.DROP:
                sql = dropTable(data)
                break
            case TABLE_MODIFY_TYPE.RENAME:
                sql = renameTable(data, originData)
                break
            case TABLE_MODIFY_TYPE.COMMENT:
                sql = comment(data)
                break
        }
        sqlArray.push(sql)
    })

    return sqlArray.join('\n')
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
        return that
    }

    export (that) {
        return transformJson2Sql(that)
    }
}
