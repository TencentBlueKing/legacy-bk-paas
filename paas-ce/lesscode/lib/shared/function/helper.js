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
import { getFunctionTips } from './constant'

export const replaceFuncKeyword = (funcBody, origin, callBack) => {
    // remove comment
    const functionTips = getFunctionTips(origin)
    Object.values(functionTips).forEach((tip) => {
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
