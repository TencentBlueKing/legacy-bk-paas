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

@Entity({ name: 'api', comment: 'Api 管理' })
export default class extends Base {
    // 分类 id
    @Column({ type: 'int' })
    categoryId

    // 名字
    @Column({ type: 'varchar', length: 255 })
    name

    // 标识
    @Column({ type: 'varchar', length: 255 })
    code

    // 系统内置 Api id
    @Column({ type: 'int' })
    systemApiId

    // api 方法
    @Column({ type: 'varchar', length: 50 })
    method

    // url
    @Column({ type: 'varchar', length: 255 })
    url

    // 项目 id
    @Column({ type: 'int' })
    projectId

    // 版本 id
    @Column({ type: 'int' })
    versionId

    // 备注
    @Column({ type: 'varchar', length: 255 })
    summary

    // header 配置
    @Column({ type: 'json' })
    header

    // query 配置
    @Column({ type: 'json' })
    query

    // body 配置
    @Column({ type: 'json' })
    body
}
