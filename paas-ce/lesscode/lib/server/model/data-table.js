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

import { getRepository } from 'typeorm'
import DataTable from './entities/data-table'

const dataTable = {
    getList (projectId) {
        const dataTableRepository = getRepository(DataTable)
        return dataTableRepository.find({ deleteFlag: 0, projectId }) || []
    },

    bulkAdd (tableList) {
        const dataTableRepository = getRepository(DataTable)
        const newTableList = dataTableRepository.create(tableList)
        return dataTableRepository.save(newTableList)
    },

    add (table) {
        const dataTableRepository = getRepository(DataTable)
        const newTableData = dataTableRepository.create(table)
        return dataTableRepository.save(newTableData)
    },

    async update (table) {
        const dataTableRepository = getRepository(DataTable)
        const editTable = await dataTableRepository.findOne({ where: { id: table.id } })
        Object.assign(editTable, table)
        return dataTableRepository.save(editTable)
    },

    async delete (id) {
        const dataTableRepository = getRepository(DataTable)
        const deleteTable = await dataTableRepository.findOne({ where: { id } })
        deleteTable.deleteFlag = 1
        return dataTableRepository.save(deleteTable)
    }
}

module.exports = dataTable
