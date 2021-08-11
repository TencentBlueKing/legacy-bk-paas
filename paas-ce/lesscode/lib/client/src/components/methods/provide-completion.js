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

import store from '@/store'
import { camelCase, camelCaseTransformMerge } from 'change-case'
import { walkGrid } from '@/common/util'

if (window.monaco) registerCompletion()
else window.onload = registerCompletion

function registerCompletion () {
    monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems
    })
}

function provideCompletionItems (model, position) {
    const word = model.getWordUntilPosition(position)
    const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
    }
    return {
        suggestions: createDependencyProposals(range)
    }
}

function createDependencyProposals (range) {
    const suggestions = []
    // 添加变量
    const targetData = store.getters['drag/targetData']
    const variableList = store.getters['variable/variableList'] || []
    const varSuggest = []
    const callBack = (data) => {
        const renderDirectives = data.renderDirectives || []
        const id = data.componentId
        renderDirectives.forEach((directive) => {
            const val = directive.val
            const componentType = ['render-grid', 'free-layout'].includes(data.type) ? '布局' : '组件'
            function addSug (variableCode) {
                const curVar = varSuggest.find((sug) => (sug.val === variableCode))
                const { type, modifiers = '', prop = '' } = directive
                let sugStr
                switch (type) {
                    case 'v-model':
                        sugStr = `v-model`
                        break
                    default:
                        const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
                        sugStr = `${type}${prop ? `:${prop}` : ''}${modifierStr}`
                        break
                }
                if (curVar) {
                    curVar.documentation[id] = {
                        type: componentType,
                        suggest: [...((curVar.documentation[id] || {}).suggest || []), sugStr]
                    }
                } else {
                    varSuggest.push({
                        val: variableCode,
                        documentation: {
                            [id]: {
                                type: componentType,
                                suggest: [sugStr]
                            }
                        }
                    })
                }
            }
            if (val && val !== '' && directive.valType === 'variable') {
                addSug(val)
            }
            if (val && val !== '' && directive.valType === 'expression') {
                variableList.forEach(({ variableCode }) => {
                    if (val.includes(variableCode)) {
                        addSug(variableCode)
                    }
                })
            }
        })
    }
    targetData.forEach((grid, index) => walkGrid(targetData, grid, callBack, callBack, index))
    variableList.forEach((variable) => {
        const sug = varSuggest.find(sug => sug.val === variable.variableCode) || {}
        const documentations = sug.documentation || {}
        let documentation = '该变量暂未在组件中使用'
        if (Object.keys(documentations).length) documentation = `该变量使用于：\n`
        for (const key in documentations) {
            const sugs = documentations[key] || {}
            documentation += `${sugs.type}：${key} 的 `
            documentation += `${sugs.suggest.join('、')} 的值\n`
        }
        suggestions.push({
            label: `lesscode.${variable.variableCode}`,
            kind: monaco.languages.CompletionItemKind.Property,
            documentation,
            insertText: `lesscode['\$\{prop:${variable.variableCode}\}']`,
            range
        })
    })
    // 添加方法
    const functionGroups = store.getters['functions/funcGroups'] || []
    functionGroups.forEach((group) => {
        const funcList = group.functionList || []
        funcList.forEach((func) => {
            let documentation = func.funcSummary
            if (documentation) documentation = '函数简介：\n' + documentation
            suggestions.push({
                label: `lesscode.${func.funcName}`,
                kind: monaco.languages.CompletionItemKind.Function,
                documentation,
                insertText: `lesscode['\${func:${func.funcCode}}'](${(func.funcParams || []).join(', ')})`,
                range
            })
        })
    })
    // 添加form表单变量提示
    const formVals = []
    const findForm = (data) => {
        if (data.type === 'widget-form') {
            formVals.push(data.componentId)
        }
    }
    targetData.forEach((grid, index) => walkGrid(targetData, grid, findForm, findForm, index))
    formVals.forEach(componentId => {
        suggestions.push({
            label: `lesscode.${camelCase(componentId, { transform: camelCaseTransformMerge })}model`,
            kind: monaco.languages.CompletionItemKind.Property,
            documentation: `form表单${componentId}对应的model属性值`,
            insertText: `this.${camelCase(componentId, { transform: camelCaseTransformMerge })}model`,
            range
        })
        suggestions.push({
            label: `lesscode.${camelCase(componentId, { transform: camelCaseTransformMerge })}rules`,
            kind: monaco.languages.CompletionItemKind.Property,
            documentation: `form表单${componentId}对应的rules属性值`,
            insertText: `this.${camelCase(componentId, { transform: camelCaseTransformMerge })}rules`,
            range
        })
    })
    return suggestions
}
