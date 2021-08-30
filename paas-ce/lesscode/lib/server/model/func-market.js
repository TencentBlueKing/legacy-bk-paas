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
import FuncMarket from './entities/func-market'

const transformFunc = (func) => {
    func.funcParams = (func.funcParams || []).join(',')
    func.remoteParams = (func.remoteParams || []).join(',')
}

const funcMarket = {
    async getList () {
        const funcMarketRepository = getRepository(FuncMarket)
        const funcList = await funcMarketRepository.find({ deleteFlag: 0 }) || []
        funcList.forEach((func) => {
            func.funcParams = (func.funcParams || '').split(',').filter(v => v)
            func.remoteParams = (func.remoteParams || '').split(',').filter(v => v)
        })
        return funcList
    },

    add (func) {
        transformFunc(func)
        const funcMarketRepository = getRepository(FuncMarket)
        const newFunc = funcMarketRepository.create(func)
        return funcMarketRepository.save(newFunc)
    },

    async update (func) {
        transformFunc(func)
        const funcMarketRepository = getRepository(FuncMarket)
        const editFunc = await funcMarketRepository.findOne({ where: { id: func.id } })
        Object.assign(editFunc, func)
        return funcMarketRepository.save(editFunc)
    },

    async delete (id) {
        const funcMarketRepository = getRepository(FuncMarket)
        const deleteFunc = await funcMarketRepository.findOne({ where: { id } })
        deleteFunc.deleteFlag = 1
        return funcMarketRepository.save(deleteFunc)
    }
}

module.exports = funcMarket
