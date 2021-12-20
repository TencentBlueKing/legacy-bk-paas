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
import { compile, parseComponent } from 'vue-template-compiler'

/**
 * 解析 script 字符串，获取 export 出来的数据
 * @param {string} script vue 单文件源码字符串 script 部分
 * @returns vue options
 */
const getVueOptions = (script) => {
    const getExportFromContent = toFn(script.replace('export default', 'return'))
    return getExportFromContent()
}

/**
 * 将函数字符串转换为函数
 * @param {string} script 函数字符串
 * @returns 函数
 */
const toFn = (script) => {
    const Fn = Function
    return Fn(script)
}

/**
 * 将 vue 单文件字符串转换为可初始化为组件的数据
 * @param {string} source vue 单文件字符串
 * @returns 可初始化为组件的数据
 */
export default (source) => {
    const { script, styles } = parseComponent(source)
    const { render, staticRenderFns } = compile(source)
    return {
        styles: styles || [],
        script: getVueOptions(script.content || ''),
        render: toFn(render),
        staticRenderFns: staticRenderFns.map(toFn)
    }
}
