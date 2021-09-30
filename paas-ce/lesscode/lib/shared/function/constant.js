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
 * 函数类型枚举
 */
export const FUNCTION_TYPE = {
    EMPTY: 0,
    REMOTE: 1,
    SERVERLESS: 2
}

/**
 * 函数提示
 */
export function getFunctionTips (perfix) {
    return {
        [FUNCTION_TYPE.EMPTY]: '/**\r\n'
            + '* 1. 空白函数，函数内容完全由用户编写\r\n'
            + '* 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n'
            + '* 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n'
            + '* 4. 用于事件时：函数将在事件触发时执行\r\n'
            + '* 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n'
            + '* 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n'
            + '* 7. 用于属性时示例如下：\r\n'
            + '* return Promise.all([\r\n'
            + `*     this.$http.get('${perfix}/api/data/getMockData'),\r\n`
            + `*     this.$http.post('${perfix}/api/data/postMockData', { value: 2 })\r\n`
            + '* ]).then(([getDataRes, postDataRes]) => {\r\n'
            + '*     return [...getDataRes.data, ...postDataRes.data]\r\n'
            + '* })\r\n'
            + '*/\r\n',
        [FUNCTION_TYPE.REMOTE]: '/**\r\n'
            + '* 1. 远程函数，系统将会根据参数组成 Ajax 请求，由用户在这里编写 Ajax 回调函数\r\n'
            + '* 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n'
            + '* 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n'
            + '* 4. 用于事件时：事件触发时候，系统将发起 Ajax 请求，然后执行用户编写的回调函数\r\n'
            + '* 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n'
            + '* 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n'
            + '* 7. 例如 Api 返回数据使用参数 res 接收，则代码示例如下：return res.data\r\n'
            + '*/\r\n',
        [FUNCTION_TYPE.SERVERLESS]: '/**\r\n'
            + '* 1. 远程函数，系统将会根据参数组成 Ajax 请求，由用户在这里编写 Ajax 回调函数\r\n'
            + '* 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n'
            + '* 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n'
            + '* 4. 用于事件时：事件触发时候，系统将发起 Ajax 请求，然后执行用户编写的回调函数\r\n'
            + '* 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n'
            + '* 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n'
            + '* 7. 例如 Api 返回数据使用参数 res 接收，则代码示例如下：return res.data\r\n'
            + '*/\r\n'
    }
}
