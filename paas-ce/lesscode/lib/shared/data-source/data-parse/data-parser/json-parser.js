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
 * json 操作
 */
export class DataJsonParser {
    constructor (data) {
        const parsedData = JSON.parse(JSON.stringify(data || []))
        this.datas = Array.isArray(parsedData) ? parsedData : [parsedData]
    }

    import (that = {}) {
        this.datas.forEach((data) => {
            const sameTable = that.finalDatas.find((finalData) => (finalData.tableName === data.tableName))
            if (sameTable) {
                const importDataList = data.list || []
                const originDataList = sameTable.list || []
                importDataList.forEach((importData) => {
                    const originData = originDataList.find(x => x.id === importData.id)
                    if (originData) {
                        Object.assign(originData, importData)
                    } else {
                        originDataList.push(importData)
                    }
                })
            } else {
                that.finalDatas.push(data)
            }
        })
        return that
    }

    set (that = {}) {
        that.finalDatas = this.datas
        return that
    }

    export (that) {
        return that.finalDatas
    }
}
