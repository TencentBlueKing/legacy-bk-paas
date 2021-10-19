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
 * 数据解析
 * sql csv json 解析主流程
 * 存在 csv -> sql sql -> csv 等转换情况
 * 用于将多个解析结果串联起来
 */
export class DataParse {
    /**
     * 传入原始数据,用于比对导入前后的变化
     * @param {*} dataList 原始数据,表格列表
     */
    constructor (dataList = []) {
        this.originDatas = JSON.parse(JSON.stringify(dataList))
        this.finalDatas = JSON.parse(JSON.stringify(dataList))
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
