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
import { diffDatas } from '../common'
import { DATA_MODIFY_TYPE } from '../../constant'

function filterSql () {

}

function transformSql2Json () {

}

/**
 * 对比修改前后的数据列表，返回sql字符串
 * data 数据结构：{ tableName: '', list: [] }
 * @param {*} originDatas 原始数据
 * @param {*} finalDatas 修改后的数据
 * @returns sql字符串
 */
function transformJson2Sql (originDatas, finalDatas) {
    const sqlArr = []
    const diffResult = diffDatas(originDatas, finalDatas)
    diffResult.forEach(({ type, data, tableName }) => {
        const tableKeys = Object.keys(data)
        const tableValues = Object.values(data)
        const updateValues = tableKeys.reduce((acc, cur) => {
            acc.push(`\`${cur}\`='${data[cur]}'`)
            return acc
        }, [])
        switch (type) {
            case DATA_MODIFY_TYPE.INSERT:
                sqlArr.push(`INSERT INTO \`${tableName}\`(\`${tableKeys.join('\`,\`')}\`) VALUES('${tableValues.join('\',\'')}');`)
                break
            case DATA_MODIFY_TYPE.UPDATE:
                sqlArr.push(`UPDATE \`${tableName}\` SET ${updateValues.join(',')} WHERE \`id\` = ${data.id};`)
                break
            case DATA_MODIFY_TYPE.DELETE:
                sqlArr.push(`DELETE FROM \`${tableName}\` WHERE \`id\` = ${data.id};`)
                break
        }
    })
    return sqlArr.join('\n')
}

/**
 * sql 操作
 */
export class DataSqlParser {
    constructor (sql) {
        this.sql = sql
    }

    import (that = {}) {
        const sql = filterSql(this.sql)
        that.finalDatas = transformSql2Json(sql)
        return that
    }

    export (that) {
        return transformJson2Sql(that.originDatas, that.finalDatas)
    }
}
