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

/**
 * 操作线上环境数据库服务
 */
export default class OnlineService {
    constructor (dbEngine) {
        this.dbEngine = dbEngine
    }

    // 展示有哪些表
    async showTables () {
        const tables = await this.dbEngine.execSql('show tables;')
        const tableList = []
        for (let index = 0, l = tables.length; index < l; index++) {
            const table = tables[index]
            tableList.push(...Object.values(table))
        }
        return tableList
    }

    // 展示表详情
    async describeTables (tableNames) {
        const nameSqlFilter = tableNames.join('\',\'')
        const columnSql = `
            SELECT * FROM INFORMATION_SCHEMA.TABLES t
            LEFT JOIN INFORMATION_SCHEMA.COLUMNS c
            ON t.TABLE_NAME = c.TABLE_NAME
            WHERE t.TABLE_NAME IN ('${nameSqlFilter}')
            ORDER BY t.CREATE_TIME DESC, c.ORDINAL_POSITION ASC;
        `
        const indexSql = `
            SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME IN ('${nameSqlFilter}');
        `
        const columnsList = await this.dbEngine.execSql(columnSql)
        const indexList = await this.dbEngine.execSql(indexSql)
        const tableList = columnsList.reduce((acc, cur) => {
            const {
                TABLE_NAME,
                TABLE_COMMENT,
                ENGINE,
                TABLE_COLLATION,
                COLUMN_NAME,
                COLUMN_TYPE,
                COLUMN_DEFAULT,
                COLUMN_COMMENT,
                IS_NULLABLE
            } = cur

            const normalizeColumnType = (type) => {
                const typeMap = {
                    'int(11)': 'int',
                    'varchar(255)': 'varchar'
                }
                return typeMap[type] || type
            }

            const normalizeColumnIndex = () => {
                return indexList.findIndex(x => x.TABLE_NAME === TABLE_NAME && x.COLUMN_NAME === COLUMN_NAME) > -1
            }

            const column = {
                name: COLUMN_NAME,
                type: normalizeColumnType(COLUMN_TYPE),
                index: normalizeColumnIndex(),
                nullable: IS_NULLABLE !== 'NO',
                default: COLUMN_DEFAULT,
                comment: COLUMN_COMMENT
            }

            const table = {
                tableName: TABLE_NAME,
                engine: ENGINE,
                character: TABLE_COLLATION,
                comment: TABLE_COMMENT,
                columns: []
            }

            const curTable = acc.find(x => x.tableName === TABLE_NAME) || (acc.push(table), table)
            curTable.columns.push(column)
            return acc
        }, [])
        return tableList
    }

    // 获取表数据
    async getTableData (tableName, page, pageSize) {
        const [list, foundRows = []] = await this.dbEngine.execMultSql(`
            SELECT SQL_CALC_FOUND_ROWS * FROM  ${tableName} ORDER BY id DESC LIMIT ${(page - 1) * pageSize},${pageSize};
            SELECT FOUND_ROWS();
        `)
        const rows = foundRows[0] || {}
        const count = Object.values(rows)[0] || 0
        return { list, count }
    }
}
