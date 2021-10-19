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

/**
 * 对表的列进行对比
 * @param {*} originColumns 修改前的字段
 * @param {*} finalColumns 修改后的字段
 */
function diffColumns (originColumns, finalColumns) {
    const modifyColumns = []
    for (let index = 0; index < finalColumns.length; index++) {
        const finalColumn = finalColumns[index]
        const originColumn = originColumns[index]
        // 如果不一样，表示该行有修改或者是新增行
        if (JSON.stringify(finalColumn) !== JSON.stringify(originColumn)) {
            const sameColumn = originColumns.find(originColumn => originColumn.columnId === finalColumn.columnId)
            if (sameColumn) {
                const type = sameColumn.name === finalColumn.name ? 'modify' : 'modify-name'
                modifyColumns.push({ type, data: finalColumn, originData: sameColumn })
            } else {
                modifyColumns.push({ type: 'create', data: finalColumn })
            }
        }
    }
    // 删除的行
    originColumns.forEach((originColumn) => {
        const isDrop = finalColumns.findIndex((finalColumn) => finalColumn.columnId === originColumn.columnId) < 0
        if (isDrop) modifyColumns.push({ type: 'drop', data: originColumn })
    })
    return modifyColumns
}

/**
 * 对比导入前后的数据，得到导入后影响的数据
 * @param {*} originDatas 导入前的数据
 * @param {*} finalDatas 导入后的数据
 */
export const diff = (originDatas, finalDatas) => {
    const result = []
    for (let index = 0; index < finalDatas.length; index++) {
        const finalData = finalDatas[index]
        const originData = originDatas.find((originData) => (originData.tableName === finalData.tableName))
        if (originData) {
            const modifyColumns = diffColumns(originData.columns, finalData.columns)
            if (modifyColumns.length) {
                const data = {
                    ...finalData,
                    columns: modifyColumns
                }
                result.push({ type: 'modify', data })
            }
        } else {
            result.push({ type: 'create', data: finalData })
        }
    }
    // 删除的表
    originDatas.forEach((originData) => {
        const isDrop = finalDatas.findIndex((finalData) => finalData.tableName === originData.tableName) < 0
        if (isDrop) result.push({ type: 'drop', data: originData })
    })
    return result
}
