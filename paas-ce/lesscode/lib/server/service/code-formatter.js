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

/**
 * 提供代码格式化或者代码检查服务
 */
import eslintConfig from '../conf/eslint-config'
import {
    ESLint
} from 'eslint'
import {
    ansiparse,
    escapeHtmlStringList
} from '../util'

function getEslintOption (globals = {}, customOptions = {}) {
    const options = {
        useEslintrc: true,
        overrideConfig: {
            ...eslintConfig,
            globals
        },
        ...customOptions
    }
    return options
}

// 检查 eslint
export const checkEslint = async (code, globals = {}) => {
    const options = getEslintOption(globals)
    const eslint = new ESLint(options)
    const results = await eslint.lintText(code || '')
    const formatter = await eslint.loadFormatter('stylish')
    const formateResult = formatter.format(results)
    const errorArr = ansiparse(formateResult)
    if (errorArr.length) {
        const message = escapeHtmlStringList(errorArr.map(x => x.message)).join('')
        throw new global.BusinessError(`<pre style="margin:0">eslint检查不通过，可点击 <i class="bk-drag-icon bk-drag-fix"></i> 进行自动修复：\n${message}</pre>`, 499)
    }
}

// 修复 eslint
export const fixEslint = async (code, globals = {}) => {
    const options = getEslintOption(globals, { fix: true })
    const eslint = new ESLint(options)
    // fix code
    const results = await eslint.lintText(code || '')
    await ESLint.outputFixes(results)
    // get message
    const formatter = await eslint.loadFormatter('stylish')
    const formateRes = formatter.format(results)
    const errorArr = ansiparse(formateRes)
    if (errorArr.length) {
        const message = escapeHtmlStringList(errorArr.map(x => x.message)).join('')
        throw new global.BusinessError(`<pre style="margin:0">自动修复Eslint失败，请手动修复下面的问题后重试：\n${message}</pre>`, 499)
    }
    return results[0].output || ''
}
