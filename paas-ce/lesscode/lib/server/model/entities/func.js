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

import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'func', comment: '函数表' })
export default class extends Base {
    // 函数名字
    @Column({ type: 'varchar', length: 255 })
    funcName

    // 函数参数
    @Column({ type: 'tinytext' })
    funcParams

    // 函数内容
    @Column({ type: 'mediumtext' })
    funcBody

    // 函数分类ID
    @Column({ type: 'int' })
    funcGroupId

    // 函数简介
    @Column({ type: 'tinytext' })
    funcSummary

    // 函数模板类型
    @Column({ type: 'varchar', length: 255 })
    funcType

    // 远程函数方法
    @Column({ type: 'varchar', length: 255 })
    funcMethod

    // 远程函数数据体
    @Column({ type: 'text' })
    funcApiData

    // 是否公开
    @Column({ type: 'int' })
    publicFlag

    // 远程函数url
    @Column({ type: 'varchar', length: 255 })
    funcApiUrl

    // 排序
    @Column({ type: 'int' })
    order
}
