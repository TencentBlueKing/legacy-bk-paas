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
import {
    ORM_KEYS,
    TABLE_MODIFY_TYPE,
    FIELD_MODIFY_TYPE,
    INDEX_MODIFY_TYPE,
    DATA_MODIFY_TYPE
} from '../constant'

/**
 * 对表的字段进行对比
 * @param {*} originColumns 修改前的字段
 * @param {*} finalColumns 修改后的字段
 */
function diffColumns (originColumns, finalColumns) {
    const modifyColumns = []
    for (let index = 0; index < finalColumns.length; index++) {
        const finalColumn = finalColumns[index]
        const sameColumnId = originColumns.find(originColumn => originColumn.columnId === finalColumn.columnId)
        const sameColumnName = originColumns.find(originColumn => originColumn.name === finalColumn.name)
        const originColumn = sameColumnId || sameColumnName || {}
        // 如果不一样，表示该行有修改或者是新增行
        if (ORM_KEYS.some(key => key !== 'index' && finalColumn[key] !== originColumn[key])) {
            if (originColumn.name) {
                const type = originColumn.name === finalColumn.name
                    ? FIELD_MODIFY_TYPE.MODIFY_COLUMN
                    : FIELD_MODIFY_TYPE.CHANGE_COLUMN(originColumn.name)
                modifyColumns.push({ type, data: finalColumn })
            } else {
                modifyColumns.push({ type: FIELD_MODIFY_TYPE.ADD_COLUMN, data: finalColumn })
            }
        }
    }
    // 删除的行
    originColumns.forEach((originColumn) => {
        const isDrop = finalColumns.findIndex((finalColumn) => (finalColumn.columnId === originColumn.columnId || finalColumn.name === originColumn.name)) < 0
        if (isDrop) modifyColumns.push({ type: FIELD_MODIFY_TYPE.DROP_COLUMN, data: originColumn })
    })
    return modifyColumns
}

/**
 * 对表的索引进行对比
 * @param {*} originColumns 修改前的字段
 * @param {*} finalColumns 修改后的字段
 */
function diffIndex (originColumns = [], finalColumns) {
    const getDifference = (a1, a2) => {
        return a1.filter((a) => (a.index && !a2.some(b => (b.index && a.name === b.name))))
    }
    const dropIndex = getDifference(originColumns, finalColumns).map(data => ({ type: INDEX_MODIFY_TYPE.DROP, data }))
    const addIndex = getDifference(finalColumns, originColumns).map(data => ({ type: INDEX_MODIFY_TYPE.ADD, data }))
    return [
        ...dropIndex,
        ...addIndex
    ]
}

/**
 * 对比导入前后的表结构，得到导入后影响的数据
 * @param {*} originDatas 导入前的数据
 * @param {*} finalDatas 导入后的数据
 */
export const diff = (originDatas, finalDatas) => {
    const result = []
    for (let index = 0; index < finalDatas.length; index++) {
        const finalData = finalDatas[index]
        const originData = originDatas.find((originData) => (finalData.id && originData.id === finalData.id)) || {}
        const indexData = diffIndex(originData.columns, finalData.columns)
        if (originData.tableName) {
            if (originData.tableName !== finalData.tableName) {
                result.push({ type: TABLE_MODIFY_TYPE.RENAME, data: finalData, originData })
            }

            if (originData.comment !== finalData.comment) {
                result.push({ type: TABLE_MODIFY_TYPE.COMMENT, data: finalData })
            }

            const modifyColumns = diffColumns(originData.columns, finalData.columns)
            if (modifyColumns.length || indexData.length) {
                const data = {
                    ...finalData,
                    columns: modifyColumns
                }
                result.push({ type: TABLE_MODIFY_TYPE.MODIFY, data, index: indexData })
            }
        } else {
            result.push({ type: TABLE_MODIFY_TYPE.CREATE, data: finalData, index: indexData })
        }
    }
    // 删除的表
    originDatas.forEach((originData) => {
        const isDrop = finalDatas.findIndex((finalData) => finalData.id === originData.id) < 0
        if (isDrop) result.push({ type: TABLE_MODIFY_TYPE.DROP, data: originData })
    })
    return result
}

/**
 * 对比导入前后的表数据，得到导入后影响的数据
 * @param {*} originTableDatas 导入前的数据
 * @param {*} finalTableDatas 导入后的数据
 */
export const diffDatas = (originTableDatas, finalTableDatas) => {
    const diffResult = []
    for (let index = 0, l = finalTableDatas.length; index < l; index++) {
        const finalTableData = finalTableDatas[index]
        const originTableData = originTableDatas.find((x) => x.tableName === finalTableData.tableName) || {}
        const finalDatas = finalTableData.list || []
        const originDatas = originTableData.list || []
        finalDatas.forEach((finalData) => {
            const originData = originDatas.find(x => x.id === finalData.id)
            if (originData) {
                const isSameData = JSON.stringify(originData) === JSON.stringify(finalData)
                if (!isSameData) {
                    diffResult.push({ type: DATA_MODIFY_TYPE.UPDATE, data: finalData, tableName: finalTableData.tableName })
                }
            } else {
                diffResult.push({ type: DATA_MODIFY_TYPE.INSERT, data: finalData, tableName: finalTableData.tableName })
            }
        })
        const dropDatas = originDatas.filter((a) => (!finalDatas.some(b => a.id === b.id)))
        dropDatas.forEach((dropData) => {
            diffResult.push({ type: DATA_MODIFY_TYPE.DELETE, data: dropData, tableName: originTableData.tableName })
        })
    }
    const dropTableDatas = originTableDatas.filter((a) => (!finalTableDatas.some(b => a.tableName === b.tableName)))
    dropTableDatas.forEach((dropTableData) => {
        const dropDatas = dropTableData.list || []
        dropDatas.forEach((dropData) => {
            diffResult.push({ type: DATA_MODIFY_TYPE.DELETE, data: dropData, tableName: dropTableData.tableName })
        })
    })
    return diffResult
}
