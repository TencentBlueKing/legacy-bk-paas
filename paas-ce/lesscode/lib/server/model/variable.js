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

import { getRepository, In } from 'typeorm'
import Variable from './entities/variable'
import PageVariable from './entities/page-variable'
import FuncVariable from './entities/func-variable'
import VariableVariable from './entities/variable-variable'
import { whereVersionLiteral } from './common'

module.exports = {
    async getAll ({ projectId, versionId, pageCode, effectiveRange }) {
        const where = [{ projectId, versionId: whereVersionLiteral(versionId), deleteFlag: 0 }]
        if (effectiveRange !== undefined) {
            where[0].effectiveRange = effectiveRange
        }
        if (pageCode) {
            where.push({ projectId, effectiveRange: 1, pageCode, deleteFlag: 0, versionId: whereVersionLiteral(versionId) })
        }
        const variableList = await getRepository(Variable).find({ where, order: { updateTime: 'DESC' } }) || []
        const variableIds = variableList.map((variable) => (variable.id))
        const usedVariableData = []
        if (variableIds.length) {
            const where = { variableId: In(variableIds), deleteFlag: 0, projectId, versionId: whereVersionLiteral(versionId) }
            const [usedInPage, usedInFunc, usedInVar] = await Promise.all([
                getRepository(PageVariable).find({ where }),
                getRepository(FuncVariable).find({ where }),
                getRepository(VariableVariable).find({ where })
            ])
            usedVariableData.push(...usedInPage)
            usedInFunc.forEach((data) => usedVariableData.push({ type: 'func', variableId: data.variableId, funcCode: data.funcCode }))
            usedInVar.forEach((data) => usedVariableData.push({ type: 'var', variableId: data.variableId, parentVariableId: data.parentVariableId }))
        }

        variableList.forEach((variable) => {
            variable.defaultValue = JSON.parse(variable.defaultValue || '{}')
            variable.useInfo = usedVariableData
                .filter((usedVariable) => (usedVariable.variableId === variable.id))
                .map(x => ({ pageCode: x.pageCode, useInfo: JSON.parse(x.useInfo || '[]'), funcCode: x.funcCode, type: x.type, parentVariableId: x.parentVariableId }))
        })
        return variableList
    },

    async addVariable (data) {
        const variableRepository = getRepository(Variable)
        data.defaultValue = JSON.stringify(data.defaultValue || {})
        const newVar = variableRepository.create(data)
        const res = await variableRepository.save(newVar)
        return res
    },

    async editVariable (data) {
        const variableRepository = getRepository(Variable)
        const oldVariable = await variableRepository.findOne({ id: data.id })
        data.defaultValue = JSON.stringify(data.defaultValue || {})
        Object.assign(oldVariable, data)
        const res = await variableRepository.save(oldVariable)
        return res
    },

    async deleteVariable (id) {
        const variableRepository = getRepository(Variable)
        const deleteVariable = await variableRepository.findOne({ where: { id } })
        deleteVariable.deleteFlag = 1
        // eslint-disable-next-line no-return-await
        return await variableRepository.save(deleteVariable)
    },

    async findById (id) {
        const res = await getRepository(Variable).findOne(id)
        return res
    }
}
