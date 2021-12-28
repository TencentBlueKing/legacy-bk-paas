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
import { walkGrid, downloadFile } from '@/common/util'
import { FUNCTION_TYPE, getFunctionTips } from 'shared'
const acorn = require('acorn')

function getCurUsedFuncs () {
    const funcGroups = store.getters['functions/funcGroups']
    const targetData = store.getters['drag/targetData']
    const pageDetail = store.getters['page/pageDetail']

    const usedFuncMap = {}
    let errMessage = ''
    const findUsedFuncsByCode = (code) => {
        if (typeof code === 'object') code = code.methodCode
        if ([undefined, ''].includes(code)) return
        let hasFound = false
        funcGroups.forEach((group) => {
            const functionList = group.functionList || []
            const curFunc = functionList.find((x) => (x.funcCode === code))
            if (curFunc) {
                hasFound = true
                if (!usedFuncMap[curFunc.id]) {
                    usedFuncMap[curFunc.id] = curFunc
                    replaceFuncKeyword(curFunc.funcBody, (all, first, second, dirKey, funcStr, funcCode) => {
                        if (funcCode) findUsedFuncsByCode(funcCode)
                    })
                }
            }
        })
        if (!hasFound) errMessage = `函数【${code}】未找到，请修改后再试`
    }

    const callBack = (component) => {
        const renderProps = component.renderProps || {}
        const isForm = component.type === 'widget-form'
        Object.keys(renderProps).forEach((key) => {
            const { type, payload, val } = renderProps[key] || {}

            if (type === 'remote' || (Array.isArray(type) && type.includes('remote'))) {
                if (payload && payload.methodCode) {
                    const code = payload.methodCode
                    findUsedFuncsByCode(code)
                }
            }

            // form表单简要绑定函数
            if (isForm && key === 'rules') {
                Object.keys(val).forEach((ruleKey) => {
                    if (val[ruleKey] && val[ruleKey].length) {
                        val[ruleKey].map(item => {
                            if (item.type === 'validator' && item.validator) {
                                findUsedFuncsByCode(item.validator)
                            }
                        })
                    }
                })
            }
        })

        const renderSlots = component.renderSlots || {}
        Object.keys(renderSlots).forEach((key) => {
            const { type, payload = {} } = renderSlots[key] || {}

            if (type === 'remote') {
                if (payload && payload.methodData && payload.methodData.methodCode) {
                    findUsedFuncsByCode(payload.methodData.methodCode)
                }
            }
        })

        const renderEvents = component.renderEvents || {}
        Object.keys(renderEvents).forEach((event) => {
            const code = renderEvents[event]
            if (code) findUsedFuncsByCode(code)
        })
    }
    targetData.forEach((grid, index) => walkGrid(targetData, grid, callBack, callBack, index))

    // 生命周期的函数
    Object.keys(pageDetail.lifeCycle || {}).forEach((key) => {
        const code = pageDetail.lifeCycle[key]
        if (code) findUsedFuncsByCode(code)
    })

    return [usedFuncMap, errMessage]
}

// 替换函数中的变量和函数
function replaceFuncKeyword (funcBody = '', callBack) {
    const commentsPositions = []
    const semiIndexs = []
    acorn.parse(funcBody, {
        onComment (isBlock, text, start, end) {
            commentsPositions.push({
                start,
                end
            })
        },
        onInsertedSemicolon (lastTokEnd, lastTokEndLoc) {
            semiIndexs.push(lastTokEnd)
        },
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
    })

    const ret = funcBody.split('').map((c, i) => {
        if (semiIndexs.indexOf(i) > -1) {
            return ';'
        }
        return c
    }).join('')

    return ret.replace(/lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/g, (all, first, second, dirKey, funcStr, funcCode, index) => {
        const isInComments = commentsPositions.some(position => position.start <= index && position.end >= index)
        return isInComments ? all : callBack(all, first, second, dirKey, funcStr, funcCode)
    })
}

function getDefaultFunc (options = {}) {
    const funcTips = getFunctionTips(location.origin)
    return {
        funcName: '',
        funcCode: '',
        funcGroupId: '',
        funcType: FUNCTION_TYPE.EMPTY,
        funcParams: [],
        remoteParams: [],
        withToken: 0,
        funcApiUrl: '',
        funcMethod: 'get',
        funcApiData: '',
        funcSummary: '',
        funcBody: funcTips[FUNCTION_TYPE.EMPTY],
        id: undefined,
        ...options
    }
}

function exportFunction (funcList = [], name = 'lesscode-func.json') {
    function getExportFunc (func) {
        const exportProps = [
            'funcName',
            'funcCode',
            'funcParams',
            'funcBody',
            'funcSummary',
            'funcType',
            'funcMethod',
            'withToken',
            'funcApiData',
            'funcApiUrl',
            'remoteParams'
        ]
        return exportProps.reduce((res, prop) => {
            res[prop] = func[prop]
            return res
        }, {})
    }

    const funcs = funcList.reduce((funcs, func) => {
        funcs.push(getExportFunc(func))
        return funcs
    }, [])
    const source = JSON.stringify(funcs, null, 2)
    downloadFile(source, name)
}

export default {
    getCurUsedFuncs,
    replaceFuncKeyword,
    getDefaultFunc,
    exportFunction
}
