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

@Entity({ name: 'layout_inst', comment: '布局实例表' })
export default class extends Base {
    @Column({ type: 'int', comment: '布局模板id' })
    layoutId

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({ type: 'varchar', comment: '模板访问路由路径' })
    routePath

    @Column({ type: 'int', comment: '是否默认空模板' })
    isDefault

    @Column({ type: 'varchar', comment: '模板实例名称' })
    showName

    @Column({ type: 'varchar', comment: '布局英文名称' })
    layoutCode

    @Column({ type: 'text', comment: '模板配置数据' })
    content
}
