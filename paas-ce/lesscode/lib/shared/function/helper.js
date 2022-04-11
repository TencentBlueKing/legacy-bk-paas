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
import { parse } from 'acorn'
import { FUNCTION_TIPS, FUNCTION_TYPE } from './constant'

/**
 * 替换函数体中的关键字
 * 变量关键字：lesscode['${prop:variableCode}']
 * 函数关键字：lesscode['${func:funcCode}']()
 * @param {*} funcBody 函数体内容
 * @param {*} origin 域名，匹配 tips 使用
 * @param {*} callBack 匹配到关键字后的执行回调函数
 * @returns 返回替换完成后的字符串
 */
export const replaceFuncKeyword = (funcBody, callBack) => {
    // remove comment
    Object.values(FUNCTION_TIPS).forEach((tip) => {
        funcBody = funcBody.replace(tip, '')
    })

    // parse keyword
    const commentsPositions = []
    parse(funcBody, {
        onComment (isBlock, text, start, end) {
            commentsPositions.push({
                start,
                end
            })
        },
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
    })
    return funcBody.replace(/lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/g, (all, first, second, dirKey, funcStr, funcCode, index) => {
        const isInComments = commentsPositions.some(position => position.start <= index && position.end >= index)
        return isInComments ? all : callBack(all, first, second, dirKey, funcStr, funcCode)
    })
}

/**
 * 替换函数参数里面的关键字 {{ funcCode || variableCode }}
 * @param {*} param 参数字符串
 * @param {*} callBack 匹配到关键字后的执行回调函数
 * @returns 返回替换完成后的字符串
 */
export const replaceFuncParam = (param = '', callBack) => {
    return param.replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
        callBack(variableCode)
    })
}

/**
 * 获取默认函数所有字段
 * @param {*} options 覆盖字段使用
 * @returns 返回一个空函数
 */
export const getDefaultFunction = (options = {}) => {
    return {
        funcName: '',
        funcCode: '',
        funcGroupId: '',
        funcGroupName: '',
        funcType: FUNCTION_TYPE.EMPTY,
        funcParams: [],
        remoteParams: [],
        withToken: 0,
        funcApiUrl: '',
        funcMethod: 'get',
        funcApiData: '',
        funcSummary: '',
        funcBody: FUNCTION_TIPS[FUNCTION_TYPE.EMPTY],
        id: undefined,
        projectId: '',
        versionId: undefined,
        ...options
    }
}

/**
 * 获取导出函数字符串
 * @param {*} functionData
 * @returns 导出函数json字符串
 */
export const getExportFunction = (functionData) => {
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
    const functionList = Array.isArray(functionData) ? functionData : [functionData]
    const funcs = functionList.reduce((acc, cur) => {
        acc.push(getExportFunc(cur))
        return acc
    }, [])
    const source = JSON.stringify(funcs, null, 2)
    return source
}
