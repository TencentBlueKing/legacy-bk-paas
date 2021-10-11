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

/**
 * sql cvs json 解析主流程
 * 用于将多个解析结果串联起来
 */
export class {
    /**
     * 传入原始数据json
     * @param {*} json 原始数据json
     */
    constructor (json) {
        this.json = json
    }

    /**
     * 导入
     * @param {*} parser 具体执行导入分析的实例
     * @returns 返回实例，方便链式调用
     */
    import (parser) {
        return parser.import(this)
    }

    /**
     * 导出
     * @param {*} parser 具体执行导出的实例
     * @returns 返回导出结果
     */
    export (parser) {
        return parser.export(this)
    }
}
