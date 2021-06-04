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

@Entity({ name: 'operate_log', comment: '操作日志表' })
export default class extends Base {
    @Column({
        type: 'int',
        nullable: true,
        comment: '项目id'
    })
    projectId

    @Column({
        type: 'varchar',
        comment: '操作对象'
    })
    operateObj

    @Column({
        type: 'varchar',
        comment: '对应 perm.perm_code'
    })
    operateCode

    @Column({
        type: 'varchar',
        comment: '对应 perm.perm_desc'
    })
    operateCodeText

    @Column({
        type: 'varchar',
        comment: '操作目标'
    })
    operateTarget

    @Column({
        type: 'int',
        comment: 'user 表主键'
    })
    operateUserId

    @Column({
        type: 'int',
        comment: '操作状态：1为成功，0为失败'
    })
    operateStatus

    @Column({
        type: 'mediumtext',
        comment: '操作请求和响应原始数据'
    })
    operateRaw

    @Column({
        type: 'mediumtext',
        comment: '操作描述'
    })
    operateDesc

    @Column({
        type: 'datetime',
        comment: '操作时间'
    })
    operateTime
}
