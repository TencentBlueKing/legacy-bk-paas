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
import VariableFunc from './entities/variable-func'
import VariableVariable from './entities/variable-variable'
import Variable from './entities/variable'

module.exports = {
    async updateVariableRelation (data) {
        const commonWhere = { projectId: data.projectId, deleteFlag: 0 }
        const variableFuncRepository = getRepository(VariableFunc)
        const variableVariableRepository = getRepository(VariableVariable)
        const [allVariables, usedVarFuncs, usedVarVars] = await Promise.all([
            getRepository(Variable).find({ where: commonWhere }),
            variableFuncRepository.find({ where: { ...commonWhere, variableId: data.id } }),
            variableVariableRepository.find({ where: { ...commonWhere, parentVariableId: data.id } })
        ])
        const newUsedVarFunc = []
        const newUsedVarVar = []
        const funcBody = data.variableType === 1 && data.deleteFlag !== 1 ? (JSON.parse(data.defaultValue || '{}').all || '') : ''
        funcBody.replace(/lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/g, (all, first, second, dirKey, funcStr, funcCode) => {
            if (funcCode) {
                const curUsedVarFunc = usedVarFuncs.find((func) => (func.funcCode === funcCode))
                if (curUsedVarFunc) {
                    newUsedVarFunc.push(curUsedVarFunc)
                } else {
                    newUsedVarFunc.push(variableFuncRepository.create({
                        projectId: data.projectId,
                        variableId: data.id,
                        funcCode
                    }))
                }
            }
            if (dirKey) {
                const curVariable = allVariables.find((variable) => (variable.variableCode === dirKey))
                if (!curVariable) throw new Error(`函数中使用的变量【${dirKey}】不存在`)
                const curUsedVarVar = usedVarVars.find((item) => item.variableId === curVariable.variableId)
                if (curUsedVarVar) {
                    newUsedVarVar.push(curUsedVarVar)
                } else {
                    newUsedVarVar.push(variableVariableRepository.create({
                        projectId: data.projectId,
                        parentVariableId: data.id,
                        variableId: curVariable.id
                    }))
                }
            }
        })
        const removeUsedVarFuncs = usedVarFuncs.filter((item) => (!newUsedVarFunc.find(x => x.id === item.id)))
        const removeUsedVarVars = usedVarVars.filter((item) => (!newUsedVarVar.find(x => x.id === item.id)))
        await Promise.all([
            variableFuncRepository.save(newUsedVarFunc),
            variableVariableRepository.save(newUsedVarVar),
            variableFuncRepository.remove(removeUsedVarFuncs),
            variableVariableRepository.remove(removeUsedVarVars)
        ])
    }
}
