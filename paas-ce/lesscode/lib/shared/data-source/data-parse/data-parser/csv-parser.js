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

function filterCsv () {

}

function transformCsv2Json () {

}

function transformJson2Csv (finalDatas) {
    return finalDatas.map(({ tableName, list }) => {
        const contentArr = []
        // 生成表头
        const columnHeader = Object.keys(list[0])
        contentArr.push(columnHeader.join(','))
        // 生成内容
        list.forEach((data) => {
            const dataValues = columnHeader.map((key) => {
                return (Reflect.has(data, key) ? data[key] : '') + '\t'
            })
            contentArr.push(dataValues.join(','))
        })
        const content = '\uFEFF' + contentArr.join('\r\n')
        return { tableName, content }
    })
}

/**
 * csv 操作
 */
export class DataCsvParser {
    constructor (csv) {
        this.csv = csv
    }

    import (that = {}) {
        const csv = filterCsv(this.csv)
        that.finalDatas = transformCsv2Json(csv)
        return csv
    }

    export (that) {
        return transformJson2Csv(that.finalDatas)
    }
}
