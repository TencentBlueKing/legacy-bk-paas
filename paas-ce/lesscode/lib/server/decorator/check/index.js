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

import { LCDataService } from '../../service/data-service'

/**
 * 入参重复检查
 * @param { String } tableFileName 检查重复数据的表名
 * @param { Array } checkList [{ key: 检查表的哪个字段重复, getValue: 如何从参数获取值 }]
 * @param { FUNCTION } getQuery 默认值 () => ({ deleteFlag: 0 })，获取查询全量的查询参数
 */
export const DoubleCheck = ({
    tableFileName,
    checkList,
    getQuery = () => ({ deleteFlag: 0 })
}) => {
    // 参数检查
    checkList.forEach(({ key, getValue }) => {
        if (typeof key !== 'string' || typeof getValue !== 'function') {
            throw Error('使用了 DoubleCheck 装饰器，但是参数类型不正确，请修改后再试')
        }
    })
    return (target, propertyKey, descriptor) => {
        const originValue = descriptor.value
        descriptor.value = async (ctx) => {
            try {
                const { list } = await LCDataService.get({ tableFileName, query: getQuery(ctx) })
                checkList.forEach(({ key, getValue }) => {
                    const value = getValue(ctx)
                    const doubleData = list.find((item) => {
                        if (Array.isArray(value)) {
                            return value.includes(item[key])
                        } else {
                            return value === item[key]
                        }
                    })
                    if (doubleData) {
                        throw new global.BusinessError(`表【${tableFileName}】的【${key}】字段已存在值为【${doubleData[key]}】的数据，请修改后再试`, 400, 400)
                    }
                })

                return await originValue.apply(this, [ctx])
            } catch (error) {
                throw error
            }
        }
    }
}
